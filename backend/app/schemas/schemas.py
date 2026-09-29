from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    name: str
    email: str
    role: str
    department: str
    avatar_url: Optional[str] = None

class UserOut(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Product Schemas ---
class ProductBase(BaseModel):
    sku: str
    name: str
    model: str
    device_class: str
    intended_use: Optional[str] = None
    description: Optional[str] = None
    manufacturer: str
    markets: str
    primary_language: str
    image_url: Optional[str] = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Label Schemas ---
class LabelVersionOut(BaseModel):
    id: int
    version_number: str
    title: Optional[str] = None
    content_text: str
    safety_warning: Optional[str] = None
    symbols: Optional[str] = None
    udi_di: Optional[str] = None
    udi_pi: Optional[str] = None
    dimensions: str
    artwork_file_path: Optional[str] = None
    change_summary: Optional[str] = None
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class LabelOut(BaseModel):
    id: int
    product_id: int
    label_code: str
    name: str
    market: str
    language: str
    label_type: str
    current_version_str: str
    status: str
    compliance_status: str
    preview_image: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    versions: List[LabelVersionOut] = []
    class Config:
        from_attributes = True

class LabelCreate(BaseModel):
    product_id: int
    label_code: str
    name: str
    market: str
    language: str
    label_type: str = "Primary Packaging Label"
    content_text: str
    safety_warning: Optional[str] = None

# --- Regulatory Change Schemas ---
class RegulatoryChangeBase(BaseModel):
    change_id: str
    title: str
    authority: str
    jurisdiction: str
    summary: str
    required_text: str
    severity: str
    category: str

class RegulatoryChangeOut(RegulatoryChangeBase):
    id: int
    effective_date: Optional[datetime] = None
    created_at: datetime
    class Config:
        from_attributes = True

# --- Agent Schemas ---
class AgentExecutionOut(BaseModel):
    id: int
    request_id: int
    agent_name: str
    agent_key: str
    status: str
    execution_time_seconds: float
    execution_time_display: str
    short_result: Optional[str] = None
    detailed_output: Optional[str] = None
    order_index: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# --- Compliance Schemas ---
class ComplianceCheckOut(BaseModel):
    id: int
    request_id: int
    category: str
    rule_name: str
    status: str # PASS, WARNING, FAIL
    score: float
    findings: Optional[str] = None
    standard_reference: Optional[str] = None
    remediation: Optional[str] = None
    market: str
    class Config:
        from_attributes = True

class ComplianceSummary(BaseModel):
    overall_score: float
    categories: Dict[str, float]
    passed_count: int
    warning_count: int
    failed_count: int
    key_insights: List[Dict[str, Any]]
    checks: List[ComplianceCheckOut]

# --- Artwork Vision Schemas ---
class ArtworkComparisonOut(BaseModel):
    id: int
    request_id: int
    original_image_path: Optional[str] = None
    proposed_image_path: Optional[str] = None
    diff_image_path: Optional[str] = None
    difference_percentage: float
    ssim_score: float
    detected_changes: Optional[str] = None
    symbol_differences: Optional[str] = None
    barcode_status: str
    layout_shift_detected: bool
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# --- Translation Schemas ---
class TranslationCheckOut(BaseModel):
    id: int
    request_id: int
    source_language: str
    target_language: str
    source_text: str
    target_text: str
    status: str
    terminology_mismatches: Optional[str] = None
    omitted_segments: Optional[str] = None
    numeric_consistency: bool
    confidence: float
    created_at: datetime
    class Config:
        from_attributes = True

# --- Risk Assessment Schemas ---
class RiskAssessmentOut(BaseModel):
    id: int
    request_id: int
    risk_level: str
    risk_score: float
    compliance_findings_count: int
    artwork_findings_count: int
    translation_findings_count: int
    unresolved_issues: Optional[str] = None
    mitigation_recommendation: Optional[str] = None
    human_oversight_required: bool
    created_at: datetime
    class Config:
        from_attributes = True

# --- Approval Schemas ---
class ApprovalOut(BaseModel):
    id: int
    request_id: int
    user_id: Optional[int] = None
    action: str
    comments: Optional[str] = None
    rejection_reason: Optional[str] = None
    electronic_signature: Optional[str] = None
    timestamp: datetime
    class Config:
        from_attributes = True

class ApprovalActionRequest(BaseModel):
    comments: Optional[str] = None
    electronic_signature: str = "Rashmi Gowda (Project Lead)"

class RejectionActionRequest(BaseModel):
    rejection_reason: str
    electronic_signature: str = "Rashmi Gowda (Project Lead)"

class RevisionActionRequest(BaseModel):
    comments: str
    electronic_signature: str = "Rashmi Gowda (Project Lead)"

# --- Audit Log Schemas ---
class AuditLogOut(BaseModel):
    id: int
    log_id: str
    request_id: Optional[int] = None
    user_id: Optional[int] = None
    actor_name: str
    action_type: str
    entity_type: str
    entity_id: Optional[str] = None
    summary: str
    details: Optional[str] = None
    hash_signature: Optional[str] = None
    timestamp: datetime
    class Config:
        from_attributes = True

# --- Notification Schemas ---
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    category: str
    is_read: bool
    link: Optional[str] = None
    timestamp: datetime
    class Config:
        from_attributes = True

# --- Labeling Request Schemas ---
class LabelingRequestCreate(BaseModel):
    product_id: int
    regulatory_change_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    markets: str = "India,EU"
    languages: str = "English,German"
    priority: str = "High"

class LabelingRequestOut(BaseModel):
    id: int
    request_number: str
    product_id: int
    regulatory_change_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    markets: str
    languages: str
    status: str
    priority: str
    current_label_path: Optional[str] = None
    proposed_label_path: Optional[str] = None
    previous_content: Optional[str] = None
    proposed_content: Optional[str] = None
    authoring_reason: Optional[str] = None
    authoring_confidence: float
    compliance_score: float
    risk_level: str
    created_at: datetime
    updated_at: datetime
    product: Optional[ProductOut] = None
    regulatory_change: Optional[RegulatoryChangeOut] = None
    agent_executions: List[AgentExecutionOut] = []
    compliance_checks: List[ComplianceCheckOut] = []
    artwork_comparisons: List[ArtworkComparisonOut] = []
    translation_checks: List[TranslationCheckOut] = []
    risk_assessments: List[RiskAssessmentOut] = []
    approvals: List[ApprovalOut] = []
    audit_logs: List[AuditLogOut] = []
    class Config:
        from_attributes = True

# --- Dashboard Schemas ---
class DashboardActivityItem(BaseModel):
    agent_name: str
    agent_key: str
    timestamp_str: str
    message: str
    status: str

class DashboardData(BaseModel):
    hero_card: Dict[str, Any]
    demo_scenario: Dict[str, Any]
    agent_workflow: List[AgentExecutionOut]
    agent_collaboration: List[DashboardActivityItem]
    label_preview: Dict[str, Any]
    compliance_score: Dict[str, Any]
    key_insights: List[Dict[str, Any]]
    demo_scenario_progress: Dict[str, Any]
    expected_impact: List[Dict[str, Any]]
    metrics: Dict[str, Any]

class SearchResultItem(BaseModel):
    type: str # product, label, regulation, request
    title: str
    subtitle: str
    url: str
    id: int
