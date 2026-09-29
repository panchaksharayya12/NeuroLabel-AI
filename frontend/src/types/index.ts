export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar_url?: string;
  created_at: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  model: string;
  device_class: string;
  intended_use?: string;
  description?: string;
  manufacturer: string;
  markets: string;
  primary_language: string;
  image_url?: string;
  created_at: string;
}

export interface LabelVersion {
  id: number;
  version_number: string;
  title?: string;
  content_text: string;
  safety_warning?: string;
  symbols?: string;
  udi_di?: string;
  udi_pi?: string;
  dimensions: string;
  artwork_file_path?: string;
  change_summary?: string;
  status: string;
  created_at: string;
}

export interface Label {
  id: number;
  product_id: number;
  label_code: string;
  name: string;
  market: string;
  language: string;
  label_type: string;
  current_version_str: string;
  status: string;
  compliance_status: string;
  preview_image?: string;
  created_at: string;
  updated_at: string;
  versions?: LabelVersion[];
}

export interface RegulatoryChange {
  id: number;
  change_id: string;
  title: string;
  authority: string;
  jurisdiction: string;
  summary: string;
  required_text: string;
  severity: string;
  category: string;
  effective_date?: string;
  created_at: string;
}

export interface AgentExecution {
  id: number;
  request_id: number;
  agent_name: string;
  agent_key: string;
  status: 'Pending' | 'Running' | 'In Progress' | 'Completed' | 'Failed' | 'Needs Review';
  execution_time_seconds: number;
  execution_time_display: string;
  short_result?: string;
  detailed_output?: string;
  order_index: number;
  started_at?: string;
  completed_at?: string;
}

export interface ComplianceCheck {
  id: number;
  request_id: number;
  category: string;
  rule_name: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  score: number;
  findings?: string;
  standard_reference?: string;
  remediation?: string;
  market: string;
}

export interface ComplianceSummary {
  overall_score: number;
  categories: Record<string, number>;
  passed_count: number;
  warning_count: number;
  failed_count: number;
  key_insights: Array<{
    type: string;
    text: string;
    severity?: string;
    link?: string;
  }>;
  checks: ComplianceCheck[];
}

export interface ArtworkComparison {
  id: number;
  request_id: number;
  original_image_path?: string;
  proposed_image_path?: string;
  diff_image_path?: string;
  difference_percentage: number;
  ssim_score: number;
  detected_changes?: string;
  symbol_differences?: string;
  barcode_status: string;
  layout_shift_detected: boolean;
  status: string;
  created_at: string;
}

export interface TranslationCheck {
  id: number;
  request_id: number;
  source_language: string;
  target_language: string;
  source_text: string;
  target_text: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  terminology_mismatches?: string;
  omitted_segments?: string;
  numeric_consistency: boolean;
  confidence: number;
  created_at: string;
}

export interface RiskAssessment {
  id: number;
  request_id: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_score: number;
  compliance_findings_count: number;
  artwork_findings_count: number;
  translation_findings_count: number;
  unresolved_issues?: string;
  mitigation_recommendation?: string;
  human_oversight_required: boolean;
  created_at: string;
}

export interface Approval {
  id: number;
  request_id: number;
  user_id?: number;
  action: 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
  comments?: string;
  rejection_reason?: string;
  electronic_signature?: string;
  timestamp: string;
}

export interface AuditLog {
  id: number;
  log_id: string;
  request_id?: number;
  user_id?: number;
  actor_name: string;
  action_type: string;
  entity_type: string;
  entity_id?: string;
  summary: string;
  details?: string;
  hash_signature?: string;
  timestamp: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  category: string;
  is_read: boolean;
  link?: string;
  timestamp: string;
}

export interface LabelingRequest {
  id: number;
  request_number: string;
  product_id: number;
  regulatory_change_id?: number;
  title: string;
  description?: string;
  markets: string;
  languages: string;
  status: string;
  priority: string;
  current_label_path?: string;
  proposed_label_path?: string;
  previous_content?: string;
  proposed_content?: string;
  authoring_reason?: string;
  authoring_confidence: number;
  compliance_score: number;
  risk_level: string;
  created_at: string;
  updated_at: string;
  product?: Product;
  regulatory_change?: RegulatoryChange;
  agent_executions: AgentExecution[];
  compliance_checks: ComplianceCheck[];
  artwork_comparisons: ArtworkComparison[];
  translation_checks: TranslationCheck[];
  risk_assessments: RiskAssessment[];
  approvals: Approval[];
  audit_logs: AuditLog[];
}

export interface DashboardData {
  hero_card: {
    badge: string;
    subtitle: string;
    title: string;
    description: string;
    button_text: string;
    request_id: number;
    badge_tag: string;
    product_model: string;
  };
  demo_scenario: {
    title: string;
    status: string;
    product: string;
    markets: string[];
    languages: string[];
    request_id: number;
    image_url: string;
  };
  agent_workflow: AgentExecution[];
  agent_collaboration: Array<{
    agent_name: string;
    agent_key: string;
    timestamp_str: string;
    message: string;
    status: string;
  }>;
  label_preview: {
    product_name: string;
    model: string;
    timestamp: string;
    serial: string;
    warning: string;
    udi_code: string;
    symbols: string[];
    tabs: string[];
    active_tab: string;
    request_id: number;
  };
  compliance_score: {
    overall: number;
    categories: Record<string, number>;
  };
  key_insights: Array<{
    type: string;
    text: string;
    link: string;
  }>;
  demo_scenario_progress: {
    current_step: number;
    steps: Array<{
      name: string;
      status: 'completed' | 'active' | 'pending' | 'locked';
    }>;
  };
  expected_impact: Array<{
    metric: string;
    label: string;
    subtext: string;
  }>;
  metrics: {
    total_requests: number;
    active_requests: number;
    completed_requests: number;
    pending_approval: number;
    average_processing_time: string;
    compliance_issues: number;
    labels_affected: number;
  };
}

export interface SearchResultItem {
  type: 'product' | 'label' | 'regulation' | 'request';
  title: string;
  subtitle: string;
  url: string;
  id: number;
}
