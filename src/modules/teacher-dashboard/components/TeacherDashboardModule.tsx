'use client';

import React from 'react';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';
import { 
  Users, BookOpen, GraduationCap, TrendingUp, DollarSign, 
  BarChart3, LayoutDashboard, RefreshCw, AlertCircle,
  CheckCircle2, Star, Target, Zap, Clock, Trophy, ArrowRight,
  Sparkles, Wallet, PieChart, Activity
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

      {/* 2. CORE STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Học viên', value: summary.numberOfStudents, icon: Users, theme: 'primary', desc: 'Học viên đang theo học' },
          { label: 'Khóa học', value: summary.numberOfCourses, icon: BookOpen, theme: 'primary-alt', desc: 'Tổng số giáo trình' },
          { label: 'Hoàn thành', value: `${summary.rateOfCourseCompletion}%`, icon: CheckCircle2, theme: 'success', desc: 'Tỉ lệ bài học hoàn tất' },
          { label: 'Thu nhập', value: formatCurrency(summary.incomeGeneratedFromCourses), icon: DollarSign, theme: 'primary', desc: 'Lợi nhuận tích lũy' },
        ].map((item, i) => (
          <motion.div key={item.label} variants={itemVariants}>
            <Card className="border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-500 rounded-xl group overflow-hidden">
               <CardContent className="p-8">
                  <div className="flex justify-between items-start">
                     <div className={cn(
                        "w-14 h-14 rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500",
                        item.theme === 'success' ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-primary text-primary-foreground shadow-primary/20"
                     )}>
                        <item.icon size={28} strokeWidth={2.5} />
                     </div>
                     <Badge variant="outline" className="border-border/40 font-bold text-[10px] uppercase opacity-50">SỐ LIỆU THỰC</Badge>
                  </div>
                  <div className="mt-8 space-y-1">
                     <h4 className="text-3xl font-black tracking-tighter text-foreground">{item.value}</h4>
                     <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{item.label}</p>
                     <p className="text-[10px] font-medium text-muted-foreground italic pt-2">{item.desc}</p>
                  </div>
               </CardContent>
               <div className={cn(
                  "h-1 w-full opacity-30",
                  item.theme === 'success' ? "bg-emerald-500" : "bg-primary"
               )} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 3. DETAILED METRICS GRID */}
      <div className="space-y-8">
        
        {/* Engagement & Quality Section */}
        <div className="space-y-8">
           <Card className="border-border/40 bg-card rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/2 p-10 bg-muted/5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border/40">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <Activity size={20} />
                       </div>
                       <h3 className="font-black text-xl tracking-tight">Tương tác học viên</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium pr-10">
                       Theo dõi sự chuyển đổi và hoạt động của học viên trong các hoạt động hàng ngày.
                    </p>
                 </div>
                 
                 <div className="space-y-8 mt-10">
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">Hoạt động tuần</span>
                            <span className="text-2xl font-black text-foreground">{summary.percentageOfWeeklyActiveStudents}%</span>
                        </div>
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                           <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${summary.percentageOfWeeklyActiveStudents}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                           />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">Đã đánh giá</span>
                            <span className="text-2xl font-black text-foreground">{summary.percentageOfRatedCourses}%</span>
                        </div>
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                           <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${summary.percentageOfRatedCourses}%` }}
                                transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                                className="h-full bg-primary/40 rounded-full"
                           />
                        </div>
                    </div>
                 </div>
              </div>

              <div className="md:w-1/2 p-10 space-y-10">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                       <PieChart size={20} />
                    </div>
                    <h3 className="font-black text-xl tracking-tight">Cấu trúc nội dung</h3>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Bài kiểm tra</p>
                       <p className="text-2xl font-black">{summary.percentageOfCoursesWithQuizzes}%</p>
                       <p className="text-[10px] font-medium text-muted-foreground opacity-70 italic">Phủ rộng quiz</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Doanh thu Top</p>
                       <p className="text-2xl font-black">{summary.percentageOfIncomeFromTopPerformingCourses}%</p>
                       <p className="text-[10px] font-medium text-muted-foreground opacity-70 italic">Từ khóa học Top</p>
                    </div>
                    <div className="space-y-2 col-span-2 pt-4 border-t border-border/40">
                       <div className="flex items-center gap-2">
                          <Zap size={14} className="text-primary" />
                          <span className="text-[11px] font-bold text-foreground">Trạng thái khóa học: <span className="text-emerald-500 uppercase">Tối ưu</span></span>
                       </div>
                    </div>
                 </div>
              </div>
           </Card>

           {/* 30-Day Revenue Chart */}
           <div className="pt-4">
              <RevenueChart data={revenueChart} isLoading={isChartLoading} />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-border/40 bg-primary/5 rounded-xl p-8 border-dashed relative overflow-hidden group">
                 <div className="relative z-10 space-y-4">
                    <Sparkles size={32} className="text-primary mb-2" />
                    <h4 className="text-xl font-bold italic tracking-tight">Cống hiến & Phát triển</h4>
                    <p className="text-sm text-foreground/60 leading-relaxed font-medium">
                       Hệ thống VIC luôn trân trọng những giá trị tri thức mà bạn mang lại. Hãy tiếp tục sáng tạo và xây dựng những khóa học chất lượng nhất dành cho cộng đồng học viên.
                    </p>
                    <div className="pt-2">
                        <Badge className="bg-primary/10 text-primary border-none font-bold uppercase text-[10px] tracking-widest">Tiêu chuẩn chất lượng cao</Badge>
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>
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
                 <Badge className="w-fit bg-primary/10 text-primary border-none px-4 py-1.5 rounded-lg font-bold">Quy mô tài chính cấp độ 1</Badge>
              </Card>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
