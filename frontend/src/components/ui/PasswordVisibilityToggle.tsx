import React, { useState } from 'react';

interface PasswordVisibilityToggleProps {
  visible: boolean;
  onToggle: () => void;
  id?: string;
}

const PasswordVisibilityToggle: React.FC<PasswordVisibilityToggleProps> = ({
  visible,
  onToggle,
  id = 'password-visibility-toggle',
}) => {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      id={id}
      onClick={onToggle}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      aria-label={visible ? 'Hide password' : 'Show password'}
      aria-pressed={visible}
      className={`
        password-eye-toggle group relative flex items-center justify-center
        w-8 h-8 rounded-lg outline-none
        transition-transform duration-200 ease-out
        focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        ${pressed ? 'scale-90' : 'scale-100 hover:scale-105'}
      `}
    >
      <span
        className="password-eye-ring absolute inset-0 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity"
        aria-hidden
      />

      <span
        className={`
          absolute inset-[2px] rounded-[10px] backdrop-blur-sm transition-all duration-300
          border
          ${
            visible
              ? 'bg-red-500/15 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.35)]'
              : 'bg-slate-800/90 border-slate-600/60 group-hover:border-slate-500'
          }
        `}
        aria-hidden
      />

      <span className="password-eye-scan absolute inset-[3px] rounded-[9px] overflow-hidden pointer-events-none" aria-hidden>
        <span className="password-eye-scan-line absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-400/80 to-transparent" />
      </span>

      <span className="relative z-10 w-[16px] h-[16px]" aria-hidden>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`w-full h-full transition-all duration-300 ${
            visible ? 'text-red-400' : 'text-slate-400 group-hover:text-slate-200'
          }`}
        >
          <path
            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
            className="password-eye-outline"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r={visible ? '3.5' : '2.5'}
            className="password-eye-pupil transition-all duration-300"
            fill="currentColor"
            fillOpacity={visible ? 0.9 : 0.5}
          />
          <circle
            cx="12"
            cy="12"
            r="1"
            className={`transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M4 4l16 16"
            className={`password-eye-slash transition-all duration-300 origin-center ${
              visible ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            }`}
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span
        className={`
          absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-900 transition-all duration-300
          ${visible ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}
        `}
        aria-hidden
      />
    </button>
  );
};

export default PasswordVisibilityToggle;
