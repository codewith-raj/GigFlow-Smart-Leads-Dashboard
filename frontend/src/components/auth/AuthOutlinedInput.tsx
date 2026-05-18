import React, { forwardRef } from 'react';

interface AuthOutlinedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
  inputClassName?: string;
}

const AuthOutlinedInput = forwardRef<HTMLInputElement, AuthOutlinedInputProps>(
  ({ label, error, rightElement, className = '', inputClassName = '', id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`relative ${className}`}>
        <div
          className={`
            relative rounded-xl border bg-transparent transition-all duration-300
            ${error ? 'border-red-500/70' : 'border-slate-600/80 hover:border-slate-500'}
            ${inputClassName}
          `}
        >
          <input
            ref={ref}
            id={inputId}
            placeholder=" "
            className={`
              peer w-full bg-transparent text-slate-100 text-sm rounded-xl
              px-4 pt-3.5 pb-3 outline-none
              ${rightElement ? 'pr-12' : ''}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            {...props}
          />
          <label
            htmlFor={inputId}
            className="
              absolute left-3 -top-2.5 text-xs text-violet-400 pointer-events-none z-10 px-1 bg-[var(--color-slate-950)]
              transition-all duration-200
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500
              peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-violet-400
            "
          >
            {label}
          </label>
          {rightElement && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">{rightElement}</div>
          )}
        </div>
        {error && <p className="text-xs text-red-400 mt-1.5 ml-1">{error}</p>}
      </div>
    );
  }
);

AuthOutlinedInput.displayName = 'AuthOutlinedInput';

export default AuthOutlinedInput;
