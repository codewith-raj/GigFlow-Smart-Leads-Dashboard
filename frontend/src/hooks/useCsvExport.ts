import { useCallback } from 'react';
import { leadsApi } from '@/api/leads.api';
import { LeadFilters } from '@/types';
import toast from 'react-hot-toast';

export const useCsvExport = () => {
  const exportCsv = useCallback(async (filters: Partial<Omit<LeadFilters, 'page' | 'limit'>>) => {
    const toastId = toast.loading('Preparing CSV export...');
    try {
      const blob = await leadsApi.exportCsv(filters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('CSV exported successfully!', { id: toastId });
    } catch {
      toast.error('Failed to export CSV', { id: toastId });
    }
  }, []);

  return { exportCsv };
};
