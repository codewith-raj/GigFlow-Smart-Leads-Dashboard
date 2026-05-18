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
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:bg-slate-900/80 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colorClass} mt-2`}>{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-400">{trend}</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${iconBgClass}`}
        >
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
