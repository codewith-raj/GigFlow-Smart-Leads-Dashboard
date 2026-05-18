import axiosInstance from './axios';
import { ApiResponse, Lead, LeadFilters, LeadForm, LeadStats } from '@/types';

export const leadsApi = {
  getLeads: async (filters: Partial<LeadFilters>): Promise<ApiResponse<Lead[]>> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '' && v !== null)
    );
    const res = await axiosInstance.get<ApiResponse<Lead[]>>('/leads', { params });
    return res.data;
  },

  getLeadById: async (id: string): Promise<ApiResponse<Lead>> => {
    const res = await axiosInstance.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data;
  },

  createLead: async (data: LeadForm): Promise<ApiResponse<Lead>> => {
    const res = await axiosInstance.post<ApiResponse<Lead>>('/leads', data);
    return res.data;
  },

  updateLead: async (id: string, data: Partial<LeadForm>): Promise<ApiResponse<Lead>> => {
    const res = await axiosInstance.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id: string): Promise<ApiResponse<null>> => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`/leads/${id}`);
    return res.data;
  },

  exportCsv: async (filters: Partial<Omit<LeadFilters, 'page' | 'limit'>>): Promise<Blob> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    );
    const res = await axiosInstance.get('/leads/export/csv', {
      params,
      responseType: 'blob',
    });
    return res.data as Blob;
  },

  getStats: async (): Promise<ApiResponse<LeadStats>> => {
    const res = await axiosInstance.get<ApiResponse<LeadStats>>('/leads/stats');
    return res.data;
  },
};
