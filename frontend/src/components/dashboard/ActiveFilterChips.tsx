import React from 'react';
import { X } from 'lucide-react';
import { LeadFilters } from '@/types';
import { SOURCE_LABELS, STATUS_LABELS } from '@/constants';

interface ActiveFilterChipsProps {
  filters: Partial<LeadFilters>;
  search?: string;
  onClear: (key: 'status' | 'source' | 'search' | 'all') => void;
}

const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  search,
  onClear,
}) => {
  const chips: { key: 'status' | 'source' | 'search'; label: string }[] = [];

  if (filters.status) {
    chips.push({
      key: 'status',
      label: `Status: ${STATUS_LABELS[filters.status] ?? filters.status}`,
    });
  }
  if (filters.source) {
    chips.push({
      key: 'source',
      label: `Source: ${SOURCE_LABELS[filters.source] ?? filters.source}`,
    });
  }
  if (search?.trim()) {
    chips.push({ key: 'search', label: `Search: "${search.trim()}"` });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        Active
      </span>
      {chips.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onClear(key)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/25 hover:bg-violet-500/20 transition-colors"
        >
          {label}
          <X className="w-3 h-3 opacity-70" />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={() => onClear('all')}
          className="text-xs text-slate-500 hover:text-slate-300 underline-offset-2 hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default ActiveFilterChips;
