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
    <div className="rounded-xl border border-slate-700/35 bg-slate-800/25 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Filter className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm font-medium">Filters</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
        <div className="min-w-0 w-full sm:min-w-[10rem] lg:w-44">
          <Select
            options={statusOptions}
            placeholder="All Status"
            value={filters.status ?? ''}
            onChange={(e) => onChange('status', e.target.value)}
            aria-label="Filter by status"
          />
        </div>

        <div className="min-w-0 w-full sm:min-w-[10rem] lg:w-44">
          <Select
            options={sourceOptions}
            placeholder="All Sources"
            value={filters.source ?? ''}
            onChange={(e) => onChange('source', e.target.value)}
            aria-label="Filter by source"
          />
        </div>

        <div className="min-w-0 w-full sm:min-w-[10rem] lg:w-48">
          <Select
            options={sortOptions}
            value={filters.sort ?? 'latest'}
            onChange={(e) => onChange('sort', e.target.value)}
            aria-label="Sort order"
          />
        </div>

        {hasActiveFilters(filters) && (
          <div className="flex items-end lg:ml-auto">
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 w-full touch-manipulation sm:w-auto"
              leftIcon={<X className="h-3.5 w-3.5" />}
              onClick={onReset}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltersBar;
