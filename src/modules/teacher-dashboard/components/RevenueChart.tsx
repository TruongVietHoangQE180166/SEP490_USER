'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { RevenueData } from '../types';
import { TrendingUp, TrendingDown, Calendar, BarChart3, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RevenueChartProps {
  data: RevenueData[];
  isLoading: boolean;
}

const formatVND = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

const formatShort = (value: number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return `${value}`;
};

// ── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { date, amount, displayDate } = payload[0].payload;

  return (
    <div className="bg-background border border-border rounded-xl shadow-xl px-4 py-3 min-w-[160px]">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
        {displayDate}
      </p>
      <p className="text-base font-black text-primary">{formatVND(amount)}</p>
    </div>
  );
};

export const RevenueChart = ({ data, isLoading }: RevenueChartProps) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Read actual computed CSS colors (oklch is not supported in SVG attributes)
  const [colors, setColors] = useState({
    primary: '#6366f1',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
  });

  useEffect(() => {
    const el = document.documentElement;
    const style = getComputedStyle(el);
    const resolve = (v: string) => {
      const tmp = document.createElement('div');
      tmp.style.color = v;
      document.body.appendChild(tmp);
      const resolved = getComputedStyle(tmp).color;
      document.body.removeChild(tmp);
      return resolved || v;
    };
    setColors({
      primary:         resolve(`var(--primary)`),
      muted:           resolve(`var(--muted)`),
      mutedForeground: resolve(`var(--muted-foreground)`),
      border:          resolve(`var(--border)`),
    });
  }, []);

  const { chartData, totalRevenue, growth, maxAmount, maxDay } = useMemo(() => {
    if (!data || data.length === 0)
      return { chartData: [], totalRevenue: 0, avgDaily: 0, growth: 0, maxAmount: 0, maxDay: '' };

    const chartData = data.map((d) => ({
      ...d,
      displayDate: new Date(d.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    }));

    const totalRevenue = data.reduce((s, d) => s + d.amount, 0);
    const midIdx = Math.floor(data.length / 2);
    const first = data.slice(0, midIdx).reduce((s, d) => s + d.amount, 0);
    const second = data.slice(midIdx).reduce((s, d) => s + d.amount, 0);
    const growth = first > 0 ? ((second - first) / first) * 100 : 0;
    const maxItem = data.reduce((a, b) => (a.amount > b.amount ? a : b), data[0]);
    const maxAmount = maxItem.amount;
    const maxDay = new Date(maxItem.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

    return { chartData, totalRevenue, growth, maxAmount, maxDay };
  }, [data]);

  const isPositiveGrowth = growth >= 0;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Card className="border-border/40 bg-card overflow-hidden">
        <CardContent className="h-[460px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="text-xs font-semibold text-muted-foreground">Đang tải dữ liệu...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="border-border/40 bg-card overflow-hidden">
        <CardContent className="h-[460px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <BarChart3 size={40} className="opacity-30" />
            <p className="text-sm font-medium">Chưa có dữ liệu doanh thu</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 bg-card overflow-hidden shadow-sm">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <CardHeader className="px-6 pt-5 pb-4 border-b border-border/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <BarChart3 size={18} className="text-primary" />
              Doanh thu 30 ngày qua
            </CardTitle>
            {chartData.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <Calendar size={11} />
                {chartData[0]?.displayDate} — {chartData[chartData.length - 1]?.displayDate}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Tổng kỳ này</p>
              <p className="text-xl font-black text-primary leading-tight">{formatVND(totalRevenue)}</p>
            </div>
            <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border ${
              isPositiveGrowth
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
            }`}>
              {isPositiveGrowth ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isPositiveGrowth ? '+' : ''}{growth.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardHeader>

      {/* ── Bar Chart ──────────────────────────────────────────────────────── */}
      <CardContent className="px-4 pt-6 pb-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
            barCategoryGap="30%"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={1} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0.35} />
              </linearGradient>
              <linearGradient id="barGradHovered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={1} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke={colors.border}
              strokeOpacity={0.8}
            />

            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 10, fontWeight: 600, fill: colors.mutedForeground }}
              axisLine={false}
              tickLine={false}
              interval={4}
              dy={8}
            />

            <YAxis
              tickFormatter={formatShort}
              tick={{ fontSize: 10, fontWeight: 600, fill: colors.mutedForeground }}
              axisLine={false}
              tickLine={false}
              width={52}
              tickCount={6}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: colors.muted, opacity: 0.6, radius: 6 }}
            />

            <Bar
              dataKey="amount"
              radius={[6, 6, 0, 0]}
              maxBarSize={24}
              onMouseEnter={(_, idx) => setHoveredIdx(idx)}
            >
              {chartData.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={hoveredIdx === idx ? 'url(#barGradHovered)' : 'url(#barGrad)'}
                  opacity={hoveredIdx === null || hoveredIdx === idx ? 1 : 0.35}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* ── Stat Cards ──────────────────────────────────────────────────── */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            {
              Icon: isPositiveGrowth ? TrendingUp : TrendingDown,
              label: 'Tăng trưởng (nửa kỳ)',
              value: `${isPositiveGrowth ? '+' : ''}${growth.toFixed(1)}%`,
              color: isPositiveGrowth ? 'text-emerald-500' : 'text-rose-500',
              bg: isPositiveGrowth ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20',
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
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}
                style={{ background: 'currentColor', opacity: 1 }}
              >
                <div className="text-background">
                  <Icon size={15} />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground leading-tight">{label}</p>
                <p className={`text-sm font-bold mt-0.5 truncate ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
