import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, totalRecords, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | string)[] => {
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 2) rangeWithDots.push('...');
    rangeWithDots.unshift(1);
    range.forEach((n) => rangeWithDots.push(n));
    if (range[range.length - 1] < totalPages - 1) rangeWithDots.push('...');
    if (totalPages > 1) rangeWithDots.push(totalPages);

    return rangeWithDots;
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-1 py-4 sm:flex-row sm:px-2 sm:py-4">
      <p className="order-2 max-w-full shrink-0 text-center text-sm text-slate-400 sm:order-1 sm:text-left">
        Showing page{' '}
        <span className="font-medium text-slate-200">{currentPage}</span> of{' '}
        <span className="font-medium text-slate-200">{totalPages}</span> ·{' '}
        <span className="font-medium text-slate-200">{totalRecords}</span> total
      </p>

      <div className="order-1 flex max-w-full flex-wrap items-center justify-center gap-1 overflow-x-auto pb-1 sm:order-2 sm:justify-end sm:pb-0">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="flex h-11 min-w-[44px] touch-manipulation items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`dot-${idx}`} className="px-2 text-slate-500 text-sm">
              …
            </span>
          ) : (
            <button
              type="button"
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`
                flex h-11 min-w-[44px] touch-manipulation items-center justify-center rounded-xl px-3 text-sm font-medium transition-all duration-150
                ${
                  currentPage === page
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }
              `}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="flex h-11 min-w-[44px] touch-manipulation items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
