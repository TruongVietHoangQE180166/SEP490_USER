'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { UserRegistrationData } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminUserRegChartProps {
  data: UserRegistrationData[] | null;
  days: 7 | 30;
  onChangeDays: (days: 7 | 30) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { displayDate, userCount } = payload[0].payload;
  return (
    <div className="bg-background border border-border rounded-xl shadow-xl px-4 py-3 min-w-[140px]">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">{displayDate}</p>
      <p className="text-base font-black text-primary">{userCount.toLocaleString('vi-VN')} <span className="text-xs font-medium text-muted-foreground">người</span></p>
    </div>
  );
};

export const AdminUserRegChart: React.FC<AdminUserRegChartProps> = ({ data, days, onChangeDays }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Resolve oklch CSS variable → rgb string for Recharts SVG attributes
  const [colors, setColors] = useState({ primary: '#6366f1', muted: '#f1f5f9', mutedFg: '#64748b', border: '#e2e8f0' });
  useEffect(() => {
    const resolve = (v: string) => {
      const tmp = document.createElement('div');
      tmp.style.color = v;
      document.body.appendChild(tmp);
      const c = getComputedStyle(tmp).color;
      document.body.removeChild(tmp);
      return c || v;
    };
    setColors({
      primary: resolve('var(--primary)'),
      muted:   resolve('var(--muted)'),
      mutedFg: resolve('var(--muted-foreground)'),
      border:  resolve('var(--border)'),
    });
  }, []);

  const { chartData, totalUsers, maxCount, maxDay, growth } = useMemo(() => {
    if (!data || data.length === 0)
      return { chartData: [], totalUsers: 0, maxCount: 0, maxDay: '', growth: 0 };

    const chartData = data.map((d) => ({
      ...d,
      displayDate: new Date(d.regDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    }));

    const totalUsers = data.reduce((s, d) => s + d.userCount, 0);
    const mid = Math.floor(data.length / 2);
    const first = data.slice(0, mid).reduce((s, d) => s + d.userCount, 0);
    const second = data.slice(mid).reduce((s, d) => s + d.userCount, 0);
    const growth = first > 0 ? ((second - first) / first) * 100 : 0;
    const maxItem = data.reduce((a, b) => (a.userCount > b.userCount ? a : b), data[0]);
    const maxCount = maxItem.userCount;
    const maxDay = new Date(maxItem.regDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

    return { chartData, totalUsers, maxCount, maxDay, growth };
  }, [data]);

  const isPositive = growth >= 0;

  if (!data) {
    return (
      <Card className="border border-border/40 bg-card rounded-xl overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/40 bg-card rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <CardHeader className="px-6 pt-5 pb-4 border-b border-border/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Users size={17} className="text-primary" />
              Người dùng đăng ký mới
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {chartData[0]?.displayDate} — {chartData[chartData.length - 1]?.displayDate}
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Total */}
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Tổng kỳ này</p>
              <p className="text-xl font-black text-primary leading-tight">{totalUsers.toLocaleString('vi-VN')}</p>
            </div>

            {/* Growth badge */}
            <div className={cn(
              'flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border',
              isPositive
                ? 'bg-primary/8 border-primary/20 text-primary'
                : 'bg-destructive/8 border-destructive/20 text-destructive'
            )}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isPositive ? '+' : ''}{growth.toFixed(1)}%
            </div>

            {/* Day toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted border border-border/50">
              {([7, 30] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => onChangeDays(d)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-bold transition-all duration-200',
                    days === d
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {d} ngày
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent className="px-4 pt-5 pb-4">
        {data.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <Users size={32} className="opacity-30" />
              <p className="text-sm font-medium">Không có dữ liệu</p>
            </div>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                barCategoryGap={days === 7 ? '40%' : '30%'}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <defs>
                  <linearGradient id="userRegGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.primary} stopOpacity={1} />
                    <stop offset="100%" stopColor={colors.primary} stopOpacity={0.35} />
                  </linearGradient>
                  <linearGradient id="userRegGradHov" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.primary} stopOpacity={1} />
                    <stop offset="100%" stopColor={colors.primary} stopOpacity={0.7} />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke={colors.border} strokeOpacity={0.8} />

                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 10, fontWeight: 600, fill: colors.mutedFg }}
                  axisLine={false} tickLine={false}
                  interval={days === 7 ? 0 : 4}
                  dy={8}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fontWeight: 600, fill: colors.mutedFg }}
                  axisLine={false} tickLine={false}
                  width={32} tickCount={5}
                />

                <Tooltip content={<CustomTooltip />} cursor={{ fill: colors.muted, opacity: 0.5, radius: 4 }} />

                <Bar dataKey="userCount" radius={[5, 5, 0, 0]} maxBarSize={days === 7 ? 40 : 22}
                  onMouseEnter={(_, idx) => setHoveredIdx(idx)}>
                  {chartData.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={hoveredIdx === idx ? 'url(#userRegGradHov)' : 'url(#userRegGrad)'}
                      opacity={hoveredIdx === null || hoveredIdx === idx ? 1 : 0.35}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Bottom stats */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                {
                  Icon: isPositive ? TrendingUp : TrendingDown,
                  label: 'Tăng trưởng (nửa kỳ)',
                  value: `${isPositive ? '+' : ''}${growth.toFixed(1)}%`,
                  color: isPositive ? 'text-primary' : 'text-destructive',
                  bg: isPositive ? 'bg-primary/5 border-primary/10' : 'bg-destructive/5 border-destructive/10',
                },
                {
                  Icon: Users,
                  label: `Cao nhất (${maxDay})`,
                  value: `${maxCount} người`,
                  color: 'text-primary',
                  bg: 'bg-primary/5 border-primary/10',
                },
              ].map(({ Icon, label, value, color, bg }) => (
                <div key={label} className={`flex items-center gap-3 p-3 rounded-xl border ${bg}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 ${color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground leading-tight">{label}</p>
                    <p className={`text-xs font-bold mt-0.5 truncate ${color}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
