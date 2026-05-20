import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  colorClass?: string;
  iconBgClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  colorClass = 'text-violet-400',
  iconBgClass = 'bg-violet-500/10 border-violet-500/20',
}) => {
  return (
    <div className="group panel-elevated rounded-2xl p-4 transition-all duration-300 hover:border-slate-600/50 sm:p-5 lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs font-medium text-slate-400 sm:text-sm">{title}</p>
          <p className={`text-2xl font-bold tabular-nums sm:text-3xl ${colorClass} mt-1 sm:mt-2`}>{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
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
