import csv
import io
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models.models import AuditLog, LabelingRequest
from ..schemas.schemas import AuditLogOut

router = APIRouter(prefix="/api/audit-logs", tags=["Audit Trail"])

@router.get("", response_model=List[AuditLogOut])
def get_audit_logs(
    request_id: Optional[int] = None,
    action_type: Optional[str] = None,
    actor_name: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog)
    if request_id:
        query = query.filter(AuditLog.request_id == request_id)
    if action_type:
        query = query.filter(AuditLog.action_type == action_type)
    if actor_name:
        query = query.filter(AuditLog.actor_name.ilike(f"%{actor_name}%"))
    return query.order_by(AuditLog.timestamp.desc()).limit(limit).all()

@router.get("/export")
def export_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()
    output = io.StringIO()
    writer = csv.writer(output)

    # Headers
    writer.writerow([
        "Log ID", "Timestamp (UTC)", "Actor / Agent", "Action Type",
        "Entity Type", "Request ID", "Summary", "Cryptographic Hash (SHA-256)"
    ])

    for l in logs:
        writer.writerow([
            l.log_id,
            l.timestamp.isoformat(),
            l.actor_name,
            l.action_type,
            l.entity_type,
            l.request_id or "",
            l.summary,
            l.hash_signature or ""
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=neurolabel_audit_report.csv"}
    )
