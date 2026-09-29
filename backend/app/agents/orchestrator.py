import time
import json
from datetime import datetime
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.models import LabelingRequest, AgentExecution, Notification
from ..services.audit_service import create_audit_entry
from .change_impact_agent import ChangeImpactAgent
from .label_authoring_agent import LabelAuthoringAgent
from .compliance_agent import ComplianceAgent
from .artwork_vision_agent import ArtworkVisionAgent
from .translation_agent import TranslationAgent
from .risk_quality_agent import RiskQualityAgent

AGENT_STEPS = [
    ("change_impact", "Change Impact Agent", ChangeImpactAgent),
    ("label_authoring", "Label Authoring Agent", LabelAuthoringAgent),
    ("compliance", "Compliance Agent", ComplianceAgent),
    ("artwork_vision", "Artwork Vision Agent", ArtworkVisionAgent),
    ("translation", "Translation Agent", TranslationAgent),
    ("risk_quality", "Risk & Quality Agent", RiskQualityAgent),
]

def initialize_request_agents(db: Session, request: LabelingRequest):
    """Initializes the 8 agent workflow records in database if not present."""
    existing = db.query(AgentExecution).filter(AgentExecution.request_id == request.id).all()
    if existing:
        return

    all_workflow_agents = [
        ("change_impact", "Change Impact Agent", 1),
        ("label_authoring", "Label Authoring Agent", 2),
        ("compliance", "Compliance Agent", 3),
        ("artwork_vision", "Artwork Vision Agent", 4),
        ("translation", "Translation Agent", 5),
        ("risk_quality", "Risk & Quality Agent", 6),
        ("human_approval", "Human Approval", 7),
        ("release_audit", "Release & Audit Trail", 8),
    ]

    for key, name, order in all_workflow_agents:
        ag = AgentExecution(
            request_id=request.id,
            agent_name=name,
            agent_key=key,
            status="Pending",
            execution_time_seconds=0.0,
            execution_time_display="Pending",
            short_result="Awaiting previous agent",
            order_index=order
        )
        db.add(ag)
    db.commit()

def run_agent_pipeline_background(request_id: int, step_delay: float = 1.0):
    """
    Executes the agent pipeline sequentially in background, updating DB state
    so real-time polling shows 'Running...' -> 'Completed' smoothly.
    """
    db = SessionLocal()
    try:
        request = db.query(LabelingRequest).filter(LabelingRequest.id == request_id).first()
        if not request:
            return

        request.status = "In Progress"
        db.commit()

        # Execute automated agents 1 to 6
        for key, name, agent_cls in AGENT_STEPS:
            ag_record = db.query(AgentExecution).filter(
                AgentExecution.request_id == request_id,
                AgentExecution.agent_key == key
            ).first()

            if not ag_record:
                continue

            # Mark Running
            ag_record.status = "Running"
            ag_record.started_at = datetime.utcnow()
            ag_record.short_result = "Analyzing requirements and data..."
            db.commit()

            # Small simulated processing delay for realistic agent collaboration feel
            if step_delay > 0:
                time.sleep(step_delay)

            # Run agent logic
            start_t = time.time()
            result = agent_cls.run(db, request)
            exec_time = round(time.time() - start_t + (result.get("execution_time", 2.0)), 1)

            ag_record.status = "Completed"
            ag_record.completed_at = datetime.utcnow()
            ag_record.execution_time_seconds = exec_time
            ag_record.execution_time_display = f"⏱ {max(1, int(exec_time))} min"
            ag_record.short_result = result.get("short_result", "Completed successfully")
            ag_record.detailed_output = result.get("detailed_output")
            db.commit()

            # Log audit entry
            create_audit_entry(
                db=db,
                actor_name=f"AI Agent: {name}",
                action_type="AGENT_EXECUTION",
                summary=result.get("short_result", f"{name} executed."),
                request_id=request_id,
                details={"agent": key, "execution_time": exec_time}
            )

        # Human Approval Agent status becomes "Awaiting Review"
        human_ag = db.query(AgentExecution).filter(
            AgentExecution.request_id == request_id,
            AgentExecution.agent_key == "human_approval"
        ).first()
        if human_ag:
            human_ag.status = "Needs Review"
            human_ag.short_result = "Awaiting final sign-off from Project Lead."
            human_ag.execution_time_display = "Pending"

        request.status = "Awaiting Human Approval"
        db.commit()

        # Add Notification
        notif = Notification(
            title="Analysis Complete - Approval Required",
            message=f"Agent workflow complete for {request.request_number} ({request.title}). Awaiting human approval.",
            category="approval",
            link=f"/requests/{request.id}"
        )
        db.add(notif)
        db.commit()

    except Exception as e:
        print(f"Error in pipeline execution: {e}")
        db.rollback()
    finally:
        db.close()
