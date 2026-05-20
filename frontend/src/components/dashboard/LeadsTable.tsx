import React from 'react';
import { Edit2, Trash2, Eye, Plus, SearchX, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '@/components/ui/Badge';
import Loader from '@/components/ui/Loader';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { Lead, UserRole } from '@/types';
import { STATUS_COLORS, SOURCE_COLORS, STATUS_LABELS, SOURCE_LABELS } from '@/constants';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  userRole: UserRole;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onCreateLead: () => void;
}

const actionBtn =
  'flex h-10 w-10 touch-manipulation items-center justify-center rounded-xl text-slate-400 transition-colors active:scale-95 sm:h-11 sm:w-11';

const LeadActions: React.FC<{
  lead: Lead;
  userRole: UserRole;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  navigate: (path: string) => void;
  compact?: boolean;
}> = ({ lead, userRole, onEdit, onDelete, navigate, compact }) => (
  <div className={`flex items-center ${compact ? 'gap-1' : 'justify-end gap-0.5 sm:gap-1'}`}>
    <button
      type="button"
      onClick={() => navigate(`/leads/${lead._id}`)}
      className={`${actionBtn} hover:bg-red-500/10 hover:text-red-400`}
      aria-label={`View ${lead.name}`}
      title="View details"
    >
      <Eye className="h-4 w-4" />
    </button>
    <button
      type="button"
      onClick={() => onEdit(lead)}
      className={`${actionBtn} hover:bg-amber-500/10 hover:text-amber-400`}
      aria-label={`Edit ${lead.name}`}
      title="Edit lead"
    >
      <Edit2 className="h-4 w-4" />
    </button>
    {userRole === 'admin' && (
      <button
        type="button"
        onClick={() => onDelete(lead)}
        className={`${actionBtn} hover:bg-red-500/10 hover:text-red-400`}
        aria-label={`Delete ${lead.name}`}
        title="Delete lead"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    )}
  </div>
);

const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  isLoading,
  hasActiveFilters,
  userRole,
  onEdit,
  onDelete,
  onCreateLead,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader text="Loading leads..." />;
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        title={hasActiveFilters ? 'No matching leads' : 'No leads yet'}
        description={
          hasActiveFilters
            ? 'Try adjusting your filters or search term to find what you need.'
            : 'Add your first lead to start building your sales pipeline.'
        }
        icon={<SearchX className="h-8 w-8 text-slate-500" />}
        action={
          hasActiveFilters ? undefined : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={onCreateLead}
            >
              Add Lead
            </Button>
          )
        }
      />
    );
  }

  const getCreatorName = (lead: Lead): string => {
    if (typeof lead.createdBy === 'object' && lead.createdBy !== null) {
      return lead.createdBy.name;
    }
    return 'Unknown';
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <>
      {/* Mobile: card list */}
      <ul className="space-y-3 md:hidden" aria-label="Leads list">
        {leads.map((lead) => (
          <li
            key={lead._id}
            className="panel-elevated rounded-xl border border-slate-700/40 p-4 transition-colors active:bg-slate-800/40"
          >
            <button
              type="button"
              onClick={() => navigate(`/leads/${lead._id}`)}
              className="flex w-full touch-manipulation items-start gap-3 text-left"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 text-sm font-bold text-red-300 ring-1 ring-red-500/20">
                {lead.name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-100">{lead.name}</p>
                <p className="truncate text-xs text-slate-500">{lead.email}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge
                    size="sm"
                    label={STATUS_LABELS[lead.status] ?? lead.status}
                    colorClass={STATUS_COLORS[lead.status] ?? ''}
                  />
                  <Badge
                    size="sm"
                    label={SOURCE_LABELS[lead.source] ?? lead.source}
                    colorClass={SOURCE_COLORS[lead.source] ?? ''}
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  {formatDate(lead.createdAt)} · {getCreatorName(lead)}
                </p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-600" aria-hidden />
            </button>
            <div className="mt-3 flex items-center justify-between border-t border-slate-700/30 pt-3">
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                Actions
              </span>
              <LeadActions
                lead={lead}
                userRole={userRole}
                onEdit={onEdit}
                onDelete={onDelete}
                navigate={navigate}
                compact
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-700/40 bg-slate-900/20 md:block">
        <table className="w-full min-w-[640px] text-sm" aria-label="Leads table">
          <thead>
            <tr className="border-b border-slate-700/40 bg-slate-800/80">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Lead
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 lg:table-cell">
                Source
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 xl:table-cell">
                Created By
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="group transition-colors duration-150 hover:bg-slate-800/30"
              >
                <td className="px-4 py-3.5">
                  <p className="font-medium text-slate-200 group-hover:text-white">{lead.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{lead.email}</p>
                </td>
                <td className="px-4 py-3.5">
                  <Badge
                    label={STATUS_LABELS[lead.status] ?? lead.status}
                    colorClass={STATUS_COLORS[lead.status] ?? ''}
                  />
                </td>
                <td className="hidden px-4 py-3.5 lg:table-cell">
                  <Badge
                    label={SOURCE_LABELS[lead.source] ?? lead.source}
                    colorClass={SOURCE_COLORS[lead.source] ?? ''}
                  />
                </td>
                <td className="hidden px-4 py-3.5 xl:table-cell">
                  <p className="text-xs text-slate-400">{getCreatorName(lead)}</p>
                </td>
                <td className="px-4 py-3.5">
                  <p className="whitespace-nowrap text-xs text-slate-400">
                    {formatDate(lead.createdAt)}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <LeadActions
                    lead={lead}
                    userRole={userRole}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    navigate={navigate}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LeadsTable;
