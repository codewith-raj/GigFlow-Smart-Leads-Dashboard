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
    <div className="overflow-x-auto rounded-xl border border-slate-700/40">
      <table className="w-full text-sm" aria-label="Leads table">
        <thead>
          <tr className="bg-slate-800/60 border-b border-slate-700/40">
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
              Lead
            </th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
              Status
            </th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
              Source
            </th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
              Created By
            </th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
              Date
            </th>
            <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
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
              <td className="px-4 py-3.5">
                <div>
                  <p className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    {lead.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{lead.email}</p>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <Badge
                  label={STATUS_LABELS[lead.status] ?? lead.status}
                  colorClass={STATUS_COLORS[lead.status] ?? ''}
                />
              </td>
              <td className="px-4 py-3.5 hidden md:table-cell">
                <Badge
                  label={SOURCE_LABELS[lead.source] ?? lead.source}
                  colorClass={SOURCE_COLORS[lead.source] ?? ''}
                />
              </td>
              <td className="px-4 py-3.5 hidden lg:table-cell">
                <p className="text-slate-400 text-xs">{getCreatorName(lead)}</p>
              </td>
              <td className="px-4 py-3.5">
                <p className="text-slate-400 text-xs whitespace-nowrap">
                  {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                    aria-label={`View ${lead.name}`}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                    aria-label={`Edit ${lead.name}`}
                    title="Edit Lead"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => onDelete(lead)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      aria-label={`Delete ${lead.name}`}
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
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
