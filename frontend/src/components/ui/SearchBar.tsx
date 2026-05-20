import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:left-3" />
      <input
        type="search"
        enterKeyHint="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full min-h-11 touch-manipulation rounded-xl border border-slate-700 bg-slate-800/60 py-3 pl-11 pr-11 text-base text-slate-100
          placeholder:text-slate-500 sm:min-h-0 sm:py-2.5 sm:text-sm
          transition-all duration-200
          focus:border-violet-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500/30
        "
        id="leads-search"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 touch-manipulation items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-200 sm:right-3 sm:h-8 sm:w-8"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
