import json
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean
)
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    role = Column(String(100), default="Project Lead")
    department = Column(String(100), default="Regulatory Affairs")
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    approvals = relationship("Approval", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    model = Column(String(100), nullable=False)
    device_class = Column(String(50), default="Class IIb")
    intended_use = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    manufacturer = Column(String(200), default="NeuroNexa Technologies Inc.")
    markets = Column(Text, default="India,EU") # Comma separated
    primary_language = Column(String(50), default="English")
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    labels = relationship("Label", back_populates="product", cascade="all, delete-orphan")
    requests = relationship("LabelingRequest", back_populates="product")


class Label(Base):
    __tablename__ = "labels"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    label_code = Column(String(100), unique=True, index=True, nullable=False) # e.g. LBL-CS100-IN-EN
    name = Column(String(200), nullable=False)
    market = Column(String(50), nullable=False) # India, EU, US, etc.
    language = Column(String(50), nullable=False) # English, German, etc.
    label_type = Column(String(100), default="Primary Packaging Label")
    current_version_str = Column(String(20), default="v1.0")
    status = Column(String(50), default="Active") # Active, Under Revision, Deprecated
    compliance_status = Column(String(50), default="Compliant") # Compliant, Warning, Non-Compliant
    preview_image = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = relationship("Product", back_populates="labels")
    versions = relationship("LabelVersion", back_populates="label", cascade="all, delete-orphan")


class LabelVersion(Base):
    __tablename__ = "label_versions"

    id = Column(Integer, primary_key=True, index=True)
    label_id = Column(Integer, ForeignKey("labels.id"), nullable=False)
    version_number = Column(String(20), nullable=False)
    title = Column(String(200), nullable=True)
    content_text = Column(Text, nullable=False)
    safety_warning = Column(Text, nullable=True)
    symbols = Column(Text, nullable=True) # JSON list of symbols
    udi_di = Column(String(100), nullable=True)
    udi_pi = Column(String(100), nullable=True)
    dimensions = Column(String(50), default="100mm x 60mm")
    artwork_file_path = Column(String(500), nullable=True)
    change_summary = Column(Text, nullable=True)
    status = Column(String(50), default="Approved") # Draft, In Review, Approved, Superseded
    created_at = Column(DateTime, default=datetime.utcnow)

    label = relationship("Label", back_populates="versions")


class RegulatoryChange(Base):
    __tablename__ = "regulatory_changes"

    id = Column(Integer, primary_key=True, index=True)
    change_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. REG-2024-MDR-04
    title = Column(String(250), nullable=False)
    authority = Column(String(100), nullable=False) # EU MDR, CDSCO, FDA, etc.
    jurisdiction = Column(String(100), nullable=False) # India, EU, Global
    effective_date = Column(DateTime, nullable=True)
    summary = Column(Text, nullable=False)
    required_text = Column(Text, nullable=False)
    severity = Column(String(50), default="High") # Low, Medium, High, Critical
    category = Column(String(100), default="Safety Warning Update")
    created_at = Column(DateTime, default=datetime.utcnow)

    requests = relationship("LabelingRequest", back_populates="regulatory_change")


class LabelingRequest(Base):
    __tablename__ = "labeling_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_number = Column(String(100), unique=True, index=True, nullable=False) # e.g. LN-2024-0891
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    regulatory_change_id = Column(Integer, ForeignKey("regulatory_changes.id"), nullable=True)
    title = Column(String(250), nullable=False)
    description = Column(Text, nullable=True)
    markets = Column(Text, default="India,EU") # Comma separated
    languages = Column(Text, default="English,German")
    status = Column(String(50), default="In Progress") # In Progress, Awaiting Human Approval, Approved, Rejected, Revision Requested
    priority = Column(String(50), default="High")
    current_label_path = Column(String(500), nullable=True)
    proposed_label_path = Column(String(500), nullable=True)
    previous_content = Column(Text, nullable=True)
    proposed_content = Column(Text, nullable=True)
    authoring_reason = Column(Text, nullable=True)
    authoring_confidence = Column(Float, default=0.96)
    compliance_score = Column(Float, default=92.0)
    risk_level = Column(String(50), default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = relationship("Product", back_populates="requests")
    regulatory_change = relationship("RegulatoryChange", back_populates="requests")
    agent_executions = relationship("AgentExecution", back_populates="request", cascade="all, delete-orphan")
    compliance_checks = relationship("ComplianceCheck", back_populates="request", cascade="all, delete-orphan")
    artwork_comparisons = relationship("ArtworkComparison", back_populates="request", cascade="all, delete-orphan")
    translation_checks = relationship("TranslationCheck", back_populates="request", cascade="all, delete-orphan")
    risk_assessments = relationship("RiskAssessment", back_populates="request", cascade="all, delete-orphan")
    approvals = relationship("Approval", back_populates="request", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="request", cascade="all, delete-orphan")


class AgentExecution(Base):
    __tablename__ = "agent_executions"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("labeling_requests.id"), nullable=False)
    agent_name = Column(String(100), nullable=False)
    agent_key = Column(String(50), nullable=False) # change_impact, label_authoring, compliance, artwork_vision, translation, risk_quality, human_approval, release_audit
    status = Column(String(50), default="Pending") # Pending, Running, Completed, Failed, Needs Review
    execution_time_seconds = Column(Float, default=0.0)
    execution_time_display = Column(String(50), default="⏱ 1 min")
    short_result = Column(Text, nullable=True)
    detailed_output = Column(Text, nullable=True) # JSON payload
    order_index = Column(Integer, default=0)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    request = relationship("LabelingRequest", back_populates="agent_executions")


class ComplianceCheck(Base):
    __tablename__ = "compliance_checks"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("labeling_requests.id"), nullable=False)
    category = Column(String(100), nullable=False) # Product Info, Regulatory, UDI, Safety Warnings, Symbols, Country Specific
    rule_name = Column(String(200), nullable=False)
    status = Column(String(50), default="PASS") # PASS, WARNING, FAIL
    score = Column(Float, default=100.0)
    findings = Column(Text, nullable=True)
    standard_reference = Column(String(100), nullable=True) # e.g. EU MDR Annex I, CDSCO Rule 109
    remediation = Column(Text, nullable=True)
    market = Column(String(50), default="EU")

    request = relationship("LabelingRequest", back_populates="compliance_checks")


class ArtworkComparison(Base):
    __tablename__ = "artwork_comparisons"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("labeling_requests.id"), nullable=False)
    original_image_path = Column(String(500), nullable=True)
    proposed_image_path = Column(String(500), nullable=True)
    diff_image_path = Column(String(500), nullable=True)
    difference_percentage = Column(Float, default=0.0)
    ssim_score = Column(Float, default=1.0)
    detected_changes = Column(Text, nullable=True) # JSON list
    symbol_differences = Column(Text, nullable=True)
    barcode_status = Column(String(50), default="Valid")
    layout_shift_detected = Column(Boolean, default=False)
    status = Column(String(50), default="Completed")
    created_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("LabelingRequest", back_populates="artwork_comparisons")


class TranslationCheck(Base):
    __tablename__ = "translation_checks"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("labeling_requests.id"), nullable=False)
    source_language = Column(String(50), default="English")
    target_language = Column(String(50), default="German")
    source_text = Column(Text, nullable=False)
    target_text = Column(Text, nullable=False)
    status = Column(String(50), default="WARNING") # PASS, WARNING, FAIL
    terminology_mismatches = Column(Text, nullable=True) # JSON list
    omitted_segments = Column(Text, nullable=True)
    numeric_consistency = Column(Boolean, default=True)
    confidence = Column(Float, default=0.94)
    created_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("LabelingRequest", back_populates="translation_checks")


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("labeling_requests.id"), nullable=False)
    risk_level = Column(String(50), default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    risk_score = Column(Float, default=18.5) # 0 to 100, lower is safer
    compliance_findings_count = Column(Integer, default=1)
    artwork_findings_count = Column(Integer, default=1)
    translation_findings_count = Column(Integer, default=2)
    unresolved_issues = Column(Text, nullable=True) # JSON
    mitigation_recommendation = Column(Text, nullable=True)
    human_oversight_required = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("LabelingRequest", back_populates="risk_assessments")


class Approval(Base):
    __tablename__ = "approvals"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("labeling_requests.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(50), nullable=False) # APPROVED, REJECTED, REVISION_REQUESTED
    comments = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    electronic_signature = Column(String(200), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    request = relationship("LabelingRequest", back_populates="approvals")
    user = relationship("User", back_populates="approvals")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    log_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. AUD-90123
    request_id = Column(Integer, ForeignKey("labeling_requests.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    actor_name = Column(String(100), nullable=False)
    action_type = Column(String(100), nullable=False) # CHANGE_DETECTED, AGENT_EXECUTION, COMPLIANCE_EVAL, APPROVAL, REJECTION, RELEASE, EXPORT
    entity_type = Column(String(100), default="LabelingRequest")
    entity_id = Column(String(100), nullable=True)
    summary = Column(Text, nullable=False)
    details = Column(Text, nullable=True) # JSON or descriptive
    hash_signature = Column(String(128), nullable=True) # SHA-256 for CFR 21 Part 11 integrity
    timestamp = Column(DateTime, default=datetime.utcnow)

    request = relationship("LabelingRequest", back_populates="audit_logs")
    user = relationship("User", back_populates="audit_logs")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(50), default="alert") # alert, agent, compliance, approval
    is_read = Column(Boolean, default=False)
    link = Column(String(200), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
