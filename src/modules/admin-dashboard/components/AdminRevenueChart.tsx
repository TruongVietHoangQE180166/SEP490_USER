'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { RevenueData } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, BarChart3, Star } from 'lucide-react';

interface AdminRevenueChartProps {
  data: RevenueData[] | null;
  isLoading: boolean;
}

const formatVND = (val: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);

const formatShort = (val: number) => {
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return `${val}`;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { displayDate, amount } = payload[0].payload;
  return (
    <div className="bg-background border border-border rounded-xl shadow-xl px-4 py-3 min-w-[150px]">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">{displayDate}</p>
      <p className="text-sm font-black text-primary">{formatVND(amount)}</p>
    </div>
  );
};

export const AdminRevenueChart: React.FC<AdminRevenueChartProps> = ({ data, isLoading }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Resolve oklch CSS vars to real rgb values for Recharts SVG
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

  const { chartData, totalRevenue, growth, maxAmount, maxDay } = useMemo(() => {
    if (!data || data.length === 0)
      return { chartData: [], totalRevenue: 0, growth: 0, maxAmount: 0, maxDay: '' };

    const chartData = data.map((d) => ({
      ...d,
      displayDate: new Date(d.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    }));

    const totalRevenue = data.reduce((s, d) => s + d.amount, 0);
    const mid = Math.floor(data.length / 2);
    const first = data.slice(0, mid).reduce((s, d) => s + d.amount, 0);
    const second = data.slice(mid).reduce((s, d) => s + d.amount, 0);
    const growth = first > 0 ? ((second - first) / first) * 100 : 0;
    const maxItem = data.reduce((a, b) => (a.amount > b.amount ? a : b), data[0]);
    const maxAmount = maxItem.amount;
    const maxDay = new Date(maxItem.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

    return { chartData, totalRevenue, growth, maxAmount, maxDay };
  }, [data]);

  const isPositive = growth >= 0;

  if (isLoading) {
    return (
      <Card className="border border-border/40 bg-card rounded-xl overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-[240px] w-full rounded-xl" />
          <div className="flex justify-between gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border border-border/40 bg-card rounded-xl overflow-hidden">
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <BarChart3 size={36} className="opacity-30" />
            <p className="text-sm font-medium">Không có dữ liệu doanh thu</p>
          </div>
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
              <BarChart3 size={17} className="text-primary" />
              Biến động doanh thu
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {chartData[0]?.displayDate} — {chartData[chartData.length - 1]?.displayDate}
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Tổng 30 ngày</p>
              <p className="text-xl font-black text-primary leading-tight">{formatVND(totalRevenue)}</p>
            </div>
            <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border ${
              isPositive
                ? 'bg-primary/8 border-primary/20 text-primary'
                : 'bg-destructive/8 border-destructive/20 text-destructive'
            }`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isPositive ? '+' : ''}{growth.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent className="px-4 pt-5 pb-4">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
            barCategoryGap="32%"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              <linearGradient id="adminBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={1} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0.35} />
              </linearGradient>
              <linearGradient id="adminBarGradHov" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={1} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke={colors.border} strokeOpacity={0.8} />

            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 10, fontWeight: 600, fill: colors.mutedFg }}
              axisLine={false} tickLine={false}
              interval={4} dy={8}
            />

            <YAxis
              tickFormatter={formatShort}
              tick={{ fontSize: 10, fontWeight: 600, fill: colors.mutedFg }}
              axisLine={false} tickLine={false}
              width={50} tickCount={5}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: colors.muted, opacity: 0.5, radius: 6 }} />

            <Bar dataKey="amount" radius={[5, 5, 0, 0]} maxBarSize={22}
              onMouseEnter={(_, idx) => setHoveredIdx(idx)}>
              {chartData.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={hoveredIdx === idx ? 'url(#adminBarGradHov)' : 'url(#adminBarGrad)'}
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
              Icon: Star,
              label: `Cao nhất (${maxDay})`,
              value: formatVND(maxAmount),
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
      </CardContent>
    </Card>
  );
};
