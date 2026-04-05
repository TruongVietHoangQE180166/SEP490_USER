'use client';

import React, { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, X, Calendar, Clock, Activity, DollarSign, Target,
  Play, Loader2, ChevronDown, ChevronUp, RotateCcw, AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudentChartDemo } from '../hooks/useStudentChartDemo';
import { useResetAnswerDemo } from '../hooks/useResetAnswerDemo';
import { ChartDemoData } from '../types';
import { AnswerDemoHistory } from './AnswerDemoHistory';
import { cn } from '@/lib/utils';

import dynamic from 'next/dynamic';
const DemoChart = dynamic(
  () => import('@/modules/teacher-course/components/detail/DemoChart').then(m => m.DemoChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-muted-foreground/50">
        <Loader2 className="animate-spin mr-2" size={20} /> Đang tải đồ thị...
      </div>
    ),
  }
);

interface StudentChartDemoProps {
  videoId: string;
  videoTitle?: string;
}

// ── Reset confirm dialog ───────────────────────────────────────────────────────

function ResetConfirmDialog({
  onConfirm,
  onCancel,
  isResetting,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  isResetting: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="w-full max-w-md rounded-3xl border border-rose-500/30 bg-background shadow-2xl shadow-rose-500/10 overflow-hidden"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-orange-500" />
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={24} className="text-rose-400" />
            </div>
            <div>
              <p className="text-lg font-black text-foreground">Xác nhận Reset mô phỏng</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Toàn bộ lịch sử giao dịch demo sẽ bị{' '}
                <span className="text-rose-400 font-bold">xoá vĩnh viễn</span>. Số dư ví được khôi
                phục về ban đầu. Hành động này không thể hoàn tác.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isResetting}
              className="flex-1 h-11 rounded-xl border border-border/40 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all disabled:opacity-40"
            >
              Huỷ bỏ
            </button>
            <button
              onClick={onConfirm}
              disabled={isResetting}
              className="flex-1 h-11 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-black transition-all shadow-lg shadow-rose-500/30 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isResetting ? (
                <><Loader2 size={16} className="animate-spin" /> Đang reset...</>
              ) : (
                <><RotateCcw size={16} /> Reset ngay</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (!mounted) return null;
  
  return createPortal(content, document.body);
}

import { toast } from '@/components/ui/toast';

// ── Reset button (uses useResetAnswerDemo hook) ────────────────────────────────

function ResetButton({
  chartId,
  onResetSuccess,
}: {
  chartId: string;
  onResetSuccess: () => void;
}) {
  const { isResetting, error, reset, clear } = useResetAnswerDemo();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = useCallback(async () => {
    const response = await reset(chartId);
    setShowConfirm(false);
    if (response?.success) {
      toast.success('Reset thành công! Mô phỏng đã được làm mới.');
      onResetSuccess();
    } else {
      toast.error(response?.message?.messageDetail || error || 'Reset thất bại.');
    }
  }, [chartId, reset, onResetSuccess, error]);

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => {
          setShowConfirm(v => !v);
          clear();
        }}
        className={cn(
          'group flex items-center gap-2 h-9 px-4 rounded-xl font-black text-[11px] uppercase tracking-wider border transition-all',
          showConfirm
            ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/40'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/25 hover:bg-rose-500/20 hover:border-rose-500/40 hover:shadow-md hover:shadow-rose-500/20',
        )}
      >
        <RotateCcw
          size={13}
          className={cn('transition-transform duration-300', showConfirm && 'rotate-180')}
        />
        Reset
      </button>

      <AnimatePresence>
        {showConfirm && (
          <ResetConfirmDialog
            onConfirm={handleConfirm}
            onCancel={() => setShowConfirm(false)}
            isResetting={isResetting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Chart demo modal ───────────────────────────────────────────────────────────

function ChartDemoModal({
  demo,
  onClose,
}: {
  demo: ChartDemoData;
  onClose: () => void;
}) {
  const [showInfo, setShowInfo] = useState(true);
  // Bump key to remount AnswerDemoHistory (triggers fresh fetch) after reset
  const [historyKey, setHistoryKey] = useState(0);

  const handleResetSuccess = useCallback(() => {
    setHistoryKey(k => k + 1);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex flex-col"
    >
      {/* ── Sticky header ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/30 bg-background/95 backdrop-blur shrink-0 sticky top-0 z-10">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
          <BarChart3 size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-black text-foreground truncate">
            Chart Demo – {demo.videoTitle}
          </h2>
          <p className="text-[10px] text-muted-foreground font-medium">
            {demo.candles?.length || 0} nến · Thực hành phân tích biểu đồ
          </p>
        </div>

        {/* Reset button — prominent in header */}
        <ResetButton chartId={demo.id} onResetSuccess={handleResetSuccess} />

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground rounded-xl shrink-0"
        >
          <X size={18} />
        </Button>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* Info panel (collapsible) */}
        <div className="bg-muted/20 border-b border-border/30">
          <button
            onClick={() => setShowInfo(v => !v)}
            className="w-full flex items-center justify-between px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Thông tin phiên thực hành</span>
            {showInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-background/80 rounded-xl p-3 border border-border/40 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                      <Calendar size={10} /> Bắt đầu Chart
                    </span>
                    <p className="text-xs font-bold">{new Date(demo.ts).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="bg-background/80 rounded-xl p-3 border border-emerald-500/20 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                      <Clock size={10} /> Bắt đầu GD
                    </span>
                    <p className="text-xs font-bold text-emerald-600">
                      {new Date(demo.startTradeTs).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="bg-background/80 rounded-xl p-3 border border-rose-500/20 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1">
                      <Activity size={10} /> Nến hiện tại
                    </span>
                    <p className="text-xs font-bold text-rose-600">
                      {new Date(demo.closeTs).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="bg-background/80 rounded-xl p-3 border border-amber-500/20 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1">
                      <Clock size={10} /> Giới hạn
                    </span>
                    <p className="text-xs font-bold text-amber-600">
                      {new Date(demo.limitTs).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="bg-background/80 rounded-xl p-3 border border-blue-500/20 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-1">
                      <DollarSign size={10} /> Số dư cấp
                    </span>
                    <p className="text-xs font-black text-blue-600">
                      ${demo.provideMoney?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-background/80 rounded-xl p-3 border border-purple-500/20 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-purple-500 flex items-center gap-1">
                      <Target size={10} /> Mục tiêu
                    </span>
                    <p className="text-xs font-black text-purple-600">
                      ${demo.objectDone?.toLocaleString()}
                    </p>
                  </div>
                </div>
                {demo.description && (
                  <div className="px-6 pb-4">
                    <p className="text-xs text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg border-l-4 border-l-primary/40 italic">
                      {demo.description}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chart */}
        <div className="p-4" style={{ minHeight: '440px', height: '50vh' }}>
          <div className="w-full h-full rounded-xl overflow-hidden border border-border/40 shadow-inner bg-background">
            {demo.candles && demo.candles.length > 0 ? (
              <DemoChart candles={demo.candles} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground/50">
                <BarChart3 size={40} />
                <p className="text-sm font-medium">Chưa có dữ liệu nến cho phiên này.</p>
              </div>
            )}
          </div>
        </div>

        {/* History — key remounts on reset to trigger fresh API fetch */}
        <AnswerDemoHistory key={historyKey} chartId={demo.id} />
      </div>
    </motion.div>
  );
}

// ── Entry card ─────────────────────────────────────────────────────────────────

export const StudentChartDemoSection: React.FC<StudentChartDemoProps> = ({ videoId }) => {
  const { chartDemo, isLoading } = useStudentChartDemo(videoId);
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mt-6 flex items-center gap-2 text-muted-foreground/60 text-xs font-medium">
        <Loader2 size={14} className="animate-spin" />
        <span>Đang kiểm tra Chart Demo...</span>
      </div>
    );
  }

  if (!chartDemo) return null;

  return (
    <>
      <div className="mt-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-emerald-500/5 p-5 flex items-center gap-5 shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-shadow">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
          <BarChart3 size={26} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
              Chart Demo
            </span>
          </div>
          <h3 className="text-sm font-black text-foreground">Thực hành phân tích biểu đồ</h3>
          <p className="text-xs text-muted-foreground font-medium mt-0.5 line-clamp-1">
            {chartDemo.description ||
              `${chartDemo.candles?.length || 0} nến · Mục tiêu $${chartDemo.objectDone?.toLocaleString()}`}
          </p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="shrink-0 h-10 px-5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 gap-2"
        >
          <Play size={14} className="fill-white" />
          Thực hành ngay
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && <ChartDemoModal demo={chartDemo} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
};
