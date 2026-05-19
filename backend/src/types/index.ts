import { Request } from 'express';
import { Document, Types } from 'mongoose';

export type UserRole = 'admin' | 'sales';

export type AuthProvider = 'local' | 'google';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  authProvider: AuthProvider;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';
export type LeadSource = 'website' | 'instagram' | 'referral';

export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
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

export interface LeadQueryFilters {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
}
