from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.models import LabelingRequest, AgentExecution, ComplianceCheck, Product, Label, AuditLog
from ..schemas.schemas import DashboardData

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardData)
def get_dashboard_data(db: Session = Depends(get_db)):
    # Retrieve demo request or latest request
    req = db.query(LabelingRequest).filter(LabelingRequest.request_number == "LN-2024-0891").first()
    if not req:
        req = db.query(LabelingRequest).order_by(LabelingRequest.id.desc()).first()

    product = req.product if req else db.query(Product).first()

    # Agent executions
    agent_executions = db.query(AgentExecution).filter(
        AgentExecution.request_id == req.id
    ).order_by(AgentExecution.order_index.asc()).all() if req else []

    # Agent collaboration feed items
    collaboration_feed = [
        {
            "agent_name": "Change Impact Agent",
            "agent_key": "change_impact",
            "timestamp_str": "02:14 PM",
            "message": "Identified 4 affected labels across 2 markets (India, EU).",
            "status": "Completed"
        },
        {
            "agent_name": "Label Authoring Agent",
            "agent_key": "label_authoring",
            "timestamp_str": "02:18 PM",
            "message": "Generated updated label content with new safety warning.",
            "status": "Completed"
        },
        {
            "agent_name": "Compliance Agent",
            "agent_key": "compliance",
            "timestamp_str": "02:21 PM",
            "message": "Verified regulatory requirements for India & EU. 1 minor issue found.",
            "status": "Completed"
        },
        {
            "agent_name": "Artwork Vision Agent",
            "agent_key": "artwork_vision",
            "timestamp_str": "02:24 PM",
            "message": "Detected 1 layout issue (warning symbol size) in EU artwork. Suggested fix applied.",
            "status": "Completed"
        },
        {
            "agent_name": "Translation Agent",
            "agent_key": "translation",
            "timestamp_str": "02:26 PM",
            "message": "Verified translations for English and German. 2 terminology mismatches flagged.",
            "status": "In Progress"
        }
    ]

    # Key Insights
    key_insights = [
        {"type": "error", "text": "1 warning symbol size issue detected (EU).", "link": "/artwork"},
        {"type": "info", "text": "2 translation terminology mismatches (DE).", "link": "/translation"},
        {"type": "warning", "text": "1 minor compliance gap (India).", "link": "/compliance"},
        {"type": "success", "text": "All other checks passed.", "link": "/compliance"}
    ]

    # Expected impact metrics (Prototype Estimates)
    expected_impact = [
        {"metric": "↓ 70%", "label": "Manual Effort", "subtext": "Prototype Estimate"},
        {"metric": "↓ 60%", "label": "Review Time", "subtext": "Prototype Estimate"},
        {"metric": "↓ 80%", "label": "Errors", "subtext": "Prototype Estimate"},
        {"metric": "↑ 100%", "label": "Traceability", "subtext": "21 CFR Part 11"},
        {"metric": "↑ 100%", "label": "Compliance", "subtext": "MDR & CDSCO"}
    ]

    total_reqs = db.query(LabelingRequest).count()
    active_reqs = db.query(LabelingRequest).filter(LabelingRequest.status.in_(["In Progress", "Awaiting Human Approval"])).count()
    completed_reqs = db.query(LabelingRequest).filter(LabelingRequest.status == "Approved").count()
    pending_approval = db.query(LabelingRequest).filter(LabelingRequest.status == "Awaiting Human Approval").count()

    return {
        "hero_card": {
            "badge": "LIVE",
            "subtitle": "Change Detected",
            "title": req.title if req else "Safety Warning Update",
            "description": "New regulatory requirement for fire risk during use.",
            "button_text": "View Details →",
            "request_id": req.id if req else 1,
            "badge_tag": "Update Required Across 2 markets (India, EU)",
            "product_model": f"{product.name} Model: {product.model}" if product else "CardioSense Monitor Model: CS-100"
        },
        "demo_scenario": {
            "title": "Demo Scenario",
            "status": req.status if req else "In Progress",
            "product": f"{product.name} ({product.model})" if product else "CardioSense Monitor (CS-100)",
            "markets": ["India", "EU"],
            "languages": ["English", "German"],
            "request_id": req.id if req else 1,
            "image_url": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80"
        },
        "agent_workflow": agent_executions,
        "agent_collaboration": collaboration_feed,
        "label_preview": {
            "product_name": "CardioSense Monitor",
            "model": "CS-100",
            "timestamp": "02:14 PM",
            "serial": "123456789",
            "warning": "⚠ Fire risk - Do not dispose of in fire. Risk of explosion.",
            "udi_code": "(01)00850012345678(21)123456789",
            "symbols": ["CE 0123", "IPX4", "ISO 7010-W012"],
            "tabs": ["English (India)", "German (EU)", "Comparison"],
            "active_tab": "English (India)",
            "request_id": req.id if req else 1
        },
        "compliance_score": {
            "overall": int(req.compliance_score) if req else 92,
            "categories": {
                "Product Info": 100,
                "Regulatory": 90,
                "UDI": 95,
                "Safety Warnings": 85,
                "Symbols": 90,
                "Country Specific": 88
            }
        },
        "key_insights": key_insights,
        "demo_scenario_progress": {
            "current_step": 5 if req and req.status == "Awaiting Human Approval" else (4 if req and req.status == "In Progress" else 6),
            "steps": [
                {"name": "Change Detected", "status": "completed"},
                {"name": "Analysis Complete", "status": "completed"},
                {"name": "Label Draft Ready", "status": "completed"},
                {"name": "Validations Complete", "status": "completed" if req and req.status in ["Awaiting Human Approval", "Approved"] else "active"},
                {"name": "Awaiting Human Approval", "status": "active" if req and req.status == "Awaiting Human Approval" else ("completed" if req and req.status == "Approved" else "pending")},
                {"name": "Release", "status": "completed" if req and req.status == "Approved" else "locked"}
            ]
        },
        "expected_impact": expected_impact,
        "metrics": {
            "total_requests": total_reqs,
            "active_requests": active_reqs,
            "completed_requests": completed_reqs,
            "pending_approval": pending_approval,
            "average_processing_time": "12.4 min",
            "compliance_issues": 1,
            "labels_affected": 4
        }
    }
