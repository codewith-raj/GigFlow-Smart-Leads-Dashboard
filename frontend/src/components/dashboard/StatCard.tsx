import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  colorClass?: string;
  iconBgClass?: string;
  accentVar?: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  colorClass = 'text-violet-400',
  iconBgClass = 'bg-violet-500/10 border-violet-500/20',
  accentVar = 'oklch(0.65 0.2 285)',
  subtitle,
}) => {
  return (
    <div
      className="stat-card-accent panel-elevated panel-elevated-hover group rounded-2xl p-4 sm:p-5"
      style={{ ['--stat-accent' as string]: accentVar }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
            {title}
          </p>
          <p className={`mt-2 text-2xl font-bold tabular-nums tracking-tight sm:text-3xl ${colorClass}`}>
            {value}
          </p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-400">{trend}</span>
            </div>
          )}
        </div>
        <div
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12 ${iconBgClass}`}
        >
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colorClass}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
