import threading
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.models import (
    LabelingRequest, AgentExecution, Product, RegulatoryChange,
    Approval, AuditLog, Notification
)
from ..schemas.schemas import (
    LabelingRequestOut, LabelingRequestCreate, AgentExecutionOut,
    ApprovalActionRequest, RejectionActionRequest, RevisionActionRequest
)
from ..agents.orchestrator import initialize_request_agents, run_agent_pipeline_background
from ..services.audit_service import create_audit_entry

router = APIRouter(prefix="/api/requests", tags=["Labeling Requests"])

@router.get("", response_model=List[LabelingRequestOut])
def list_requests(db: Session = Depends(get_db)):
    return db.query(LabelingRequest).order_by(LabelingRequest.id.desc()).all()

@router.post("", response_model=LabelingRequestOut)
def create_request(data: LabelingRequestCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Generate request number
    count = db.query(LabelingRequest).count() + 1
    req_number = f"LN-2024-{str(count).zfill(4)}"

    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    new_req = LabelingRequest(
        request_number=req_number,
        product_id=data.product_id,
        regulatory_change_id=data.regulatory_change_id,
        title=data.title,
        description=data.description or f"Automated labeling revision for {product.name}",
        markets=data.markets,
        languages=data.languages,
        priority=data.priority,
        status="In Progress",
        compliance_score=92.0,
        risk_level="LOW"
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)

    # Initialize the 8 agents in DB
    initialize_request_agents(db, new_req)

    # Log audit entry
    create_audit_entry(
        db=db,
        actor_name="Rashmi Gowda",
        action_type="REQUEST_CREATED",
        summary=f"Created new labeling request {new_req.request_number} for {product.name}.",
        request_id=new_req.id,
        details={"markets": data.markets, "languages": data.languages}
    )

    # Trigger background pipeline execution
    background_tasks.add_task(run_agent_pipeline_background, new_req.id, 0.8)

    return new_req

@router.get("/{id}", response_model=LabelingRequestOut)
def get_request(id: int, db: Session = Depends(get_db)):
    req = db.query(LabelingRequest).filter(LabelingRequest.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Labeling request not found")
    return req

@router.post("/{id}/run")
def run_request_pipeline(id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    req = db.query(LabelingRequest).filter(LabelingRequest.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Labeling request not found")

    # Reset agents to Pending
    agents = db.query(AgentExecution).filter(AgentExecution.request_id == id).all()
    for ag in agents:
        ag.status = "Pending"
        ag.short_result = "Queued for orchestration"
    req.status = "In Progress"
    db.commit()

    # Launch background task
    background_tasks.add_task(run_agent_pipeline_background, id, 1.0)
    return {"message": "Agent workflow initiated", "request_id": id, "status": "In Progress"}

@router.get("/{id}/agents", response_model=List[AgentExecutionOut])
def get_request_agents(id: int, db: Session = Depends(get_db)):
    return db.query(AgentExecution).filter(
        AgentExecution.request_id == id
    ).order_by(AgentExecution.order_index.asc()).all()

@router.post("/{id}/approve")
def approve_request(id: int, body: ApprovalActionRequest, db: Session = Depends(get_db)):
    req = db.query(LabelingRequest).filter(LabelingRequest.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    # Update human approval agent to Completed
    human_ag = db.query(AgentExecution).filter(
        AgentExecution.request_id == id,
        AgentExecution.agent_key == "human_approval"
    ).first()
    if human_ag:
        human_ag.status = "Completed"
        human_ag.execution_time_display = "Completed"
        human_ag.short_result = f"Approved by {body.electronic_signature}"

    # Update release & audit agent to Completed
    release_ag = db.query(AgentExecution).filter(
        AgentExecution.request_id == id,
        AgentExecution.agent_key == "release_audit"
    ).first()
    if release_ag:
        release_ag.status = "Completed"
        release_ag.execution_time_display = "Completed"
        release_ag.short_result = "Packaging label release package cryptographically sealed."

    req.status = "Approved"
    db.commit()

    # Record Approval
    appr = Approval(
        request_id=req.id,
        user_id=1,
        action="APPROVED",
        comments=body.comments or "All compliance and safety warnings verified against EU MDR 2017/745 & CDSCO requirements.",
        electronic_signature=body.electronic_signature,
        timestamp=datetime.utcnow()
    )
    db.add(appr)

    # Record Audit Log
    create_audit_entry(
        db=db,
        actor_name=body.electronic_signature,
        action_type="APPROVAL",
        summary=f"Formally approved labeling request {req.request_number} for release.",
        request_id=req.id,
        user_id=1,
        details={"signature": body.electronic_signature, "comments": body.comments}
    )

    # Release Audit Entry
    create_audit_entry(
        db=db,
        actor_name="System Release Engine",
        action_type="RELEASE",
        summary=f"Generated release package and synchronized UDI registry for {req.request_number}.",
        request_id=req.id,
        details={"status": "RELEASED", "device": req.product.name}
    )

    # Add notification
    notif = Notification(
        title="Labeling Request Approved & Released",
        message=f"{req.request_number} was officially approved and sealed by {body.electronic_signature}.",
        category="approval",
        link=f"/requests/{req.id}"
    )
    db.add(notif)
    db.commit()

    return {"message": "Request approved and released successfully", "status": "Approved"}

@router.post("/{id}/reject")
def reject_request(id: int, body: RejectionActionRequest, db: Session = Depends(get_db)):
    req = db.query(LabelingRequest).filter(LabelingRequest.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    human_ag = db.query(AgentExecution).filter(
        AgentExecution.request_id == id,
        AgentExecution.agent_key == "human_approval"
    ).first()
    if human_ag:
        human_ag.status = "Failed"
        human_ag.short_result = f"Rejected: {body.rejection_reason}"

    req.status = "Rejected"
    db.commit()

    appr = Approval(
        request_id=req.id,
        user_id=1,
        action="REJECTED",
        rejection_reason=body.rejection_reason,
        electronic_signature=body.electronic_signature,
        timestamp=datetime.utcnow()
    )
    db.add(appr)

    create_audit_entry(
        db=db,
        actor_name=body.electronic_signature,
        action_type="REJECTION",
        summary=f"Rejected labeling request {req.request_number}. Reason: {body.rejection_reason}",
        request_id=req.id,
        user_id=1,
        details={"reason": body.rejection_reason}
    )
    db.commit()
    return {"message": "Request rejected", "status": "Rejected"}

@router.post("/{id}/revision")
def request_revision(id: int, body: RevisionActionRequest, db: Session = Depends(get_db)):
    req = db.query(LabelingRequest).filter(LabelingRequest.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    human_ag = db.query(AgentExecution).filter(
        AgentExecution.request_id == id,
        AgentExecution.agent_key == "human_approval"
    ).first()
    if human_ag:
        human_ag.status = "Needs Review"
        human_ag.short_result = f"Revision requested: {body.comments}"

    req.status = "Revision Requested"
    db.commit()

    appr = Approval(
        request_id=req.id,
        user_id=1,
        action="REVISION_REQUESTED",
        comments=body.comments,
        electronic_signature=body.electronic_signature,
        timestamp=datetime.utcnow()
    )
    db.add(appr)

    create_audit_entry(
        db=db,
        actor_name=body.electronic_signature,
        action_type="REVISION_REQUESTED",
        summary=f"Requested revisions on {req.request_number}: {body.comments}",
        request_id=req.id,
        user_id=1,
        details={"comments": body.comments}
    )
    db.commit()
    return {"message": "Revision requested", "status": "Revision Requested"}

@router.get("/{id}/impact")
def get_request_impact(id: int, db: Session = Depends(get_db)):
    req = db.query(LabelingRequest).filter(LabelingRequest.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    ag = db.query(AgentExecution).filter(
        AgentExecution.request_id == id,
        AgentExecution.agent_key == "change_impact"
    ).first()

    if ag and ag.detailed_output:
        return json.loads(ag.detailed_output)

    return {
        "affected_labels_count": 4,
        "affected_markets_count": 2,
        "affected_languages_count": 2,
        "affected_labels": [
            {"code": "LBL-CS100-IN-EN", "name": "Primary Device Label (India - EN)", "market": "India", "language": "English"},
            {"code": "LBL-CS100-EU-EN", "name": "Primary Device Label (EU - EN)", "market": "EU", "language": "English"},
            {"code": "LBL-CS100-EU-DE", "name": "Primary Device Label (EU - DE)", "market": "EU", "language": "German"},
            {"code": "LBL-CS100-PKG-GL", "name": "Packaging Box & Outer Carton Label", "market": "India, EU", "language": "Multilingual"}
        ],
        "markets": ["India", "EU"],
        "required_actions": [
            "Update primary device labeling to include ISO 7010-W012 fire hazard warning symbol.",
            "Revise German packaging insert to harmonize with Annex I MDR fire safety clause.",
            "Re-generate UDI-DI barcode package metadata for both CDSCO and EUDAMED submissions."
        ]
    }
