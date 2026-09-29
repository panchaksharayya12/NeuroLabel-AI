import {
  DashboardData, LabelingRequest, Product, RegulatoryChange,
  Label, LabelVersion, ComplianceSummary, ArtworkComparison,
  TranslationCheck, AuditLog, NotificationItem, SearchResultItem
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errBody.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Dashboard
  getDashboard: () => fetchJson<DashboardData>('/api/dashboard'),

  // Requests
  getRequests: () => fetchJson<LabelingRequest[]>('/api/requests'),
  getRequest: (id: number) => fetchJson<LabelingRequest>(`/api/requests/${id}`),
  createRequest: (data: {
    product_id: number;
    regulatory_change_id?: number;
    title: string;
    description?: string;
    markets: string;
    languages: string;
    priority?: string;
  }) => fetchJson<LabelingRequest>('/api/requests', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  runRequestPipeline: (id: number) => fetchJson<{ message: string; request_id: number; status: string }>(`/api/requests/${id}/run`, {
    method: 'POST'
  }),
  getRequestAgents: (id: number) => fetchJson<any[]>(`/api/requests/${id}/agents`),
  approveRequest: (id: number, data: { comments?: string; electronic_signature: string }) => 
    fetchJson<{ message: string; status: string }>(`/api/requests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  rejectRequest: (id: number, data: { rejection_reason: string; electronic_signature: string }) =>
    fetchJson<{ message: string; status: string }>(`/api/requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  requestRevision: (id: number, data: { comments: string; electronic_signature: string }) =>
    fetchJson<{ message: string; status: string }>(`/api/requests/${id}/revision`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getRequestImpact: (id: number) => fetchJson<any>(`/api/requests/${id}/impact`),

  // Labels
  getLabels: (params?: { product_id?: number; market?: string; language?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.product_id) q.append('product_id', params.product_id.toString());
    if (params?.market) q.append('market', params.market);
    if (params?.language) q.append('language', params.language);
    if (params?.status) q.append('status', params.status);
    return fetchJson<Label[]>(`/api/labels?${q.toString()}`);
  },
  getLabel: (id: number) => fetchJson<Label>(`/api/labels/${id}`),
  getLabelVersions: (id: number) => fetchJson<LabelVersion[]>(`/api/labels/${id}/versions`),
  createLabel: (data: any) => fetchJson<Label>('/api/labels', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Products & Regulations
  getProducts: () => fetchJson<Product[]>('/api/products'),
  getProduct: (id: number) => fetchJson<Product>(`/api/products/${id}`),
  getRegulations: () => fetchJson<RegulatoryChange[]>('/api/products/regulations/all'),

  // Compliance
  getCompliance: (requestId: number) => fetchJson<ComplianceSummary>(`/api/compliance/${requestId}`),

  // Artwork
  getArtwork: (requestId: number) => fetchJson<ArtworkComparison>(`/api/artwork/${requestId}`),
  compareArtwork: async (formData: FormData): Promise<any> => {
    const res = await fetch(`${API_BASE}/api/artwork/compare`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Artwork comparison failed');
    return await res.json();
  },

  // Translation
  getTranslation: (requestId: number) => fetchJson<TranslationCheck>(`/api/translation/${requestId}`),
  validateTranslation: (data: { source_language: string; target_language: string; source_text: string; target_text: string }) =>
    fetchJson<any>('/api/translation/validate', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Audit Logs
  getAuditLogs: (params?: { request_id?: number; action_type?: string; actor_name?: string }) => {
    const q = new URLSearchParams();
    if (params?.request_id) q.append('request_id', params.request_id.toString());
    if (params?.action_type) q.append('action_type', params.action_type);
    if (params?.actor_name) q.append('actor_name', params.actor_name);
    return fetchJson<AuditLog[]>(`/api/audit-logs?${q.toString()}`);
  },
  getAuditLogsExportUrl: () => `${API_BASE}/api/audit-logs/export`,

  // Notifications
  getNotifications: () => fetchJson<NotificationItem[]>('/api/notifications'),
  markNotificationRead: (id: number) => fetchJson<{ message: string }>(`/api/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () => fetchJson<{ message: string }>('/api/notifications/read-all', { method: 'POST' }),

  // Search
  search: (query: string) => fetchJson<SearchResultItem[]>(`/api/search?q=${encodeURIComponent(query)}`),

  // Settings
  getSettings: () => fetchJson<any>('/api/settings'),
  updateSettings: (data: any) => fetchJson<any>('/api/settings', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

export const getMediaUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};
