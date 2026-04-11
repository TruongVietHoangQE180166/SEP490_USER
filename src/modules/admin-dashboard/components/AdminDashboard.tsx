'use client';

import React from 'react';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  GraduationCap, 
  TrendingUp, 
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

import { AdminRevenueChart } from './AdminRevenueChart';
import { AdminUserRegChart } from './AdminUserRegChart';


export function AdminDashboard() {
  const { summary, revenueChart, userRegChart, userRegDays, isLoading, error, reload, changeUserRegDays } = useAdminDashboard();


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-primary/5 rounded-xl border border-primary/20 backdrop-blur-xl">
        <div className="p-4 bg-primary/10 rounded-full">
          <AlertCircle className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Đã xảy ra lỗi</h3>
        <p className="text-muted-foreground text-center max-w-md font-medium">{error}</p>
        <Button 
          onClick={reload} 
          variant="outline" 
          className="mt-4 border-primary/20 text-primary hover:bg-primary/10 transition-all rounded-lg px-8"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Thử lại
        </Button>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 120,
        damping: 20
      }
    }
  };

  const stats = [
    // Top Row: Primary Totals
    {
      title: 'Tổng người dùng',
      value: summary?.totalUsers || 0,
      icon: Users,
      description: 'Dữ liệu toàn hệ thống',
    },
    {
      title: 'Tổng doanh thu',
      value: summary?.totalRevenue || 0,
      icon: DollarSign,
      description: 'Lợi nhuận tích lũy',
      isCurrency: true,
    },
    {
      title: 'Tổng khóa học',
      value: summary?.totalCourses || 0,
      icon: BookOpen,
      description: 'Thư viện bài giảng',
    },
    {
      title: 'Học viên tham gia',
      value: summary?.totalEnrolledStudents || 0,
      icon: GraduationCap,
      description: 'Ghi danh thành công',
    },
    // Bottom Row: Growth Percentages
    {
      title: 'Tăng trưởng người dùng',
      value: summary?.percentageIncreaseUsersOfLastMonth || 0,
      icon: TrendingUp,
      description: 'So với tháng trước',
      isPercentage: true,
    },
    {
      title: 'Tăng trưởng doanh thu',
      value: summary?.percentageIncreaseRevenueOfLastMonth || 0,
      icon: TrendingUp,
      description: 'So với tháng trước',
      isPercentage: true,
    },
    {
      title: 'Tăng trưởng khóa học',
      value: summary?.percentageIncreaseCoursesOfLastMonth || 0,
      icon: TrendingUp,
      description: 'So với tháng trước',
      isPercentage: true,
    },
    {
      title: 'Tăng trưởng ghi danh',
      value: summary?.percentageIncreaseEnrolledStudentsOfLastMonth || 0,
      icon: TrendingUp,
      description: 'So với tháng trước',
      isPercentage: true,
    }
  ];

  const formatValue = (val: number, isCurrency?: boolean, isPercentage?: boolean) => {
    if (isCurrency) {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(val);
    }
    if (isPercentage) {
      return `${val >= 0 ? '+' : ''}${val}%`;
    }
    return val.toLocaleString('vi-VN');
  };

  return (
    <div className="relative space-y-12 pb-10">
      {/* Premium Background Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 border-b border-primary/10 pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Báo cáo hệ thống trực tuyến
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">
            Trung tâm <span className="text-primary italic">Điều hành</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-xl text-balance">
            Tổng quan hiệu suất vận hành của nền tảng dựa trên 8 chỉ số cốt lõi trong thời gian thực.
          </p>
        </div>
        <Button 
          onClick={reload} 
          disabled={isLoading}
          variant="default" 
          className="rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-bold group px-6 py-6 h-auto"
        >
          <RefreshCcw className={`w-5 h-5 mr-3 transition-transform duration-700 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          Làm mới dữ liệu
        </Button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12 relative z-10"
      >
        {/* Row 1: Core Metrics */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex-shrink-0">
              Chỉ số nền tảng
            </h2>
            <div className="h-[1px] w-full bg-gradient-to-r from-primary/20 to-transparent" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.slice(0, 4).map((stat, i) => (
              <StatCard key={i} stat={stat} isLoading={isLoading} formatValue={formatValue} />
            ))}
          </div>
        </div>

        {/* Row 2: Growth Metrics */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex-shrink-0">
              Biến động tăng trưởng
            </h2>
            <div className="h-[1px] w-full bg-gradient-to-r from-primary/20 to-transparent" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.slice(4, 8).map((stat, i) => (
              <StatCard key={i+4} stat={stat} isLoading={isLoading} formatValue={formatValue} />
            ))}
          </div>
        </div>

        {/* Row 3: Full Width Charts (2 columns) */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex-shrink-0">
              Biểu đồ phân tích
            </h2>
            <div className="h-[1px] w-full bg-gradient-to-r from-primary/20 to-transparent" />
          </div>
          <div className="flex flex-col gap-6">
            <AdminRevenueChart data={revenueChart} isLoading={isLoading} />
            <AdminUserRegChart
              data={userRegChart}
              days={userRegDays}
              onChangeDays={changeUserRegDays}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ stat, isLoading, formatValue }: any) {
  const Icon = stat.icon;
  return (
    <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
      <Card className="group relative overflow-hidden border border-white/10 dark:border-white/5 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-xl transition-all duration-300 hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
            {stat.title}
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white">
            <Icon size={16} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-[100px]" />
              <Skeleton className="h-3 w-[60px]" />
            </div>
          ) : (
            <div>
              <div className={`text-xl font-black tabular-nums ${stat.isPercentage ? (stat.value >= 0 ? 'text-emerald-500' : 'text-rose-500') : 'text-foreground'}`}>
                {formatValue(stat.value, stat.isCurrency, stat.isPercentage)}
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                {stat.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}


