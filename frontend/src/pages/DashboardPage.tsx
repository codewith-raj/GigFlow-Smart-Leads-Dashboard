import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  PhoneCall,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { leadsApi } from '@/api/leads.api';
import { useAuthStore } from '@/store/authStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useCsvExport } from '@/hooks/useCsvExport';
import { Lead, LeadFilters } from '@/types';
import { DEBOUNCE_DELAY } from '@/constants';
import StatCard from '@/components/dashboard/StatCard';
import FiltersBar from '@/components/dashboard/FiltersBar';
import LeadsTable from '@/components/dashboard/LeadsTable';
import LeadFormModal from '@/components/forms/LeadFormModal';
import ConfirmDeleteModal from '@/components/forms/ConfirmDeleteModal';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { exportCsv } = useCsvExport();

  // Filter state
  const [filters, setFilters] = useState<Partial<LeadFilters>>({
    page: 1,
    limit: 10,
    sort: 'latest',
  });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, DEBOUNCE_DELAY);

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  // Fetch leads with all filters
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads', filters, debouncedSearch],
    queryFn: () => leadsApi.getLeads({ ...filters, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: leadsApi.getStats,
    staleTime: 60_000,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      toast.success('Lead deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setDeletingLead(null);
    },
    onError: () => toast.error('Failed to delete lead'),
  });

  const handleFilterChange = useCallback((key: keyof LeadFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1, // Reset to page 1 on filter change
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 10, sort: 'latest' });
    setSearchInput('');
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const stats = statsData?.data;
  const leads = leadsData?.data ?? [];
  const pagination = leadsData?.pagination;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats?.total ?? 0}
          icon={Users}
          colorClass="text-violet-400"
          iconBgClass="bg-violet-500/10 border-violet-500/20"
        />
        <StatCard
          title="Qualified"
          value={stats?.byStatus?.['qualified'] ?? 0}
          icon={CheckCircle2}
          colorClass="text-emerald-400"
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          title="Contacted"
          value={stats?.byStatus?.['contacted'] ?? 0}
          icon={PhoneCall}
          colorClass="text-amber-400"
          iconBgClass="bg-amber-500/10 border-amber-500/20"
        />
        <StatCard
          title="Lost"
          value={stats?.byStatus?.['lost'] ?? 0}
          icon={XCircle}
          colorClass="text-red-400"
          iconBgClass="bg-red-500/10 border-red-500/20"
        />
      </div>

      {/* Main Leads Panel */}
      <div className="bg-slate-900/40 border border-slate-700/40 rounded-2xl overflow-hidden">
        {/* Panel Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-slate-700/40">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">All Leads</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {pagination?.totalRecords ?? 0} total leads in your pipeline
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() =>
                  exportCsv({
                    status: filters.status,
                    source: filters.source,
                    search: debouncedSearch || undefined,
                    sort: filters.sort,
                  })
                }
                id="export-csv-btn"
              >
                Export CSV
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
              id="create-lead-btn"
            >
              Add Lead
            </Button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="p-6 space-y-3 border-b border-slate-700/40">
          <SearchBar
            value={searchInput}
            onChange={(val) => {
              setSearchInput(val);
              setFilters((prev) => ({ ...prev, page: 1 }));
            }}
            placeholder="Search leads by name or email..."
            className="w-full sm:max-w-sm"
          />
          <FiltersBar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Table */}
        <div className="p-6">
          <LeadsTable
            leads={leads}
            isLoading={leadsLoading}
            userRole={user?.role ?? 'sales'}
            onEdit={(lead) => setEditingLead(lead)}
            onDelete={(lead) => setDeletingLead(lead)}
          />

          {/* Pagination */}
          {pagination && (
            <div className="mt-4 border-t border-slate-700/30 pt-4">
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <LeadFormModal
        isOpen={isCreateModalOpen || !!editingLead}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingLead(null);
        }}
        lead={editingLead}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={() => deletingLead && deleteMutation.mutate(deletingLead._id)}
        isLoading={deleteMutation.isPending}
        leadName={deletingLead?.name}
      />
    </div>
  );
};

export default DashboardPage;
