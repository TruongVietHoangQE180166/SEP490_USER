'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RevenueData } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface AdminRevenueChartProps {
  data: RevenueData[] | null;
  isLoading: boolean;
}

export const AdminRevenueChart: React.FC<AdminRevenueChartProps> = ({ data, isLoading }) => {
  const chartConfig = useMemo(() => {
    if (!data || data.length === 0) return null;

    const maxAmount = Math.max(...data.map((d) => d.amount), 1000);
    const chartHeight = 200;
    const chartWidth = 800;
    const padding = 40;

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * (chartWidth - padding * 2) + padding;
      const y = chartHeight - (d.amount / maxAmount) * (chartHeight - padding * 2) - padding;
      return { x, y, ...d };
    });

    const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

    return { points, linePath, areaPath, chartHeight, chartWidth };
  }, [data]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <Card className="border border-white/10 dark:border-white/5 shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-xl overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="text-primary w-5 h-5" />
            Biến động doanh thu
          </CardTitle>
          <CardDescription className="text-xs font-medium uppercase tracking-widest opacity-60">
            30 ngày gần nhất
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">
          <TrendingUp size={14} />
          <span>Real-time</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ) : !chartConfig ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground font-medium">
            Không có dữ liệu hiển thị
          </div>
        ) : (
          <div className="relative">
            <svg 
              viewBox={`0 0 ${chartConfig.chartWidth} ${chartConfig.chartHeight}`} 
              className="w-full h-auto overflow-visible"
            >
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                <line
                  key={i}
                  x1="40"
                  y1={40 + p * (chartConfig.chartHeight - 80)}
                  x2={chartConfig.chartWidth - 40}
                  y2={40 + p * (chartConfig.chartHeight - 80)}
                  className="stroke-muted/10"
                  strokeWidth="1"
                />
              ))}

              {/* Area */}
              <motion.path
                d={chartConfig.areaPath}
                fill="url(#revenueGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              />

              {/* Line */}
              <motion.path
                d={chartConfig.linePath}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-primary"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* Data Points */}
              {chartConfig.points.filter((_, i) => i % 5 === 0 || i === chartConfig.points.length - 1).map((p, i) => (
                <g key={i}>
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    className="fill-primary stroke-white dark:stroke-slate-900"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  />
                  <text
                    x={p.x}
                    y={chartConfig.chartHeight - 10}
                    textAnchor="middle"
                    className="text-[12px] fill-muted-foreground font-medium"
                  >
                    {formatDate(p.date)}
                  </text>
                </g>
              ))}

              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Info */}
            <div className="absolute top-0 right-0 p-4 pointer-events-none">
               <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Cao nhất</p>
                  <p className="text-xl font-black text-foreground">{formatCurrency(Math.max(...(data?.map(d => d.amount) || [0])))}</p>
               </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
