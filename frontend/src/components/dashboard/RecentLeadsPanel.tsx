import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, Sparkles } from 'lucide-react';
import type { Lead } from '@/types';
import Badge from '@/components/ui/Badge';
import { STATUS_COLORS, STATUS_LABELS } from '@/constants';

interface RecentLeadsPanelProps {
  leads: Lead[];
  isLoading: boolean;
}

const formatRelative = (iso: string): string => {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const RecentLeadsPanel: React.FC<RecentLeadsPanelProps> = ({ leads, isLoading }) => {
  const navigate = useNavigate();
  const slice = leads.slice(0, 6);

  return (
    <section className="panel-elevated flex h-full flex-col rounded-2xl border border-slate-700/40">
      <div className="flex items-center justify-between border-b border-slate-700/40 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-100 sm:text-base">In this view</h3>
        </div>
        <span className="text-xs text-slate-500">Latest on page</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2 sm:p-3">
        {isLoading ? (
          <ul className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="h-14 animate-pulse rounded-xl bg-slate-800/50" />
            ))}
          </ul>
        ) : slice.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-slate-500">No leads match the current filters.</p>
        ) : (
          <ul className="space-y-1">
            {slice.map((lead) => (
              <li key={lead._id}>
                <button
                  type="button"
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="flex w-full touch-manipulation items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-800/70 active:bg-slate-800"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate text-sm font-medium text-slate-200">{lead.name}</span>
                    <span className="truncate text-xs text-slate-500">{lead.email}</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        size="sm"
                        label={STATUS_LABELS[lead.status] ?? lead.status}
                        colorClass={STATUS_COLORS[lead.status] ?? ''}
                      />
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 sm:text-xs">
                        <Clock className="h-3 w-3" />
                        {formatRelative(lead.createdAt)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-600" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default RecentLeadsPanel;
