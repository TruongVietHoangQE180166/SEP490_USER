'use client';

import { observer } from '@legendapp/state/react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Layers, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  Info,
  CheckCircle2,
  XCircle,
  Star
} from 'lucide-react';
import { UserProgress, UserLevel } from '../types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface UserLevelCardProps {
  progress: UserProgress;
  className?: string;
}

const LEVEL_CONFIG: Record<UserLevel, { 
  label: string, 
  color: string, 
  gradient: string, 
  icon: any,
  shadow: string
}> = {
  NHAP_MON: { 
    label: 'Nhập Môn', 
    color: 'text-emerald-400', 
    gradient: 'from-emerald-500/20 via-emerald-900/40 to-teal-500/10',
    icon: BookOpen,
    shadow: 'shadow-emerald-500/20'
  },
  NEN_TANG: { 
    label: 'Nền Tảng', 
    color: 'text-blue-400', 
    gradient: 'from-blue-500/20 via-blue-900/40 to-cyan-500/10',
    icon: Layers,
    shadow: 'shadow-blue-500/20'
  },
  TRUNG_CAP: { 
    label: 'Trung Cấp', 
    color: 'text-amber-400', 
    gradient: 'from-amber-500/20 via-amber-900/40 to-yellow-500/10',
    icon: Target,
    shadow: 'shadow-amber-500/20'
  },
  THUC_HANH: { 
    label: 'Thực Hành', 
    color: 'text-orange-400', 
    gradient: 'from-orange-500/20 via-orange-900/40 to-amber-600/10',
    icon: Zap,
    shadow: 'shadow-orange-500/20'
  },
  NANG_CAO: { 
    label: 'Nâng Cao', 
    color: 'text-rose-400', 
    gradient: 'from-rose-500/20 via-rose-900/40 to-red-600/10',
    icon: Trophy,
    shadow: 'shadow-rose-500/20'
  }
};

export const UserLevelCard = observer(({ progress, className }: UserLevelCardProps) => {
  const currentLevelConfig = LEVEL_CONFIG[progress.currentLevel];
  const nextLevelConfig = progress.nextLevel ? LEVEL_CONFIG[progress.nextLevel] : null;

  const MetricItem = ({ 
    label, 
    current, 
    target, 
    unit = '', 
    icon: Icon, 
    isPercentage = false 
  }: { 
    label: string, 
    current: number, 
    target?: number, 
    unit?: string, 
    icon: any,
    isPercentage?: boolean
  }) => {
    const hasTarget = target !== undefined && target > 0 && !(isPercentage && target === 100);
    const percentage = hasTarget ? Math.min((current / target!) * 100, 100) : 0;
    const isCompleted = hasTarget && percentage >= 100;

    return (
      <div className={cn(
        "group relative space-y-2 p-3 rounded-xl transition-all duration-300",
        hasTarget ? "bg-primary/[0.03] border border-primary/10" : "bg-transparent border border-transparent"
      )}>
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className={cn(
              "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
              hasTarget ? "bg-primary/20 text-primary" : "bg-muted/40 text-muted-foreground/60"
            )}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
               <div className="flex items-center gap-1.5 min-w-0">
                 <span className={cn(
                   "font-bold truncate",
                   hasTarget ? "text-foreground" : "text-muted-foreground/70"
                 )}>
                   {label}
                 </span>
                 {hasTarget && (
                   <Star className="w-3 h-3 flex-shrink-0 text-primary fill-primary animate-pulse" />
                 )}
               </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-bold flex-shrink-0">
            <span className={cn(isCompleted ? "text-primary" : "text-foreground")}>
              {current.toLocaleString()}
              {isPercentage ? '%' : unit}
            </span>
            {hasTarget && (
              <div className="flex items-center gap-1 text-muted-foreground/50">
                <span className="font-medium">/</span>
                <span className="text-muted-foreground/70">
                  {target.toLocaleString()}
                  {isPercentage ? '%' : unit}
                </span>
              </div>
            )}
          </div>
        </div>
        {hasTarget && (
          <div className="relative h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${percentage}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
               className={cn(
                 "absolute top-0 left-0 h-full rounded-full",
                 isCompleted ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "bg-primary/60"
               )}
             />
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative rounded-[2rem] overflow-hidden border border-border/60 bg-card/40 backdrop-blur-2xl p-6 sm:p-10",
        currentLevelConfig.shadow,
        className
      )}
    >
      {/* Background Glow */}
      <div className={cn(
        "absolute inset-0 -z-10 bg-gradient-to-br opacity-30",
        currentLevelConfig.gradient
      )} />
      
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Level Badge & Status */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-8 relative">
          {/* Level Icon with double glow effect */}
          <div className="relative group/icon mt-4">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 border border-dashed border-primary/10 rounded-full"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border-2 border-primary/20 rounded-full border-t-primary"
            />
            <div className={cn(
              "w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center bg-card/60 backdrop-blur-xl border border-primary/30 shadow-[0_0_50px_rgba(var(--primary),0.15)] relative z-10 overflow-hidden",
              currentLevelConfig.color
            )}>
              {/* Inner animated pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent animate-pulse" />
              <currentLevelConfig.icon className="w-14 h-14 sm:w-20 sm:h-20 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" strokeWidth={1.5} />
            </div>
            
            <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-full shadow-2xl border-2 border-background z-20 whitespace-nowrap">
              {currentLevelConfig.label}
            </Badge>
          </div>

          <div className="text-center lg:text-left space-y-3 pt-4">
             <div className="inline-flex items-center gap-2 text-primary font-black uppercase text-[11px] tracking-widest bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Trạng thái Xác thực</span>
             </div>
             <h2 className={cn("text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none", currentLevelConfig.color)}>
              {currentLevelConfig.label}
            </h2>
            <p className="text-sm text-muted-foreground font-bold tracking-tight max-w-[200px] mx-auto lg:mx-0 opacity-70">
              Bạn đang ở cấp độ <span className={cn("font-black", currentLevelConfig.color)}>{currentLevelConfig.label}</span>. 
              Hãy tiếp tục nỗ lực để thăng hạng!
            </p>
          </div>

          <div className="w-full pt-2">
             {nextLevelConfig ? (
               <div className="relative group/next overflow-hidden p-6 rounded-[1.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/next:opacity-10 transition-opacity rotate-12">
                     <nextLevelConfig.icon className="w-20 h-20" />
                  </div>
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Mục tiêu thăng cấp</span>
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cấp bậc tiếp theo</p>
                        <h4 className={cn("text-2xl font-black uppercase tracking-tighter", nextLevelConfig.color)}>
                          {nextLevelConfig.label}
                        </h4>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover/next:scale-110 transition-transform">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-primary font-bold bg-white/5 p-2 rounded-xl">
                       <Zap className="w-3.5 h-3.5 fill-primary" />
                       <span>Ưu tiên thăng hạng ngay!</span>
                    </div>
                  </div>
               </div>
             ) : (
               <div className="p-8 rounded-[1.5rem] bg-amber-500/10 border border-amber-500/20 text-center flex flex-col items-center gap-3 shadow-2xl shadow-amber-500/5">
                 <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                    <Trophy className="w-10 h-10" />
                 </div>
                 <span className="font-black text-xl text-amber-500 uppercase tracking-tighter">Đỉnh cao Danh vọng</span>
                 <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">Bạn đã đạt cấp độ tối thượng</p>
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Progress Metrics */}
        <div className="lg:col-span-8 flex flex-col space-y-10">
          {/* Header & Overall Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground">Hành trình tiến hóa</h3>
            </div>
          </div>

          <div className="space-y-8">
            {/* Category: General Activity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1 text-muted-foreground/60 uppercase text-[10px] font-black tracking-[0.2em]">
                <BookOpen className="w-3 h-3" />
                <span>Hoạt động & Đào tạo</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricItem 
                  label="Điểm danh" 
                  current={progress.currentAttendance} 
                  target={progress.targetAttendance} 
                  icon={Calendar} 
                />
                <MetricItem 
                  label="Khóa học MOOC" 
                  current={progress.currentMooc} 
                  target={progress.targetMooc} 
                  icon={BookOpen} 
                />
              </div>
            </div>

            {/* Category: Trading volume */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1 text-muted-foreground/60 uppercase text-[10px] font-black tracking-[0.2em]">
                <Layers className="w-3 h-3" />
                <span>Hoạt động Giao dịch</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricItem 
                  label="Giao dịch Spot" 
                  current={progress.currentSpotOrders} 
                  target={progress.targetSpotOrders} 
                  icon={Layers} 
                />
                <MetricItem 
                  label="Giao dịch Futures" 
                  current={progress.currentFutureOrders} 
                  target={progress.targetFutureOrders} 
                  icon={Zap} 
                />
                <MetricItem 
                  label="Số lệnh có đòn bẩy cao" 
                  current={progress.currentHighLevTrades} 
                  target={progress.limitHighLevTrades} 
                  icon={Info} 
                />
              </div>
            </div>

            {/* Category: Performance metrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1 text-muted-foreground/60 uppercase text-[10px] font-black tracking-[0.2em]">
                <TrendingUp className="w-3 h-3" />
                <span>Chỉ số Hiệu suất</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricItem 
                  label="Lợi nhuận Futures" 
                  current={progress.currentFuturePnl} 
                  target={progress.targetFuturePnl} 
                  unit=" USDT"
                  icon={TrendingUp} 
                />
                <MetricItem 
                  label="Tỷ lệ thắng (Win Rate)" 
                  current={progress.currentWinRate} 
                  target={progress.targetWinRate} 
                  isPercentage
                  icon={Trophy} 
                />
                <MetricItem 
                  label="Tỷ lệ TP/SL" 
                  current={progress.currentTpSlRate} 
                  target={progress.targetTpSlRate} 
                  isPercentage
                  icon={Target} 
                />
                <MetricItem 
                  label="Tỷ lệ thanh lý (Liq)" 
                  current={progress.currentLiqRate} 
                  target={progress.limitLiqRate} 
                  isPercentage
                  icon={ShieldCheck} 
                />
              </div>
            </div>
          </div>

          {/* Qualification Status Section */}
          <div className={cn(
            "p-5 rounded-2xl border flex items-center justify-between transition-all duration-500",
            progress.educatedQualified 
              ? "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
              : "bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
          )}>
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                progress.educatedQualified ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
              )}>
                {progress.educatedQualified ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-black text-lg uppercase tracking-tight">Đủ điều kiện đào tạo</h4>
                <p className="text-sm text-muted-foreground font-medium">
                  {progress.educatedQualified 
                    ? "Bạn đã hoàn thành các khóa đào tạo bắt buộc." 
                    : "Bạn cần hoàn thành thêm các khóa đào tạo để thăng cấp."}
                </p>
              </div>
            </div>
            <Badge className={cn(
              "px-4 py-1.5 rounded-lg font-black text-xs uppercase",
              progress.educatedQualified ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {progress.educatedQualified ? "Đạt chuẩn" : "Chưa đạt"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Level Roadmap / Progress Path */}
      <div className="mt-12 pt-8 border-t border-border/40">
        <div className="flex items-center gap-3 mb-8 px-2">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground/80">Lộ trình Danh hiệu</h4>
        </div>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted/20 -translate-y-1/2 rounded-full hidden sm:block" />
          
          <div className="relative grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-2">
            {(Object.keys(LEVEL_CONFIG) as UserLevel[]).map((levelKey, index) => {
              const level = LEVEL_CONFIG[levelKey];
              const isCurrent = progress.currentLevel === levelKey;
              const isPast = (Object.keys(LEVEL_CONFIG) as UserLevel[]).indexOf(progress.currentLevel) > index;
              
              return (
                <div key={levelKey} className="flex flex-col items-center text-center space-y-4 relative z-10 group">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                    isCurrent 
                      ? cn("bg-background shadow-[0_0_20px_rgba(var(--primary),0.3)] scale-110 z-20", level.color.replace('text', 'border'))
                      : isPast
                        ? cn("bg-primary/20", level.color.replace('text', 'border'))
                        : "bg-muted/10 border-muted/20 grayscale"
                  )}>
                    <level.icon className={cn(
                      "w-6 h-6 transition-colors",
                      isCurrent || isPast ? level.color : "text-muted-foreground/40"
                    )} />
                  </div>
                  
                  <div className="space-y-1">
                    <p className={cn(
                      "text-[11px] font-black uppercase tracking-tighter transition-colors",
                      isCurrent ? level.color : isPast ? "text-foreground/80" : "text-muted-foreground/40"
                    )}>
                      {level.label}
                    </p>
                    {isCurrent && (
                      <Badge className="bg-primary/20 text-primary border-primary/20 text-[8px] font-black uppercase px-2 py-0">
                        Bạn đang ở đây
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
