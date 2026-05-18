import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, CheckCircle2, Sparkles } from 'lucide-react';

const stats = [
  { label: 'Total Leads', key: 'total', icon: Users, color: 'text-red-400', bg: 'bg-red-500/10' },
  { label: 'Qualified', key: 'qualified', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Conversion', key: 'conversion', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
] as const;

const targets = { total: 1248, qualified: 412, conversion: 33 };

const AuthShowcase: React.FC = () => {
  const [values, setValues] = useState({ total: 0, qualified: 0, conversion: 0 });
  const [activeLead, setActiveLead] = useState(0);

  const demoLeads = [
    { name: 'Rahul Sharma', status: 'Qualified', source: 'Instagram' },
    { name: 'Priya Patel', status: 'Contacted', source: 'Website' },
    { name: 'Alex Morgan', status: 'New', source: 'Referral' },
  ];

  useEffect(() => {
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setValues({
        total: Math.round(targets.total * ease),
        qualified: Math.round(targets.qualified * ease),
        conversion: Math.round(targets.conversion * ease),
      });
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveLead((i) => (i + 1) % demoLeads.length);
    }, 2800);
    return () => clearInterval(id);
  }, [demoLeads.length]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="auth-showcase-card auth-slide-up-delay-2 panel-elevated rounded-2xl p-5 border border-slate-700/40">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Live pipeline preview
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Synced
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {stats.map(({ label, key, icon: Icon, color, bg }, i) => (
            <div
              key={key}
              className={`rounded-xl p-3 border border-slate-700/40 ${bg} auth-slide-up`}
              style={{ animationDelay: `${0.2 + i * 0.08}s` }}
            >
              <Icon className={`w-3.5 h-3.5 ${color} mb-1`} />
              <p className={`text-lg font-bold ${color} tabular-nums`}>
                {key === 'conversion' ? `${values[key]}%` : values[key].toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {demoLeads.map((lead, i) => (
            <div
              key={lead.name}
              className={`
                flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-500
                ${
                  activeLead === i
                    ? 'bg-red-500/10 border-red-500/30 scale-[1.02] shadow-lg shadow-red-500/10'
                    : 'bg-slate-800/40 border-slate-700/30 opacity-60 scale-100'
                }
              `}
            >
              <div>
                <p className="text-sm font-medium text-slate-200">{lead.name}</p>
                <p className="text-[10px] text-slate-500">{lead.source}</p>
              </div>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  lead.status === 'Qualified'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : lead.status === 'Contacted'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {lead.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute -top-3 -right-3 auth-scale-in auth-slide-up-delay-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-red-500/30 text-xs text-red-300 shadow-xl backdrop-blur-sm"
        style={{ animationDelay: '0.5s' }}
      >
        <Sparkles className="w-3.5 h-3.5 text-red-400" />
        Smart filters active
      </div>
    </div>
  );
};

export default AuthShowcase;
