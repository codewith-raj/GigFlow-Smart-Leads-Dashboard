import axiosInstance from './axios';
import { ApiResponse, AuthUser, LoginForm, RegisterForm, User } from '@/types';

export const authApi = {
  register: async (data: RegisterForm): Promise<ApiResponse<AuthUser>> => {
    const res = await axiosInstance.post<ApiResponse<AuthUser>>('/auth/register', data);
    return res.data;
  },

  login: async (data: LoginForm): Promise<ApiResponse<AuthUser>> => {
    const res = await axiosInstance.post<ApiResponse<AuthUser>>('/auth/login', data);
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const res = await axiosInstance.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data;
  },
};
