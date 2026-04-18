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
import { useCreateAnswerDemo } from '../hooks/useCreateAnswerDemo';
import { ChartDemoData, AnswerDemoCandle } from '../types';
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

// ── Order confirm dialog ───────────────────────────────────────────────────────

function OrderConfirmDialog({
  order,
  onCancel,
  onConfirm,
  isPlacingOrder,
}: {
  order: { type: 'BUY' | 'SELL'; money: number; quantity: number; date: string };
  onCancel: () => void;
  onConfirm: () => void;
  isPlacingOrder: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  
  const isBuy = order.type === 'BUY';
  const orderType = order.type;
  const dateStr = order.date;
  const isPlacing = isPlacingOrder;

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
        className="w-full max-w-md rounded-3xl border border-primary/30 bg-background shadow-2xl shadow-primary/10 overflow-hidden"
      >
        <div className={cn("h-1.5 w-full bg-gradient-to-r", isBuy ? "from-emerald-500 to-green-400" : "from-rose-500 to-red-400")} />
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className={cn("h-12 w-12 rounded-2xl border flex items-center justify-center shrink-0 mt-0.5", isBuy ? "bg-emerald-500/15 border-emerald-500/25" : "bg-rose-500/15 border-rose-500/25")}>
              <Activity size={24} className={isBuy ? "text-emerald-400" : "text-rose-400"} />
            </div>
            <div>
              <p className="text-lg font-black text-foreground">Xác nhận Đặt lệnh</p>
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                <p>Loại lệnh: <strong className={isBuy ? "text-emerald-500" : "text-rose-500"}>{orderType}</strong></p>
                {isBuy ? (
                  <p>Số tiền: <strong>${Number(order.money).toLocaleString()}</strong></p>
                ) : (
                  <p>Khối lượng bán: <strong>{Number(order.quantity).toLocaleString()}</strong></p>
                )}
                <p>Đóng lệnh vào ngày: <strong>{new Date(dateStr + "T00:00:00Z").toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</strong> (Theo giờ VN)</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isPlacing}
              className="flex-1 h-11 rounded-xl border border-border/40 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all disabled:opacity-40"
            >
              Huỷ
            </button>
            <button
              onClick={onConfirm}
              disabled={isPlacing}
              className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-black transition-all shadow-lg shadow-primary/30 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPlacing ? (
                <><Loader2 size={16} className="animate-spin" /> Xử lý...</>
              ) : (
                <><CheckCircle2 size={16} /> Xác nhận</>
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

  // Local state for chart to update after a trade
  const [localCandles, setLocalCandles] = useState<any[]>(demo.candles || []);
  const [walletBalance, setWalletBalance] = useState<number>(demo.provideMoney || 0);

  const handleResetSuccess = useCallback(() => {
    setHistoryKey(k => k + 1);
    setLocalCandles(demo.candles || []);
    setWalletBalance(demo.provideMoney || 0);
  }, [demo]);

  const { isPlacingOrder, placeOrder } = useCreateAnswerDemo();
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeMoney, setTradeMoney] = useState<string>('');
  const [tradeQuantity, setTradeQuantity] = useState<string>('');
  
  // Dynamic calculation for SELL maximum quantity
  const currentPrice = localCandles && localCandles.length > 0 ? localCandles[localCandles.length - 1].close : 0;
  const availableQuantity = currentPrice > 0 ? walletBalance / currentPrice : 0;
  
  // datetime-local input string
  const [limitDateStr, setLimitDateStr] = useState<string>('');

  const [showOrderConfirm, setShowOrderConfirm] = useState(false);

  const handleValidation = () => {
    if (orderType === 'BUY') {
      if (!tradeMoney || isNaN(Number(tradeMoney)) || Number(tradeMoney) <= 0) {
        toast.error('Vui lòng nhập số tiền hợp lệ');
        return;
      }
      if (Number(tradeMoney) > walletBalance) {
        toast.error('Số dư ví không đủ để đặt lệnh này');
        return;
      }
    } else {
      if (!tradeQuantity || isNaN(Number(tradeQuantity)) || Number(tradeQuantity) <= 0) {
        toast.error('Vui lòng nhập khối lượng (Quantity) hợp lệ');
        return;
      }
      if (Number(tradeQuantity) > availableQuantity) {
        toast.error('Khối lượng bán vượt quá số lượng tối đa (' + availableQuantity.toFixed(4) + ')');
        return;
      }
    }

    if (!limitDateStr) {
      toast.error('Vui lòng chọn ngày đóng lệnh');
      return;
    }
    // Parse selected date as 00:00:00 UTC explicitly
    const orderTs = new Date(limitDateStr + "T00:00:00Z").getTime();
    
    if (orderTs <= demo.closeTs) {
      toast.error('Ngày đóng lệnh phải nằm sau thời gian hiện tại của biểu đồ.');
      return;
    }
    if (orderTs > demo.limitTs) {
      toast.error('Ngày đóng lệnh không được vượt quá giới hạn!');
      return;
    }
    
    setShowOrderConfirm(true);
  };

  const executeOrder = async () => {
    const orderTs = new Date(limitDateStr + "T00:00:00Z").getTime();
    const payload = {
      orderType,
      quantity: orderType === 'SELL' ? Number(tradeQuantity) : 0,
      totalMoney: orderType === 'BUY' ? Number(tradeMoney) : 0,
      ts: orderTs,
      chartId: demo.id,
    };

    const res = await placeOrder(payload);
    setShowOrderConfirm(false);

    if (res?.success && res.data) {
      toast.success('Đặt lệnh thành công!');
      // Update the chart with new candles
      if (res.data.candles) {
        setLocalCandles(res.data.candles);
      }
      setWalletBalance(res.data.walletMoney);
      setHistoryKey(k => k + 1); // Refresh history
      setTradeMoney('');
      setTradeQuantity('');
      setLimitDateStr('');
    } else {
      toast.error(res?.message?.messageDetail || 'Đặt lệnh thất bại');
    }
  };

  const isCompleted = demo.objectDone && walletBalance >= demo.objectDone;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex flex-col"
    >
      {/* ── Sticky header ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 md:gap-3 px-3 md:px-5 py-3 border-b border-border/30 bg-background/95 backdrop-blur shrink-0 sticky top-0 z-10">
        <div className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
          <BarChart3 size={16} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
          <div className="min-w-0">
            <h2 className="text-[11px] md:text-sm font-black text-foreground truncate">
              Chart Demo – {demo.videoTitle}
            </h2>
          </div>
          
          <AnimatePresence>
             {isCompleted && (
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="w-fit px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-1.5 text-[8px] md:text-[10px] font-black uppercase tracking-wider text-emerald-500 shadow-sm"
               >
                 <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-emerald-500"></span>
                 </span>
                 <span className="md:inline hidden">Hoàn Thành Chỉ Tiêu</span>
                 <span className="md:hidden">Hoàn Thành</span>
               </motion.div>
             )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Reset button — prominent in header */}
          <ResetButton chartId={demo.id} onResetSuccess={handleResetSuccess} />

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground hover:text-foreground rounded-xl shrink-0 p-0"
          >
            <X size={18} />
          </Button>
        </div>
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
                <div className="px-6 pb-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-background/80 rounded-xl p-3 border border-border/40 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                      <Calendar size={10} /> Bắt đầu Chart
                    </span>
                    <p className="text-xs font-bold">
                      {new Date(demo.ts).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
                    </p>
                  </div>
                  <div className="bg-background/80 rounded-xl p-3 border border-emerald-500/20 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                      <Clock size={10} /> Bắt đầu GD
                    </span>
                    <p className="text-xs font-bold text-emerald-600">
                      {new Date(demo.startTradeTs).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
                    </p>
                  </div>
                  <div className="bg-background/80 rounded-xl p-3 border border-rose-500/20 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1">
                      <Activity size={10} /> Nến hiện tại
                    </span>
                    <p className="text-xs font-bold text-rose-600">
                      {new Date(demo.closeTs).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="bg-background/80 rounded-xl p-3 border border-amber-500/20 space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1">
                      <Clock size={10} /> Giới hạn
                    </span>
                    <p className="text-xs font-bold text-amber-600">
                      {new Date(demo.limitTs).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className={cn("bg-background/80 rounded-xl p-3 border space-y-1 transition-colors duration-500", isCompleted ? "border-emerald-500/40 bg-emerald-500/5" : "border-blue-500/20")}>
                    <span className={cn("text-[9px] font-black uppercase tracking-widest flex items-center gap-1", isCompleted ? "text-emerald-500" : "text-blue-500")}>
                      <DollarSign size={10} /> Số dư ví
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <p className={cn("text-base font-black leading-none", isCompleted ? "text-emerald-600" : "text-blue-600")}>
                        ${walletBalance?.toLocaleString()}
                      </p>
                      <span className={cn("text-[10px] font-bold opacity-80", isCompleted ? "text-emerald-600" : "text-blue-500")}>
                        (≈ {availableQuantity.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 4 })} Qty)
                      </span>
                    </div>
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

        {/* Order Panel */}
        {isCompleted ? (
          <div className="px-4 py-6 mx-4 mt-2 mb-4 bg-emerald-500/5 border border-emerald-500/30 rounded-xl shadow-inner flex flex-col items-center justify-center gap-3 text-center">
             <div className="h-10 w-10 md:h-14 md:w-14 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 size={24} className="text-emerald-500" />
             </div>
             <div>
               <h3 className="text-[11px] md:text-[13px] font-black text-emerald-600 uppercase tracking-widest mb-1 mt-1">Hoàn Thành Thử thách!</h3>
               <p className="text-[10px] md:text-xs text-muted-foreground font-medium max-w-[450px]">
                 Xin chúc mừng! Tài sản của bạn đã đạt chỉ tiêu mục tiêu. Hệ thống đã khóa tính năng đặt cược.
               </p>
             </div>
             <p className="text-[9px] uppercase font-black tracking-widest text-emerald-500/70 mt-1 bg-emerald-500/10 px-3 py-1 rounded-full">
               * Hãy nhấn [RESET] phía trên để chơi lại
             </p>
          </div>
        ) : (
          <div className="px-4 py-3 mx-4 mt-2 mb-4 bg-muted/20 border border-border/40 rounded-xl shadow-inner flex flex-col lg:flex-row items-stretch lg:items-end gap-3 md:gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 flex-1">
              <div className="space-y-1.5">
                 <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground flex justify-between">
                    Loại lệnh
                 </label>
                 <div className="flex bg-background border border-border/40 rounded-lg p-1 w-full">
                   <button 
                     onClick={() => setOrderType('BUY')}
                     className={cn('flex-1 py-1.5 rounded-md text-[10px] font-bold transition-colors', orderType === 'BUY' ? 'bg-emerald-500 text-white shadow-sm' : 'text-emerald-500/60 hover:bg-emerald-500/10')}
                   >
                     BUY
                   </button>
                   <button 
                     onClick={() => setOrderType('SELL')}
                     className={cn('flex-1 py-1.5 rounded-md text-[10px] font-bold transition-colors', orderType === 'SELL' ? 'bg-rose-500 text-white shadow-sm' : 'text-rose-500/60 hover:bg-rose-500/10')}
                   >
                     SELL
                   </button>
                 </div>
              </div>
              
              <div className="space-y-1.5">
                 <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground flex justify-between">
                    {orderType === 'BUY' ? 'Số tiền ($)' : 'Khối lượng'}
                 </label>
                 <div className="relative">
                   {orderType === 'BUY' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">$</span>}
                   {orderType === 'BUY' ? (
                     <input 
                       type="number" 
                       placeholder="Nhập tiền..." 
                       value={tradeMoney}
                       onChange={e => setTradeMoney(e.target.value)}
                       className="w-full bg-background border border-border/40 rounded-lg pl-7 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/20"
                       min="0"
                     />
                   ) : (
                     <input 
                       type="number" 
                       placeholder="Nhập Qty..." 
                       value={tradeQuantity}
                       onChange={e => setTradeQuantity(e.target.value)}
                       className="w-full bg-background border border-border/40 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/20"
                       min="0"
                     />
                   )}
                 </div>
                 <div className="flex justify-between items-center px-1">
                    <span className="text-[8px] text-muted-foreground font-bold uppercase">{orderType === 'BUY' ? 'Ví' : 'Max'}: {orderType === 'BUY' ? walletBalance.toLocaleString() : availableQuantity.toFixed(2)}</span>
                    {orderType === 'SELL' && <button onClick={() => setTradeQuantity(availableQuantity.toString())} className="text-[8px] font-black text-primary uppercase">MAX</button>}
                 </div>
              </div>

              <div className="space-y-1.5">
                 <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground flex justify-between">
                    Ngày đóng 
                 </label>
                 <input 
                   type="date" 
                   value={limitDateStr}
                   onClick={(e) => { (e.target as any).showPicker?.(); }}
                   onChange={e => setLimitDateStr(e.target.value)}
                   min={new Date(demo.closeTs + 86400000).toISOString().split('T')[0]} 
                   max={new Date(demo.limitTs).toISOString().split('T')[0]}
                   className="w-full bg-background border border-border/40 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/20"
                 />
              </div>
            </div>

            <Button 
              onClick={handleValidation}
              disabled={isPlacingOrder || demo.done}
              className="w-full lg:w-40 h-10 lg:h-12 rounded-lg font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white"
            >
              {isPlacingOrder ? <Loader2 size={14} className="animate-spin" /> : 'ĐẶT LỆNH'}
            </Button>
          </div>
        )}

        <AnimatePresence>
          {showOrderConfirm && (
            <OrderConfirmDialog
              order={{
                type: orderType,
                money: orderType === 'BUY' ? Number(tradeMoney) : 0,
                quantity: orderType === 'SELL' ? Number(tradeQuantity) : 0,
                date: limitDateStr,
              }}
              onCancel={() => setShowOrderConfirm(false)}
              onConfirm={executeOrder}
              isPlacingOrder={isPlacingOrder}
            />
          )}
        </AnimatePresence>

        {/* Charts */}
        <div className="px-4 pb-4 flex flex-col gap-4">
          {/* Original Chart */}
          <div style={{ minHeight: '440px', height: '40vh' }} className="w-full rounded-xl overflow-hidden border border-border/40 shadow-inner bg-background relative">
            <div className="absolute top-3 right-3 z-30 px-2.5 py-1 bg-background/80 backdrop-blur border border-border/40 text-foreground text-[10px] font-black uppercase tracking-wider rounded-md shadow-sm">
               Phân tích ban đầu
            </div>
            {demo.candles && demo.candles.length > 0 ? (
              <DemoChart candles={demo.candles} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground/50">
                <BarChart3 size={40} />
                <p className="text-sm font-medium">Chưa có dữ liệu nến cho phiên này.</p>
              </div>
            )}
          </div>

          {/* Result Chart (Shown only if new candles are added) */}
          {(localCandles && demo.candles && localCandles.length > demo.candles.length) && (
            <div style={{ minHeight: '440px', height: '40vh' }} className="w-full rounded-xl overflow-hidden border-2 border-emerald-500/30 shadow-inner shadow-emerald-500/10 bg-emerald-500/5 relative">
              <div className="absolute top-3 right-3 z-30 px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-sm">
                 Kết quả thị trường sau khi lệnh đóng
              </div>
              <DemoChart candles={localCandles} themeVariant="result" />
            </div>
          )}
        </div>

        {/* History — key remounts on reset to trigger fresh API fetch */}
        <AnswerDemoHistory 
           key={historyKey} 
           chartId={demo.id} 
           onLatestWalletMoney={(newWalletBalance) => {
              // Ensure we only update if it is different, to avoid loop
              if (newWalletBalance !== walletBalance) {
                 setWalletBalance(newWalletBalance);
              }
           }} 
        />
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
      <div className="mt-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-emerald-500/5 p-4 md:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-4 md:gap-5 shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-shadow">
        <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-xl md:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
          <BarChart3 size={20} className="text-primary md:hidden" />
          <BarChart3 size={26} className="text-primary hidden md:block" />
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
              Chart Demo
            </span>
          </div>
          <h3 className="text-xs md:text-sm font-black text-foreground">Thực hành phân tích biểu đồ</h3>
          <p className="text-[10px] md:text-xs text-muted-foreground font-medium mt-0.5 line-clamp-1">
            {chartDemo.description ||
              `${chartDemo.candles?.length || 0} nến · Mục tiêu $${chartDemo.objectDone?.toLocaleString()}`}
          </p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto shrink-0 h-10 px-6 rounded-xl font-black text-[10px] md:text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 gap-2"
        >
          <Play size={12} className="fill-white" />
          Thực hành
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && <ChartDemoModal demo={chartDemo} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
};
