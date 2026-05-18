import React from 'react';
import { Shield, UserCircle } from 'lucide-react';
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from '@/constants';

interface AuthRoleSelectProps {
  value: 'admin' | 'sales';
  onChange: (role: 'admin' | 'sales') => void;
}

const AuthRoleSelect: React.FC<AuthRoleSelectProps> = ({ value, onChange }) => (
  <div className="space-y-2">
    <p className="text-sm text-slate-400 font-medium">Account Role</p>
    <div className="grid grid-cols-2 gap-3">
      {(['sales', 'admin'] as const).map((role) => {
        const selected = value === role;
        const Icon = role === 'admin' ? Shield : UserCircle;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            className={`
              rounded-xl border px-3 py-3 text-left transition-all duration-200
              ${selected ? 'border-violet-500/60 bg-violet-500/10 ring-1 ring-violet-500/30' : 'border-slate-600/80 hover:border-slate-500 bg-transparent'}
            `}
          >
            <Icon className={`w-4 h-4 mb-1.5 ${selected ? 'text-violet-400' : 'text-slate-500'}`} />
            <span className={`block text-sm font-semibold ${selected ? 'text-slate-100' : 'text-slate-400'}`}>
              {ROLE_LABELS[role]}
            </span>
            <span className="block text-[10px] text-slate-500 mt-0.5 leading-tight">
              {ROLE_DESCRIPTIONS[role]}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default AuthRoleSelect;
