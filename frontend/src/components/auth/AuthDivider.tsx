import React from 'react';

interface AuthDividerProps {
  label?: string;
}

const AuthDivider: React.FC<AuthDividerProps> = ({ label = 'or' }) => (
  <div className="relative flex items-center py-4 auth-slide-up auth-slide-up-delay-2">
    <div className="flex-grow border-t border-slate-700/80" />
    <span className="flex-shrink mx-4 text-xs text-slate-500 font-medium tracking-wide">
      {label}
    </span>
    <div className="flex-grow border-t border-slate-700/80" />
  </div>
);

export default AuthDivider;
