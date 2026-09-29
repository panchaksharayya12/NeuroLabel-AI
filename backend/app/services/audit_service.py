import hashlib
import json
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.models import AuditLog

def create_audit_entry(
    db: Session,
    actor_name: str,
    action_type: str,
    summary: str,
    entity_type: str = "LabelingRequest",
    entity_id: str = None,
    request_id: int = None,
    user_id: int = None,
    details: dict = None
) -> AuditLog:
    """
    Creates a tamper-evident audit log entry conforming to 21 CFR Part 11 requirements.
    Calculates a SHA-256 hash across actor, action, timestamp, entity, and payload details.
    """
    now = datetime.utcnow()
    details_str = json.dumps(details) if details else ""
    
    # Calculate hash signature
    raw_payload = f"{now.isoformat()}|{actor_name}|{action_type}|{entity_type}|{entity_id}|{details_str}"
    hash_signature = hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()
    
    # Generate human-readable Log ID
    log_id = f"AUD-{int(now.timestamp())}-{hash_signature[:6].upper()}"
    
    audit_entry = AuditLog(
        log_id=log_id,
        request_id=request_id,
        user_id=user_id,
        actor_name=actor_name,
        action_type=action_type,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id else None,
        summary=summary,
        details=details_str,
        hash_signature=hash_signature,
        timestamp=now
    )
    
    db.add(audit_entry)
    db.commit()
    db.refresh(audit_entry)
    return audit_entry
