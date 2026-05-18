import React, { useMemo } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { score, label, color } = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-700' };
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;

    if (s <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (s <= 3) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (s <= 4) return { score: 3, label: 'Good', color: 'bg-emerald-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400' };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-1.5 auth-slide-up">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? color : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] text-slate-500">
        Password strength: <span className="text-slate-400 font-medium">{label}</span>
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
