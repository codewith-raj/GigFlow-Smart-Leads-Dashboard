import React from 'react';
import { Filter, X } from 'lucide-react';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { LeadFilters } from '@/types';
import { LEAD_SOURCES, LEAD_STATUSES, SOURCE_LABELS, STATUS_LABELS } from '@/constants';

interface FiltersBarProps {
  filters: Partial<LeadFilters>;
  onChange: (key: keyof LeadFilters, value: string) => void;
  onReset: () => void;
}

const statusOptions = [
  ...LEAD_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
];

const sourceOptions = [
  ...LEAD_SOURCES.map((s) => ({ value: s, label: SOURCE_LABELS[s] })),
];

const sortOptions = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
];

const hasActiveFilters = (filters: Partial<LeadFilters>) =>
  !!(filters.status || filters.source || filters.search);

const FiltersBar: React.FC<FiltersBarProps> = ({ filters, onChange, onReset }) => {
  return (
    <div className="bg-slate-900/40 border border-slate-700/40 rounded-2xl p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex items-center gap-2 text-slate-400 mr-1">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>

        <div className="w-40">
          <Select
            options={statusOptions}
            placeholder="All Status"
            value={filters.status ?? ''}
            onChange={(e) => onChange('status', e.target.value)}
            aria-label="Filter by status"
          />
        </div>

        <div className="w-40">
          <Select
            options={sourceOptions}
            placeholder="All Sources"
            value={filters.source ?? ''}
            onChange={(e) => onChange('source', e.target.value)}
            aria-label="Filter by source"
          />
        </div>

        <div className="w-44">
          <Select
            options={sortOptions}
            value={filters.sort ?? 'latest'}
            onChange={(e) => onChange('sort', e.target.value)}
            aria-label="Sort order"
          />
        </div>

        {hasActiveFilters(filters) && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<X className="w-3.5 h-3.5" />}
            onClick={onReset}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default FiltersBar;
