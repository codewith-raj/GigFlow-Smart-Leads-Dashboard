import React, { useState, useCallback, useMemo } from 'react';
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
import ActiveFilterChips from '@/components/dashboard/ActiveFilterChips';
import LeadsTable from '@/components/dashboard/LeadsTable';
import LeadFormModal from '@/components/forms/LeadFormModal';
import ConfirmDeleteModal from '@/components/forms/ConfirmDeleteModal';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import QueryErrorState from '@/components/ui/QueryErrorState';
import Button from '@/components/ui/Button';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { exportCsv } = useCsvExport();

  const [filters, setFilters] = useState<Partial<LeadFilters>>({
    page: 1,
    limit: 10,
    sort: 'latest',
  });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, DEBOUNCE_DELAY);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const hasActiveFilters = useMemo(
    () => !!(filters.status || filters.source || debouncedSearch?.trim()),
    [filters.status, filters.source, debouncedSearch]
  );

  const {
    data: leadsData,
    isLoading: leadsLoading,
    isError: leadsError,
    refetch: refetchLeads,
  } = useQuery({
    queryKey: ['leads', filters, debouncedSearch],
    queryFn: () => leadsApi.getLeads({ ...filters, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });

  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: leadsApi.getStats,
    staleTime: 60_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      toast.success('Lead deleted successfully');
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
      page: 1,
    }));
  }, []);

  const handleClearFilter = useCallback((key: 'status' | 'source' | 'search' | 'all') => {
    if (key === 'all') {
      setFilters({ page: 1, limit: 10, sort: 'latest' });
      setSearchInput('');
      return;
    }
    if (key === 'search') {
      setSearchInput('');
    } else {
      setFilters((prev) => ({ ...prev, [key]: undefined, page: 1 }));
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const stats = statsData?.data;
  const leads = leadsData?.data ?? [];
  const pagination = leadsData?.pagination;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
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

      <div className="panel-elevated rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-slate-700/40">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Lead Pipeline</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {pagination?.totalRecords ?? 0} leads
              {hasActiveFilters ? ' matching your filters' : ' in your pipeline'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
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

        <div className="p-6 space-y-4 border-b border-slate-700/40">
          <SearchBar
            value={searchInput}
            onChange={(val) => {
              setSearchInput(val);
              setFilters((prev) => ({ ...prev, page: 1 }));
            }}
            placeholder="Search by name or email..."
            className="w-full sm:max-w-md"
          />
          <FiltersBar
            filters={filters}
            onChange={handleFilterChange}
            onReset={() => handleClearFilter('all')}
          />
          <ActiveFilterChips
            filters={filters}
            search={debouncedSearch}
            onClear={handleClearFilter}
          />
        </div>

        <div className="p-6">
          {leadsError ? (
            <QueryErrorState
              title="Could not load leads"
              onRetry={() => refetchLeads()}
            />
          ) : (
            <>
              <LeadsTable
                leads={leads}
                isLoading={leadsLoading}
                hasActiveFilters={hasActiveFilters}
                userRole={user?.role ?? 'sales'}
                onEdit={(lead) => setEditingLead(lead)}
                onDelete={(lead) => setDeletingLead(lead)}
                onCreateLead={() => setIsCreateModalOpen(true)}
              />
              {pagination && pagination.totalPages > 0 && (
                <div className="mt-4 border-t border-slate-700/30 pt-4">
                  <Pagination pagination={pagination} onPageChange={handlePageChange} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

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
