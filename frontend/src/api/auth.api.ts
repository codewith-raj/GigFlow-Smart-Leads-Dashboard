import axiosInstance from './axios';
import {
  ApiResponse,
  AuthUser,
  ChangePasswordForm,
  LoginForm,
  RegisterForm,
  UpdateProfileForm,
  User,
} from '@/types';

export const authApi = {
  register: async (data: RegisterForm): Promise<ApiResponse<AuthUser>> => {
    const res = await axiosInstance.post<ApiResponse<AuthUser>>('/auth/register', data);
    return res.data;
  },

  login: async (data: LoginForm): Promise<ApiResponse<AuthUser>> => {
    const res = await axiosInstance.post<ApiResponse<AuthUser>>('/auth/login', data);
    return res.data;
  },

  googleAuth: async (data: {
    credential: string;
    role?: 'admin' | 'sales';
  }): Promise<ApiResponse<AuthUser & { isNewUser: boolean }>> => {
    const res = await axiosInstance.post<ApiResponse<AuthUser & { isNewUser: boolean }>>(
      '/auth/google',
      data
    );
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const res = await axiosInstance.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data;
  },

  updateProfile: async (data: UpdateProfileForm): Promise<ApiResponse<{ user: User }>> => {
    const res = await axiosInstance.patch<ApiResponse<{ user: User }>>('/auth/profile', data);
    return res.data;
  },

  changePassword: async (data: ChangePasswordForm): Promise<ApiResponse<null>> => {
    const res = await axiosInstance.patch<ApiResponse<null>>('/auth/password', data);
    return res.data;
  },
};
