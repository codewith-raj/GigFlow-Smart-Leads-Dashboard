import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full resize-y min-h-[100px] rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5
            text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-200
            hover:border-slate-600 focus:border-red-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/25
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-red-500/60' : ''}
            ${className}
          `}
          {...props}
        />
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        {error && (
          <p className="flex items-center gap-1 text-xs text-red-400">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
