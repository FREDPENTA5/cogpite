const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ── Types ──────────────────────────────────────────────────────────────────────

export type BudgetTier = "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE";
export type Complexity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RfpStatus = "PENDING" | "PROCESSING" | "COMPLETE" | "FAILED";
export type PlanTier = "LOCAL_SCOUT" | "ENTERPRISE_HUNTER";
export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

export interface Rfp {
  id: string;
  title: string;
  issuingAgency: string | null;
  country: string | null;
  region: string | null;
  publishedAt: string | null;
  deadline: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  budgetCurrency: string;
  budgetTier: BudgetTier | null;
  complexity: Complexity | null;
  summary: string | null;
  techStack: string[];
  categories: string[];
  confidenceScore: number | null;
  status: RfpStatus;
  isSaved?: boolean;
}

export interface SavedRfp {
  id: string;
  rfp: Rfp;
  notes: string | null;
  savedById: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  name: string;
  active: boolean;
  filters: {
    budgetTier?: BudgetTier;
    complexity?: Complexity;
    country?: string;
    techStack?: string[];
    categories?: string[];
  };
  recentMatches: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string | null;
  read: boolean;
  rfpId: string | null;
  alertId: string | null;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: PlanTier;
  seats: number;
}

export interface Member {
  id: string;
  name: string | null;
  email: string;
  role: WorkspaceRole;
  lastSeenAt: string | null;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: WorkspaceRole;
  workspaceId: string;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface TechStackStat {
  tech: string;
  count: number;
}

export interface AnalyticsData {
  total_complete: number;
  avg_confidence: number;
  deadline_this_week: number;
  by_budget_tier: { tier: string; count: number }[];
  by_complexity: { complexity: string; count: number }[];
  by_country: { country: string; count: number }[];
  rfps_over_time: { date: string; count: number }[];
  top_agencies: { agency: string; count: number }[];
  by_category: { category: string; count: number }[];
}

export interface RfpListResponse {
  data: Rfp[];
  nextCursor: string | null;
}

export interface RfpFilters {
  q?: string;
  budgetTier?: string;
  complexity?: string;
  deadline_before?: string;
  techStack?: string;
  categories?: string;
  cursor?: string;
}

// ── API client ─────────────────────────────────────────────────────────────────

export const api = {
  // RFPs
  listRfps: (params: RfpFilters) =>
    apiFetch<RfpListResponse>("/rfps?" + new URLSearchParams(params as Record<string, string>)),
  getRfp: (id: string) => apiFetch<Rfp>(`/rfps/${id}`),
  saveRfp: (id: string) => apiFetch<{ saved: boolean }>(`/rfps/${id}/save`, { method: "POST" }),
  updateNotes: (id: string, notes: string) =>
    apiFetch<void>(`/rfps/${id}/notes`, { method: "PATCH", body: JSON.stringify({ notes }) }),
  listSaved: (sort?: string) =>
    apiFetch<SavedRfp[]>(`/rfps/saved/list${sort ? `?sort=${sort}` : ""}`),

  // Meta / analytics
  listCategories: () => apiFetch<CategoryStat[]>("/rfps/meta/categories"),
  listTechStacks: () => apiFetch<TechStackStat[]>("/rfps/meta/tech-stacks"),
  getAnalytics: () => apiFetch<AnalyticsData>("/rfps/meta/analytics"),

  // Alerts
  listAlerts: () => apiFetch<Alert[]>("/alerts"),
  createAlert: (data: { name: string; filters: Alert["filters"] }) =>
    apiFetch<Alert>("/alerts", { method: "POST", body: JSON.stringify(data) }),
  toggleAlert: (id: string, active: boolean) =>
    apiFetch<Alert>(`/alerts/${id}/toggle`, { method: "PATCH", body: JSON.stringify({ active }) }),
  deleteAlert: (id: string) => apiFetch<void>(`/alerts/${id}`, { method: "DELETE" }),

  // Notifications
  listNotifications: () => apiFetch<Notification[]>("/notifications"),
  markNotificationRead: (id: string) =>
    apiFetch<void>(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => apiFetch<void>("/notifications/read-all", { method: "PATCH" }),

  // Workspace
  getWorkspace: () => apiFetch<Workspace>("/workspace"),
  updateWorkspace: (data: Partial<Pick<Workspace, "name" | "slug">>) =>
    apiFetch<Workspace>("/workspace", { method: "PATCH", body: JSON.stringify(data) }),
  listMembers: () => apiFetch<Member[]>("/workspace/members"),
  inviteMember: (email: string, role: WorkspaceRole) =>
    apiFetch<void>("/workspace/invite", { method: "POST", body: JSON.stringify({ email, role }) }),
  removeMember: (userId: string) =>
    apiFetch<void>(`/workspace/members/${userId}`, { method: "DELETE" }),

  // Auth / profile
  getProfile: () => apiFetch<UserProfile>("/auth/me"),
  updateProfile: (data: { name?: string; notificationPrefs?: Record<string, unknown> }) =>
    apiFetch<UserProfile>("/auth/me", { method: "PATCH", body: JSON.stringify(data) }),
  changePassword: (data: { current_password: string; new_password: string }) =>
    apiFetch<void>("/auth/password", { method: "PATCH", body: JSON.stringify(data) }),
  login: (email: string, password: string) =>
    apiFetch<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  signup: (data: { name: string; email: string; password: string; workspaceName: string }) =>
    apiFetch<{ token: string }>("/auth/signup", { method: "POST", body: JSON.stringify(data) }),

  // Billing
  checkout: (plan: PlanTier) =>
    apiFetch<{ url: string }>("/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    }),
  portal: () => apiFetch<{ url: string }>("/billing/portal", { method: "POST" }),
};
