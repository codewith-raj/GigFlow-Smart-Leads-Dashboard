
export type UserRole = 'admin' | 'sales';

export type AuthProvider = 'local' | 'google';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  authProvider?: AuthProvider;
  phone?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileForm {
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  bio?: string;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

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

export interface AuthUser {
  user: User;
  token: string;
}

export interface LeadFilters {
  page: number;
  limit: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort: 'latest' | 'oldest';
}

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

export interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
}
