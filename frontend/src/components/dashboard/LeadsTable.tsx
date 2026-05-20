import React from 'react';
import { Edit2, Trash2, Eye, Plus, SearchX } from 'lucide-react';
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
        icon={<SearchX className="w-8 h-8 text-slate-500" />}
        action={
          hasActiveFilters ? undefined : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
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

  return (
    <div className="-mx-1 scroll-fade-x overflow-x-auto rounded-xl border border-slate-700/40 sm:mx-0">
      <table className="min-w-[640px] w-full text-sm" aria-label="Leads table">
        <thead>
          <tr className="bg-slate-800/60 border-b border-slate-700/40">
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-4">
              Lead
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-4">
              Status
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 md:table-cell">
              Source
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 lg:table-cell">
              Created By
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-4">
              Date
            </th>
            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="hover:bg-slate-800/30 transition-colors duration-150 group"
            >
              <td className="px-3 py-3 sm:px-4 sm:py-3.5">
                <div>
                  <p className="font-medium text-slate-200 transition-colors group-hover:text-white">
                    {lead.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{lead.email}</p>
                  <div className="mt-2 md:hidden">
                    <Badge
                      label={SOURCE_LABELS[lead.source] ?? lead.source}
                      colorClass={SOURCE_COLORS[lead.source] ?? ''}
                    />
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 sm:px-4 sm:py-3.5">
                <Badge
                  label={STATUS_LABELS[lead.status] ?? lead.status}
                  colorClass={STATUS_COLORS[lead.status] ?? ''}
                />
              </td>
              <td className="hidden px-3 py-3 sm:px-4 sm:py-3.5 md:table-cell">
                <Badge
                  label={SOURCE_LABELS[lead.source] ?? lead.source}
                  colorClass={SOURCE_COLORS[lead.source] ?? ''}
                />
              </td>
              <td className="hidden px-3 py-3 sm:px-4 sm:py-3.5 lg:table-cell">
                <p className="text-xs text-slate-400">{getCreatorName(lead)}</p>
              </td>
              <td className="px-3 py-3 sm:px-4 sm:py-3.5">
                <p className="whitespace-nowrap text-xs text-slate-400">
                  {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </td>
              <td className="px-2 py-2 sm:px-4 sm:py-3.5">
                <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                  <button
                    type="button"
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-violet-500/10 hover:text-violet-400 active:scale-95"
                    aria-label={`View ${lead.name}`}
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(lead)}
                    className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-amber-500/10 hover:text-amber-400 active:scale-95"
                    aria-label={`Edit ${lead.name}`}
                    title="Edit lead"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {userRole === 'admin' && (
                    <button
                      type="button"
                      onClick={() => onDelete(lead)}
                      className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 active:scale-95"
                      aria-label={`Delete ${lead.name}`}
                      title="Delete lead"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
