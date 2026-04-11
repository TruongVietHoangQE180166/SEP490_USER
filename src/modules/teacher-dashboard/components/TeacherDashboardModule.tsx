'use client';

import React from 'react';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';
import { 
  Users, BookOpen, CheckCircle2, DollarSign, 
  TrendingUp, TrendingDown, Activity, Star,
  BarChart3, LayoutDashboard, RefreshCw, AlertCircle,
  Zap, Trophy, ArrowRight, Sparkles, Wallet, PieChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThunderLoader } from '@/components/thunder-loader';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { RevenueChart } from './RevenueChart';

export const TeacherDashboardModule = () => {
  const { summary, revenueChart, isLoading, isChartLoading, error, reload } = useTeacherDashboard();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
            <ThunderLoader size="lg" animate="thunder" />
            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full -z-10 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
            <p className="text-sm font-black text-foreground uppercase tracking-[0.3em]">VIC System</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Đang đồng bộ dữ liệu giảng viên...</p>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 shadow-lg shadow-rose-500/5">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-foreground tracking-tight">Hệ thống bận hoặc có lỗi</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
            {error || 'Máy chủ không phản hồi dữ liệu tổng hợp vào lúc này.'}
          </p>
        </div>
        <Button onClick={reload} variant="outline" className="h-12 px-8 gap-2 border-primary/30 hover:bg-primary/10 rounded-xl font-bold transition-all duration-300">
          <RefreshCw size={18} className="text-primary" /> Thử lại ngay
        </Button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-10 pb-20 max-w-[1400px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. WELCOME HERO SECTION */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/95 to-primary/80 text-primary-foreground p-10 md:p-14 shadow-2xl shadow-primary/10 border border-primary/20">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-6 max-w-2xl">
            <Badge className="bg-white/10 text-white border-white/20 hover:bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-inner">
               Hệ thống VIC
            </Badge>
            <div className="space-y-3">
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.1]">
                   Xin chào, <span className="text-white drop-shadow-sm">{summary.teacherName}</span>!
                </h1>
                <p className="text-white/80 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
                   Dưới đây là một cái nhìn tổng quát về hành trình giảng dạy và những dấu ấn thành công của bạn.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
                <Link href="/teacher/courses" className="contents">
                  <Button className="h-14 px-8 rounded-xl bg-white text-primary hover:bg-white/95 font-black text-sm uppercase tracking-widest shadow-xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-95 border-none">
                     Quản lý khóa học <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <div className="flex items-center gap-3 px-5 h-14 rounded-xl bg-black/5 border border-white/10 backdrop-blur-md">
                   <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center border border-white/10">
                      <Zap size={16} />
                   </div>
                   <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider">Hệ thống ổn định 100%</span>
                </div>
            </div>
          </div>

          <div className="hidden lg:block relative">
             <div className="w-[300px] h-[300px] rounded-full border border-white/10 flex items-center justify-center relative">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t border-white/30 rounded-full" 
                />
                <div className="w-60 h-60 rounded-full bg-white/5 flex flex-col items-center justify-center text-center p-8 backdrop-blur-2xl border border-white/5 shadow-2xl relative z-10">
                    <Trophy size={40} className="text-white mb-4 opacity-90" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Thu nhập tích lũy</p>
                    <h4 className="text-2xl font-black text-white">{formatCurrency(summary.incomeGeneratedFromCourses)}</h4>
                </div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-2 -left-2 w-14 h-14 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-xl">
                    <Star className="text-white/80" size={20} fill="currentColor" />
                </motion.div>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-2 -right-2 w-16 h-16 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-xl">
                    <Users className="text-white/80" size={24} />
                </motion.div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. STATS GRID: 4 trên + 4 dưới */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Học viên',
            value: summary.numberOfStudents,
            display: String(summary.numberOfStudents),
            icon: Users,
            desc: 'Tổng học viên',
            pct: null,
            trend: null,
          },
          {
            label: 'Khóa học',
            value: summary.numberOfCourses,
            display: String(summary.numberOfCourses),
            icon: BookOpen,
            desc: 'Giáo trình hiện có',
            pct: null,
            trend: null,
          },
          {
            label: 'Hoàn thành khoá',
            value: summary.rateOfCourseCompletion,
            display: `${summary.rateOfCourseCompletion}%`,
            icon: CheckCircle2,
            desc: 'Tỉ lệ hoàn thành',
            pct: Math.min(Math.max(summary.rateOfCourseCompletion, 0), 100),
            trend: null,
          },
          {
            label: 'Thu nhập',
            value: summary.incomeGeneratedFromCourses,
            display: formatCurrency(summary.incomeGeneratedFromCourses),
            icon: DollarSign,
            desc: 'Lợi nhuận tích lũy',
            pct: null,
            trend: null,
          },
          {
            label: 'Hoạt động tuần',
            value: summary.percentageOfWeeklyActiveStudents,
            display: `${summary.percentageOfWeeklyActiveStudents}%`,
            icon: Activity,
            desc: 'Học viên hoạt động',
            pct: Math.min(Math.max(summary.percentageOfWeeklyActiveStudents, 0), 100),
            trend: summary.percentageOfWeeklyActiveStudents,
          },
          {
            label: 'Khoá có Quiz',
            value: summary.percentageOfCoursesWithQuizzes,
            display: `${summary.percentageOfCoursesWithQuizzes}%`,
            icon: BarChart3,
            desc: 'Tích hợp bài kiểm tra',
            pct: Math.min(Math.max(summary.percentageOfCoursesWithQuizzes, 0), 100),
            trend: summary.percentageOfCoursesWithQuizzes,
          },
          {
            label: 'Đã đánh giá',
            value: summary.percentageOfRatedCourses,
            display: `${summary.percentageOfRatedCourses}%`,
            icon: Star,
            desc: 'Khoá có nhận xét',
            pct: Math.min(Math.max(summary.percentageOfRatedCourses, 0), 100),
            trend: null,
          },
          {
            label: 'Doanh thu Top',
            value: summary.percentageOfIncomeFromTopPerformingCourses,
            display: `${summary.percentageOfIncomeFromTopPerformingCourses}%`,
            icon: TrendingUp,
            desc: 'Từ khoá học hàng đầu',
            pct: Math.min(Math.max(summary.percentageOfIncomeFromTopPerformingCourses, 0), 100),
            trend: summary.percentageOfIncomeFromTopPerformingCourses,
          },
        ].map((item, i) => {
          const isNegative = typeof item.value === 'number' && item.value < 0;
          const hasTrend = item.trend !== null;

          return (
            <motion.div key={item.label} variants={itemVariants} className="h-full">
              <Card className="relative h-full border border-border/50 bg-card rounded-2xl overflow-hidden group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col">
                {/* Subtle top accent line */}
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300 opacity-0 group-hover:opacity-100",
                  isNegative ? "bg-destructive" : "bg-primary"
                )} />

                <CardContent className="p-5">
                  {/* Top row: icon + badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center",
                      isNegative
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary"
                    )}>
                      <item.icon size={17} strokeWidth={2.5} />
                    </div>

                    {hasTrend && (
                      <div className={cn(
                        "flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        isNegative
                          ? "text-destructive bg-destructive/8 border-destructive/20"
                          : "text-primary bg-primary/8 border-primary/20"
                      )}>
                        {isNegative
                          ? <TrendingDown size={9} />
                          : <TrendingUp size={9} />
                        }
                        {isNegative ? 'Âm' : 'Dương'}
                      </div>
                    )}
                  </div>

                  {/* Value */}
                  <div className="mb-1">
                    <span className={cn(
                      "text-2xl font-black tracking-tight leading-none",
                      isNegative ? "text-destructive" : "text-foreground"
                    )}>
                      {item.display}
                    </span>
                  </div>

                  {/* Label + description */}
                  <p className="text-xs font-semibold text-foreground/80 mb-0.5">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{item.desc}</p>

                  {/* Progress bar */}
                  {item.pct !== null && (
                    <div className="mt-4">
                      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 1.1, ease: 'circOut', delay: i * 0.07 }}
                          className={cn(
                            "h-full rounded-full",
                            isNegative ? "bg-destructive/70" : "bg-primary"
                          )}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[9px] text-muted-foreground">0%</span>
                        <span className="text-[9px] text-muted-foreground font-medium">{item.pct}%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 3. REVENUE CHART */}
      <div>
        <RevenueChart data={revenueChart} isLoading={isChartLoading} />
      </div>

      {/* 4. BOTTOM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/40 bg-primary/5 rounded-xl p-8 border-dashed relative overflow-hidden group">
           <div className="relative z-10 space-y-4">
              <Sparkles size={32} className="text-primary mb-2" />
              <h4 className="text-xl font-bold italic tracking-tight">Cống hiến &amp; Phát triển</h4>
              <p className="text-sm text-foreground/60 leading-relaxed font-medium">
                 Hệ thống VIC luôn trân trọng những giá trị tri thức mà bạn mang lại. Hãy tiếp tục sáng tạo và xây dựng những khóa học chất lượng nhất dành cho cộng đồng học viên.
              </p>
              <div className="pt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest">Tiêu chuẩn chất lượng cao</span>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
        </Card>

        <Card className="border-border/40 bg-card rounded-xl p-8 shadow-sm flex flex-col justify-center gap-6">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/20">
                 <Wallet size={26} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Thu nhập bình quân</p>
                 <h4 className="text-2xl font-black">{formatCurrency(summary.incomeGeneratedFromCourses / summary.numberOfCourses)} / Khóa</h4>
              </div>
           </div>
           <span className="w-fit inline-flex items-center px-4 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-xs">Quy mô tài chính cấp độ 1</span>
        </Card>
      </div>
    </motion.div>
  );
};
