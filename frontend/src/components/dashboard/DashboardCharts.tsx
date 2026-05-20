import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import type { LeadStats } from '@/types';
import { LEAD_SOURCES, LEAD_STATUSES, SOURCE_LABELS, STATUS_LABELS } from '@/constants';

const STATUS_FILL: Record<string, string> = {
  new: '#60a5fa',
  contacted: '#fbbf24',
  qualified: '#34d399',
  lost: '#f87171',
};

const SOURCE_FILL: Record<string, string> = {
  website: '#a78bfa',
  instagram: '#f472b6',
  referral: '#22d3ee',
};

const axisStyle = { fill: '#94a3b8', fontSize: 11 };
const gridStroke = '#334155';

interface DashboardChartsProps {
  stats: LeadStats | undefined;
  isLoading: boolean;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ stats, isLoading }) => {
  const statusData = useMemo(
    () =>
      LEAD_STATUSES.map((s) => ({
        key: s,
        name: STATUS_LABELS[s] ?? s,
        count: stats?.byStatus?.[s] ?? 0,
        fill: STATUS_FILL[s] ?? '#64748b',
      })),
    [stats]
  );

  const sourceData = useMemo(
    () =>
      LEAD_SOURCES.map((s) => ({
        name: SOURCE_LABELS[s] ?? s,
        value: stats?.bySource?.[s] ?? 0,
        fill: SOURCE_FILL[s] ?? '#64748b',
      })).filter((d) => d.value > 0),
    [stats]
  );

  const sourceDataWithZeros = useMemo(
    () =>
      LEAD_SOURCES.map((s) => ({
        name: SOURCE_LABELS[s] ?? s,
        value: stats?.bySource?.[s] ?? 0,
        fill: SOURCE_FILL[s] ?? '#64748b',
      })),
    [stats]
  );

  const pieData = sourceData.length > 0 ? sourceData : sourceDataWithZeros;

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="panel-elevated h-[280px] animate-pulse rounded-2xl border border-slate-700/40 bg-slate-800/40"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
      <section className="panel-elevated panel-elevated-hover rounded-2xl border border-slate-700/40 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 sm:text-base">Leads by status</h3>
            <p className="text-xs text-slate-500">Distribution across your pipeline stages</p>
          </div>
        </div>
        <div className="chart-surface-passive h-[240px] w-full min-w-0 sm:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
              <YAxis allowDecimals={false} tick={axisStyle} axisLine={false} tickLine={false} width={32} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value) => [`${value ?? 0} leads`, 'Count']}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {statusData.map((entry) => (
                  <Cell key={entry.key} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel-elevated panel-elevated-hover rounded-2xl border border-slate-700/40 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
            <PieChartIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 sm:text-base">Leads by source</h3>
            <p className="text-xs text-slate-500">Where opportunities originate</p>
          </div>
        </div>
        <div className="chart-surface-passive h-[240px] w-full min-w-0 sm:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={2}
                stroke="#0f172a"
                strokeWidth={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={28}
                formatter={(value) => <span className="text-xs text-slate-400">{value}</span>}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                formatter={(value) => [`${value ?? 0} leads`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default DashboardCharts;
