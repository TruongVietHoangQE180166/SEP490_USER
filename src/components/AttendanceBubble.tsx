'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, X, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from '@legendapp/state/react';
import { SupportChatService } from '@/modules/support-chat/services';
import { AttendanceRecord, REWARD_NORMAL_DAY, REWARD_WEEKEND_DAY } from '@/modules/support-chat/types';
import { authState$ } from '@/modules/auth/store';
import { usePathname, useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';

// Helper: Is the given day a weekend (Sat=6, Sun=0)?
const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

// Helper: Is the date strictly before today (same timezone, normalized to midnight)?
const isPastDay = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d < today;
};

const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const AttendanceBubble = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const isAuthenticated = useSelector(() => authState$.isAuthenticated.get());
  const isAuthPage = AUTH_ROUTES.some((route) => pathname?.startsWith(route));
  const isLearnPage = pathname?.startsWith('/learn');
  const isAdminPage = pathname?.startsWith('/admin');
  const isTeacherPage = pathname?.startsWith('/teacher');
  const isTradingPage = pathname?.startsWith('/trading');

  useEffect(() => { setIsMounted(true); }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    const res = await SupportChatService.getAttendanceHistory();
    if (res?.data) setHistory(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isAuthenticated || !isMounted || isAuthPage || isLearnPage || isAdminPage || isTeacherPage || isTradingPage) return;
    fetchHistory();
  }, [isAuthenticated, isMounted, pathname]);

  // Derived state
  const attendedDays = useMemo(
    () => new Set(history.map((item) => new Date(item.attendanceDate).toDateString())),
    [history]
  );

  const today = new Date();
  const todayAttended = attendedDays.has(today.toDateString());
  const todayReward = isWeekend(today) ? REWARD_WEEKEND_DAY : REWARD_NORMAL_DAY;

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    const res = await SupportChatService.checkIn(todayReward);
    if (res?.success) {
      toast.success(`Điểm danh thành công! +${todayReward} USDT`, {
        description: isWeekend(today) ? '🎉 Bonus cuối tuần! Hẹn gặp lại ngày mai!' : 'Hẹn gặp lại ngày mai!',
        duration: 4000,
      });
      await fetchHistory();
    } else {
      const errMsg = res?.errors?.[0]?.message || res?.message?.messageDetail || 'Điểm danh thất bại';
      toast.error(errMsg, { duration: 4000 });
    }
    setIsCheckingIn(false);
  };

  // Calendar Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDay }, (_, i) => i);
  const monthNames = [
    'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
    'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
    ];

  const isThisMonth = (d: string) => {
    const date = new Date(d);
    return date.getMonth() === month && date.getFullYear() === year;
  };

  const thisMonthCount = isAuthenticated 
    ? Array.from(attendedDays).filter(isThisMonth).length 
    : 0;

  if (!isMounted || isAuthPage || isLearnPage || isAdminPage || isTeacherPage || isTradingPage) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        id="attendance-bubble"
        initial={{ y: 0 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1, y: 0 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="group fixed bottom-28 right-8 z-[9999] flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 ring-4 ring-primary/20 cursor-pointer pointer-events-auto"
      >
        <CalendarDays size={28} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />

        {/* Badge: chưa điểm danh hôm nay (chỉ hiện khi đã đăng nhập) */}
        {isAuthenticated && !todayAttended && !isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 z-30 h-5 px-1.5 flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold border-2 border-background shadow-lg"
          >
            !
          </motion.div>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="attendance-panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed bottom-48 right-8 z-[9999] w-96 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <CalendarDays className="text-primary" size={18} />
                <h3 className="font-bold text-sm text-foreground">Lịch sử điểm danh</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Login Prompt for Unauthenticated Users */}
            {!isAuthenticated ? (
                <div className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                        <Zap size={32} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-base text-foreground">Bạn chưa đăng nhập</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Vui lòng đăng nhập để tham gia điểm danh và nhận phần thưởng USDT mỗi ngày!
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            router.push('/login');
                        }}
                        className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            ) : (
                <>
                    {/* Check-in Banner or Already Attended */}
                    {todayAttended ? (
                      <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                        <Check size={16} className="text-emerald-500 shrink-0" strokeWidth={3} />
                        <div>
                          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 leading-tight">Hôm nay đã điểm danh rồi!</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Đã nhận <span className="font-bold text-emerald-500">+{todayReward} USDT</span>
                            {isWeekend(today) ? ' 🎉 bonus cuối tuần' : ''}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mx-4 mt-3 p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <AlertCircle size={15} className="text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground leading-tight">Hôm nay chưa điểm danh</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Thưởng: <span className="text-primary font-bold">+{todayReward} USDT</span>
                              {isWeekend(today) && ' 🎉 cuối tuần'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleCheckIn}
                          disabled={isCheckingIn}
                          className="flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-60"
                        >
                          {isCheckingIn ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Zap size={12} />
                          )}
                          {isCheckingIn ? 'Đang...' : 'Điểm danh'}
                        </button>
                      </div>
                    )}

                    <div className="p-4">
                      {/* Month Navigation */}
                      <div className="flex justify-between items-center mb-3">
                        <button type="button" onClick={() => setCurrentDate(new Date(year, month - 1))}
                          className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-base font-bold">
                          ‹
                        </button>
                        <h4 className="font-semibold text-sm text-foreground">{monthNames[month]} {year}</h4>
                        <button type="button" onClick={() => setCurrentDate(new Date(year, month + 1))}
                          disabled={year === new Date().getFullYear() && month === new Date().getMonth()}
                          className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed">
                          ›
                        </button>
                      </div>

                      {/* Day Headers: highlight weekend */}
                      <div className="grid grid-cols-7 gap-1 mb-1">
                        {['T2','T3','T4','T5','T6','T7','CN'].map((d, i) => (
                          <div key={d} className={cn(
                            'text-center text-[10px] font-bold py-1',
                            i >= 5 ? 'text-rose-400' : 'text-muted-foreground'
                          )}>{d}</div>
                        ))}
                      </div>

                      {/* Calendar Grid */}
                      {isLoading ? (
                        <div className="py-10 flex justify-center">
                          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-7 gap-1">
                          {blanks.map((b) => <div key={`b-${b}`} className="aspect-square" />)}
                          {days.map((d) => {
                            const dateObj = new Date(year, month, d);
                            const attended = attendedDays.has(dateObj.toDateString());
                            const todayCell = isToday(dateObj);
                            const past = isPastDay(dateObj);
                            const missed = past && !attended;
                            const weekend = isWeekend(dateObj);
                            const future = !past && !todayCell;

                            return (
                              <div key={d}
                                title={
                                  attended ? `Đã điểm danh (+${history.find(h => new Date(h.attendanceDate).toDateString() === dateObj.toDateString())?.rewardAmount ?? 0} USDT)` :
                                  missed ? 'Đã bỏ lỡ điểm danh' :
                                  todayCell ? 'Hôm nay' : ''
                                }
                                className={cn(
                                  'rounded-lg flex flex-col items-center justify-center py-1 gap-0.5 text-[11px] font-medium transition-all relative min-h-[36px]',
                                  attended && 'bg-primary text-primary-foreground shadow-sm',
                                  todayCell && !attended && 'ring-2 ring-primary text-primary font-bold bg-primary/5',
                                  missed && 'bg-rose-50 dark:bg-rose-950/30 text-rose-400 dark:text-rose-500',
                                  future && !weekend && 'text-muted-foreground hover:bg-muted',
                                  weekend && (future || todayCell) && !attended && 'text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20',
                                )}
                              >
                                {attended ? (
                                  <Check size={13} strokeWidth={3} className="text-primary-foreground" />
                                ) : missed ? (
                                  <span className="text-[8px] font-bold leading-none text-center">miss</span>
                                ) : (
                                  <>
                                    <span className="leading-none">{d}</span>
                                    <span className={cn(
                                      'text-[8px] leading-none font-semibold',
                                      weekend ? 'text-rose-400 dark:text-rose-400' : 'text-primary/60',
                                      todayCell && 'text-primary'
                                    )}>
                                      +{weekend ? REWARD_WEEKEND_DAY : REWARD_NORMAL_DAY}
                                    </span>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Summary row */}
                      {!isLoading && (
                        <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-muted-foreground">Điểm danh tháng</span>
                            <span className="font-bold text-primary text-sm">{thisMonthCount} ngày</span>
                          </div>
                          <div className="flex flex-col gap-0.5 text-right">
                            <span className="text-muted-foreground">Thưởng hôm nay</span>
                            <span className="font-bold text-amber-500 text-sm">
                              +{todayReward} USDT{isWeekend(today) ? ' 🎉' : ''}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
