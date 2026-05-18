import React from 'react';
import { Shield, UserCircle, Check } from 'lucide-react';
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from '@/constants';

interface RoleSelectorProps {
  value: 'admin' | 'sales';
  onChange: (role: 'admin' | 'sales') => void;
}

const roles = [
  {
    id: 'sales' as const,
    icon: UserCircle,
    gradient: 'from-blue-500/20 to-cyan-500/10',
    borderActive: 'border-blue-500/50 ring-blue-500/30',
    textActive: 'text-blue-300',
  },
  {
    id: 'admin' as const,
    icon: Shield,
    gradient: 'from-red-500/20 to-orange-500/10',
    borderActive: 'border-red-500/50 ring-red-500/30',
    textActive: 'text-red-300',
  },
];

const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
        <Shield className="w-3.5 h-3.5 text-red-400" /> Choose your role
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {roles.map(({ id, icon: Icon, gradient, borderActive, textActive }) => {
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`
                group relative py-4 px-4 rounded-2xl text-left border transition-all duration-300
                hover:scale-[1.02] hover:shadow-lg active:scale-[0.99]
                ${
                  selected
                    ? `bg-gradient-to-br ${gradient} ${borderActive} ring-2 shadow-lg`
                    : 'bg-slate-800/50 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800/80'
                }
              `}
            >
              {selected && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center auth-scale-in">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
              )}
              <Icon
                className={`w-6 h-6 mb-2 transition-colors ${
                  selected ? textActive : 'text-slate-500 group-hover:text-slate-400'
                }`}
              />
              <span
                className={`block text-sm font-semibold ${
                  selected ? textActive : 'text-slate-300'
                }`}
              >
                {ROLE_LABELS[id]}
              </span>
              <span className="block text-[11px] text-slate-500 mt-1 leading-snug">
                {ROLE_DESCRIPTIONS[id]}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-slate-600">
        Admin registration may be restricted in production deployments.
      </p>
    </div>
  );
};

export default RoleSelector;
