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
import { profileState$, profileActions } from '../store';
import { authState$ } from '@/modules/auth/store';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/toast';
import { Loader2, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserLevelCardProps {
  progress: UserProgress;
  className?: string;
}

export const LEVEL_REWARDS: Record<UserLevel, number> = {
  NHAP_MON: 1000,
  NEN_TANG: 10000,   // Quà lên Nền Tảng
  TRUNG_CAP: 20000,  // Quà lên Trung Cấp
  THUC_HANH: 50000,  // Quà lên Thực Hành
  NANG_CAO: 100000,  // Quà lên Nâng Cao
};

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

  const user = authState$.user.get();
  const claimedLevels = profileState$.claimedLevels.get() || [];
  const isClaiming = profileState$.isClaiming.get();
  const [claimingLevel, setClaimingLevel] = useState<string | null>(null);
  
  // Dialog states
  const [confirmClaim, setConfirmClaim] = useState<{levelId: string, amount: number} | null>(null);
  const [successClaim, setSuccessClaim] = useState<{levelId: string, amount: number} | null>(null);
  
  // Upgrade states
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const isUpgrading = profileState$.isProgressLoading.get();

  useEffect(() => {
    if (user?.userId) {
      profileActions.fetchClaimedLevels(user.userId);
    }
  }, [user?.userId]);

  const isAllCriteriaMet = progress.nextLevel &&
    progress.currentAttendance >= progress.targetAttendance &&
    progress.currentMooc >= progress.targetMooc &&
    progress.currentSpotOrders >= progress.targetSpotOrders &&
    progress.currentFutureOrders >= progress.targetFutureOrders &&
    progress.currentFuturePnl >= progress.targetFuturePnl &&
    progress.currentWinRate >= progress.targetWinRate &&
    progress.currentTpSlRate >= progress.targetTpSlRate &&
    progress.currentHighLevTrades <= progress.limitHighLevTrades &&
    progress.currentLiqRate <= progress.limitLiqRate &&
    progress.educatedQualified;

  const handleUpgrade = async () => {
    const res = await profileActions.checkUpgrade();
    if (res.success) {
      setShowUpgradeSuccess(true);
      triggerConfetti();
    } else {
      toast.error(res.message || 'Có lỗi xảy ra khi thăng cấp');
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const executeClaim = async () => {
    if (!user?.userId || !confirmClaim) return;
    const { levelId, amount } = confirmClaim;
    
    setClaimingLevel(levelId);
    try {
      const success = await profileActions.claimLevel(user.userId, levelId, amount);
      if (success) {
        setConfirmClaim(null);
        setSuccessClaim({ levelId, amount });
      } else {
        toast.error('Nhận thưởng thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setClaimingLevel(null);
    }
  };

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
                    
                    {isAllCriteriaMet ? (
                      <Button 
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all h-10 mt-2"
                        onClick={handleUpgrade}
                        disabled={isUpgrading}
                      >
                        {isUpgrading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 w-4 h-4 fill-white" />}
                        THĂNG CẤP NGAY!
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-primary font-bold bg-white/5 p-2 rounded-xl">
                         <Zap className="w-3.5 h-3.5 fill-primary" />
                         <span>Ưu tiên thăng hạng ngay!</span>
                      </div>
                    )}
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

          {isAllCriteriaMet && (
            <div className="flex flex-col items-center justify-center p-10 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-[2rem] border border-emerald-500/20 text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-500/20 blur-xl rounded-full" />
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/40 relative z-10">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase text-emerald-500">Đủ điều kiện thăng cấp!</h3>
                <p className="text-muted-foreground max-w-md mx-auto text-sm">
                  Tuyệt vời! Bạn đã hoàn thành tất cả các mục tiêu và tiêu chí để bước sang cấp bậc 
                  <strong className="text-emerald-400 ml-1">{nextLevelConfig?.label}</strong>. Hãy nhấn nút thăng cấp để mở khóa những đặc quyền mới.
                </p>
              </div>
              <Button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-bounce h-12 px-10 font-bold"
              >
                {isUpgrading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 w-5 h-5 fill-white" />}
                XÁC NHẬN THĂNG CẤP NGAY
              </Button>
            </div>
          )}

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
                <div key={levelKey} className="flex flex-col items-center text-center space-y-3 relative z-10 group">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 relative",
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
                    
                    {/* Checkmark for claimed rewards */}
                    {(isCurrent || isPast) && LEVEL_REWARDS[levelKey] > 0 && claimedLevels.includes(levelKey) && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5 shadow-md">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                    
                    {/* Nút Nhận Thưởng Dạng Overlay Hộp Quà */}
                    {(isCurrent || isPast) && LEVEL_REWARDS[levelKey] > 0 && !claimedLevels.includes(levelKey) && (
                      <div 
                        className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-full cursor-pointer hover:bg-black/60 transition-colors pointer-events-auto"
                        onClick={() => setConfirmClaim({ levelId: levelKey, amount: LEVEL_REWARDS[levelKey] })}
                        title={`Nhận phần thưởng thăng cấp ${LEVEL_REWARDS[levelKey].toLocaleString()} USDT`}
                      >
                        <motion.div
                          animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                          className="drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]"
                        >
                          <Gift className="w-7 h-7 text-amber-400 fill-amber-500/20" />
                        </motion.div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1.5 flex flex-col items-center">
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
                    
                    {/* Trạng thái đã nhận thưởng */}
                    {(isCurrent || isPast) && LEVEL_REWARDS[levelKey] > 0 && claimedLevels.includes(levelKey) && (
                      <div className="mt-1">
                        <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest flex items-center gap-1">
                          Đã nhận thưởng
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AlertDialog open={!!confirmClaim} onOpenChange={(open) => !open && setConfirmClaim(null)}>
        <AlertDialogContent className="w-[90vw] max-w-[400px]">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 text-amber-500">
              <Gift size={32} />
            </div>
            <AlertDialogTitle className="text-2xl text-amber-500 font-bold">Quà Thăng Hạng</AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-2">
              Chúc mừng bạn đã vượt qua mốc cấp độ này! Nhận ngay phần thưởng <strong className="text-foreground font-bold">{confirmClaim?.amount.toLocaleString()} USDT</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-6">
            <AlertDialogCancel className="w-full sm:w-auto" disabled={isClaiming || !!claimingLevel}>
              Để sau
            </AlertDialogCancel>
            <Button 
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white" 
              onClick={executeClaim}
              disabled={isClaiming || !!claimingLevel}
            >
              {isClaiming ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang nhận...</>
              ) : (
                "Nhận Thưởng Ngay"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Modal */}
      <AlertDialog open={!!successClaim} onOpenChange={(open) => !open && setSuccessClaim(null)}>
        <AlertDialogContent className="w-[90vw] max-w-[400px]">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 15, -15, 15, 0] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4 text-green-500 relative"
            >
              <Gift size={40} className="drop-shadow-md" />
              <span className="absolute w-2 h-2 rounded-full bg-amber-400 top-2 -right-2 animate-ping" style={{ animationDelay: '0.2s' }}></span>
              <span className="absolute w-2 h-2 rounded-full bg-blue-400 bottom-0 -left-2 animate-ping" style={{ animationDelay: '0.4s' }}></span>
            </motion.div>
            <AlertDialogTitle className="text-3xl text-green-500 font-extrabold pb-2">Tuyệt Vời!</AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-2">
              Bạn đã nhận thành công <strong className="text-foreground text-amber-500 font-bold">{successClaim?.amount.toLocaleString()} USDT</strong>. Tiếp tục hoàn thành các nhiệm vụ để tiến tới cấp độ tiếp theo nhé!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center mt-6">
            <Button 
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white rounded-xl px-8" 
              onClick={() => setSuccessClaim(null)}
            >
              Trở lại Lộ trình
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upgrade Success Modal */}
      <AlertDialog open={showUpgradeSuccess} onOpenChange={setShowUpgradeSuccess}>
        <AlertDialogContent className="w-[95vw] max-w-[480px] bg-gradient-to-br from-background via-background to-emerald-500/5 border-emerald-500/20 overflow-hidden p-0 rounded-[2.5rem] shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent" />
          
          <div className="relative z-10 px-6 py-12 sm:px-12 flex flex-col items-center text-center">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
              className="w-28 h-28 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 text-emerald-500 relative border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            >
              <Sparkles size={56} className="drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] fill-emerald-500/30" />
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 border border-emerald-500/20 rounded-full"
              />
            </motion.div>

            <div className="space-y-4">
              <AlertDialogTitle className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-teal-600 uppercase tracking-tighter leading-none">
                Thăng Cấp<br/>Thành Công!
              </AlertDialogTitle>
              
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto rounded-full opacity-50" />
              
              <AlertDialogDescription className="text-base sm:text-lg text-muted-foreground/80 font-medium leading-relaxed max-w-[320px] mx-auto">
                Chúc mừng bạn đã xuất sắc đạt được cấp độ mới. Lộ trình mới đã được mở khóa với nhiều đặc quyền hấp dẫn đang chờ đón bạn!
              </AlertDialogDescription>
            </div>

            <div className="w-full mt-12 flex justify-center">
              <Button 
                className="w-full max-w-[280px] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl h-14 text-lg font-black shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]" 
                onClick={() => setShowUpgradeSuccess(false)}
              >
                Tiếp tục Hành trình
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

    </motion.div>
  );
});
