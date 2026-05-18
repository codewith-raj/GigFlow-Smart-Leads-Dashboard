// ─── User Types ────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'sales';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// ─── Lead Types ────────────────────────────────────────────────────────────────

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';
export type LeadSource = 'website' | 'instagram' | 'referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: User | string;
  createdAt: string;
  updatedAt: string;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
}

// ─── Auth Types ────────────────────────────────────────────────────────────────

export interface AuthUser {
  user: User;
  token: string;
}

// ─── Filter Types ──────────────────────────────────────────────────────────────

export interface LeadFilters {
  page: number;
  limit: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort: 'latest' | 'oldest';
}

// ─── Form Types ────────────────────────────────────────────────────────────────

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface LeadForm {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

// ─── Stats Types ──────────────────────────────────────────────────────────────

export interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
}
