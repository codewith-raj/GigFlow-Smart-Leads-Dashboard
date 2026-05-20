import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  PhoneCall,
  LayoutGrid,
  BarChart2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { leadsApi } from '@/api/leads.api';
import { useAuthStore } from '@/store/authStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useCsvExport } from '@/hooks/useCsvExport';
import { Lead, LeadFilters } from '@/types';
import { DEBOUNCE_DELAY, ROLE_LABELS } from '@/constants';
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
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import RecentLeadsPanel from '@/components/dashboard/RecentLeadsPanel';
import PipelineCoachChat from '@/components/dashboard/PipelineCoachChat';

function greetingForHour(h: number): string {
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

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

  const { data: statsData, isLoading: statsLoading } = useQuery({
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

  const qualified = stats?.byStatus?.qualified ?? 0;
  const total = stats?.total ?? 0;
  const conversionPct = total > 0 ? Math.round((qualified / total) * 100) : 0;

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    []
  );

  const greeting = useMemo(() => greetingForHour(new Date().getHours()), []);

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 border-b border-slate-700/30 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-400/90">
            Pipeline overview
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-50 sm:text-2xl lg:text-3xl">
            {greeting}, {user?.name?.split(' ')[0] ?? 'there'}
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">{todayLabel}</p>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm">
            {ROLE_LABELS[user?.role ?? 'sales']} workspace — track performance, filter leads, and
            move opportunities through your funnel.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {user?.role === 'admin' && (
            <Button
              variant="outline"
              size="sm"
              className="min-h-11 w-full touch-manipulation justify-center sm:w-auto"
              leftIcon={<Download className="h-4 w-4" />}
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
            className="min-h-11 w-full touch-manipulation justify-center sm:w-auto"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsCreateModalOpen(true)}
            id="create-lead-btn"
          >
            Add lead
          </Button>
        </div>
      </header>

      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="dashboard-section-title sr-only">
          Key metrics
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          <StatCard
            title="Total leads"
            value={total}
            icon={Users}
            colorClass="text-violet-400"
            iconBgClass="bg-violet-500/10 border-violet-500/20"
            accentVar="oklch(0.65 0.2 285)"
            subtitle="All records in pipeline"
          />
          <StatCard
            title="Qualified"
            value={qualified}
            icon={CheckCircle2}
            colorClass="text-emerald-400"
            iconBgClass="bg-emerald-500/10 border-emerald-500/20"
            accentVar="oklch(0.72 0.17 155)"
            subtitle={`${conversionPct}% of total pipeline`}
          />
          <StatCard
            title="Contacted"
            value={stats?.byStatus?.['contacted'] ?? 0}
            icon={PhoneCall}
            colorClass="text-amber-400"
            iconBgClass="bg-amber-500/10 border-amber-500/20"
            accentVar="oklch(0.78 0.14 85)"
            subtitle="Awaiting next step"
          />
          <StatCard
            title="Lost"
            value={stats?.byStatus?.['lost'] ?? 0}
            icon={XCircle}
            colorClass="text-red-400"
            iconBgClass="bg-red-500/10 border-red-500/20"
            accentVar="oklch(0.65 0.2 25)"
            subtitle="Closed without conversion"
          />
        </div>
      </section>

      <section aria-labelledby="analytics-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-violet-400" />
          <h2 id="analytics-heading" className="dashboard-section-title text-sm font-semibold text-slate-200 sm:text-base">
            Analytics
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="min-w-0 lg:col-span-2">
            <DashboardCharts stats={stats} isLoading={statsLoading} />
          </div>
          <div className="min-w-0">
            <RecentLeadsPanel leads={leads} isLoading={leadsLoading} />
          </div>
        </div>
      </section>

      <section aria-labelledby="pipeline-heading">
        <div className="panel-elevated overflow-hidden rounded-2xl border border-slate-700/40">
          <div className="flex flex-col gap-3 border-b border-slate-700/40 bg-slate-900/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 id="pipeline-heading" className="text-base font-semibold tracking-tight text-slate-100 sm:text-lg">
                  Lead pipeline
                </h2>
                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  <span className="font-medium text-slate-300">{pagination?.totalRecords ?? 0}</span>{' '}
                  leads
                  {hasActiveFilters ? ' matching your filters' : ' in your pipeline'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-b border-slate-700/40 p-4 sm:p-6">
            <SearchBar
              value={searchInput}
              onChange={(val) => {
                setSearchInput(val);
                setFilters((prev) => ({ ...prev, page: 1 }));
              }}
              placeholder="Search by name or email..."
              className="w-full sm:max-w-lg"
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

          <div className="p-4 sm:p-6">
            {leadsError ? (
              <QueryErrorState title="Could not load leads" onRetry={() => refetchLeads()} />
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
                  <div className="mt-5 border-t border-slate-700/30 pt-5">
                    <Pagination pagination={pagination} onPageChange={handlePageChange} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

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

      <PipelineCoachChat
        context={{
          stats,
          filters,
          search: debouncedSearch,
          pageMatchCount: leads.length,
          totalMatching: pagination?.totalRecords ?? leads.length,
          userName: user?.name,
        }}
      />
    </div>
  );
};

export default DashboardPage;
