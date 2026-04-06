'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RevenueData } from '../types';
import { cn } from '@/lib/utils';
import { TrendingUp, Calendar, ArrowUpRight, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RevenueChartProps {
  data: RevenueData[];
  isLoading: boolean;
}

export const RevenueChart = ({ data, isLoading }: RevenueChartProps) => {
  // Helper to format currency
  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // For large amount of data (30 days), we can simplify it if needed
    // But 30 points is fine for SVG
    const maxAmount = Math.max(...data.map(d => d.amount), 1000000); // at least 1M for scale
    
    return data.map((item, index) => ({
      ...item,
      normalizedAmount: (item.amount / maxAmount) * 100, // 0-100 scale for SVG
      x: (index / (data.length - 1)) * 100, // 0-100 scale for X axis
      displayDate: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    }));
  }, [data]);

  // SVG Area Path Generation
  const areaPath = useMemo(() => {
    if (chartData.length < 2) return '';
    
    let path = `M 0 100 `; // Start at bottom left
    chartData.forEach(point => {
      path += `L ${point.x} ${100 - point.normalizedAmount} `;
    });
    path += `L 100 100 Z`; // Close at bottom right
    return path;
  }, [chartData]);

  // SVG Line Path Generation
  const linePath = useMemo(() => {
    if (chartData.length < 2) return '';
    
    let path = `M 0 ${100 - chartData[0].normalizedAmount} `;
    chartData.forEach(point => {
      path += `L ${point.x} ${100 - point.normalizedAmount} `;
    });
    return path;
  }, [chartData]);

  if (isLoading) {
    return (
      <Card className="border-border/40 bg-card overflow-hidden h-full">
        <CardContent className="p-0 h-[350px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Đang vẽ biểu đồ...</span>
            </div>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="border-border/40 bg-card overflow-hidden shadow-sm group">
      <CardHeader className="p-6 border-border/40 flex flex-row items-center justify-between bg-muted/5">
        <div className="space-y-1">
          <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Doanh thu 30 ngày qua
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
             <Calendar size={12} />
             <span>Dữ liệu từ {chartData[0]?.displayDate} - {chartData[chartData.length - 1]?.displayDate}</span>
          </div>
        </div>
        <div className="text-right">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tổng doanh thu kỳ này</p>
            <h4 className="text-xl font-black text-primary">{formatVND(totalRevenue)}</h4>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="relative h-[250px] w-full mt-4">
          {/* SVG Chart */}
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full preserve-3d" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" className="text-border/20" strokeWidth="0.1" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" className="text-border/20" strokeWidth="0.1" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" className="text-border/20" strokeWidth="0.1" />

            {/* Area */}
            <motion.path 
              initial={{ d: `M 0 100 L 0 100 L 100 100 Z` }}
              animate={{ d: areaPath }}
              transition={{ duration: 2, ease: "anticipate" }}
              fill="url(#revenueGradient)"
            />

            {/* Line */}
            <motion.path 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              d={linePath}
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>

          {/* X Axis Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between pt-4">
             {[0, 7, 14, 21, 29].map(idx => (
               <div key={idx} className="text-[10px] font-black text-muted-foreground/60 uppercase">
                 {chartData[idx]?.displayDate}
               </div>
             ))}
          </div>

          {/* Tooltip Overlay (Invisible triggers) */}
          <div className="absolute inset-0 flex">
             {chartData.map((point, i) => (
                <div 
                  key={i} 
                  className="flex-1 group/point relative cursor-pointer"
                >
                   {/* Hover Vertical Line */}
                   <div className="absolute inset-y-0 left-1/2 w-px bg-primary/20 opacity-0 group-hover/point:opacity-100 transition-opacity pointer-events-none" />
                   
                   {/* Hover Dot */}
                   <div 
                     style={{ bottom: `${point.normalizedAmount}%` }}
                     className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary border-2 border-background opacity-0 group-hover/point:opacity-100 transition-all pointer-events-none z-10"
                   />

                   {/* Tooltip */}
                   <div 
                     className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-foreground text-background px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/point:opacity-100 transition-all pointer-events-none z-20 shadow-xl"
                   >
                     <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] uppercase tracking-tighter opacity-60">{point.date}</span>
                        <span className="text-primary font-black">{formatVND(point.amount)}</span>
                     </div>
                     <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45 -mt-1" />
                   </div>
                </div>
             ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <ArrowUpRight size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground">Tăng trưởng</p>
                    <p className="text-sm font-bold">+12% dự kiến</p>
                </div>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <DollarSign size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground">Trung bình ngày</p>
                    <p className="text-sm font-bold">{formatVND(totalRevenue / 30)}</p>
                </div>
            </div>
            <div className="flex items-center justify-center px-4">
                 <Button variant="outline" className="w-full h-12 rounded-xl border-primary/20 hover:bg-primary/5 text-primary-foreground font-black text-[10px] uppercase tracking-widest bg-primary hover:text-white">
                    Chi tiết doanh thu
                 </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};
