'use client';

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, QrCode, CreditCard, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { usePaymentPolling } from '../../hooks/usePaymentPolling';
import { WalletService } from '../../services';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';

export const DepositModal = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [step, setStep] = useState<'input' | 'qr'>('input');
  const { 
    createTopUp, 
    isLoading, 
    currentPayment, 
    fetchWalletInfo, 
    error,
    checkPaymentStatus,
    cancelPayment
  } = useWallet();

  // Polling for payment status
  usePaymentPolling(currentPayment?.id, () => {
    // On success: refresh wallet and close
    fetchWalletInfo();
    setIsOpen(false);
    setStep('input');
    setAmount('');
  });

  const handleCreatePayment = async () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 10000) {
      toast.error('Số tiền nạp tối thiểu là 10,000 VND');
      return;
    }

    const res = await createTopUp(numAmount);
    if (res.success) {
      setStep('qr');
    } else {
      toast.error(res.error || 'Lỗi khi tạo yêu cầu nạp tiền');
    }
  };

  const handleManualCheck = async () => {
    if (currentPayment?.status === 'COMPLETED') {
      handleClose();
      return;
    }

    if (currentPayment?.id) {
       const detail = await checkPaymentStatus(currentPayment.id);
       if (detail?.status === 'COMPLETED') {
         toast.success('Thành công! Tiền đã được cộng vào tài khoản.');
         fetchWalletInfo();
         handleClose();
       } else {
         toast.info('Hệ thống đang chờ xử lý. Giao dịch sẽ được cập nhật tự động trong giây lát!');
       }
    }
  };

  const handleCloseRequest = () => {
    if (step === 'qr' && currentPayment?.status !== 'COMPLETED') {
      setShowCancelConfirm(true);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    cancelPayment(); // This will clear payment and stop polling
    setIsOpen(false);
    setShowCancelConfirm(false);
    setTimeout(() => {
      setStep('input');
      setAmount('');
    }, 300);
  };

  const trigger = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        onClick: () => setIsOpen(true),
      })
    : children;

  return (
    <>
      {trigger}
      <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleCloseRequest()}>
        <AlertDialogContent className="w-[900px] max-w-[95vw] rounded-[32px] border-white/10 bg-background/80 backdrop-blur-3xl p-0 overflow-hidden shadow-2xl">
          <div className="relative p-8 space-y-8">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <AlertDialogTitle className="text-2xl font-black tracking-tight">
                    Nạp tiền vào ví
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm font-medium text-muted-foreground">
                    Sử dụng VietQR để nạp tiền nhanh chóng
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>

            <AnimatePresence mode="wait">
              {step === 'input' ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 italic flex justify-between">
                      <span>Số tiền muốn nạp (VND)</span>
                      <span className="text-amber-500/80">Tối thiểu: 10.000đ</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground group-focus-within:text-primary transition-colors italic">
                        đ
                      </div>
                      <Input
                        type="number"
                        placeholder="Ví dụ: 50000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-20 pl-12 pr-28 rounded-2xl bg-white/5 border-white/10 text-3xl font-black tracking-tighter tabular-nums focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all placeholder:text-muted-foreground/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-background/50 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
                        <button
                          onClick={() => setAmount(prev => Math.max(0, (Number(prev) || 0) - 10000).toString())}
                          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                        </button>
                        <div className="w-px h-6 bg-white/10" />
                        <button
                          onClick={() => setAmount(prev => ((Number(prev) || 0) + 10000).toString())}
                          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-primary"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary/60 italic">
                         Tương đương: 
                        <span className="text-foreground text-sm font-black tabular-nums transition-all border-b border-primary/20">
                          {((Number(amount) || 0) / 1000).toLocaleString()}
                        </span>
                        <span className="text-foreground">USDT</span>
                      </div>
                      <div className="text-[9px] font-bold text-muted-foreground/40 italic">
                        Tỷ giá: 1,000đ = 1 USDT
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {[50000, 100000, 200000, 500000].map((val) => {
                        const isActive = amount === val.toString();
                        return (
                          <button
                            key={val}
                            onClick={() => setAmount(val.toString())}
                            className={cn(
                              "relative group/btn overflow-hidden px-2 py-3 rounded-[16px] border transition-all duration-300 text-left",
                              isActive 
                                ? "bg-primary/20 border-primary/40 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]" 
                                : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.08]"
                            )}
                          >
                            <div className={cn(
                              "text-[9px] font-black uppercase tracking-[0.1em] mb-0.5 transition-colors truncate",
                              isActive ? "text-primary" : "text-muted-foreground/60"
                            )}>
                              Nạp nhanh
                            </div>
                            <div className="flex items-baseline gap-0.5 overflow-hidden">
                              <span className={cn(
                                "text-base font-black tracking-tighter tabular-nums truncate",
                                isActive ? "text-foreground" : "text-foreground/80"
                              )}>
                                {val.toLocaleString()}
                              </span>
                              <span className="text-[8px] font-bold opacity-30 uppercase shrink-0">VND</span>
                            </div>
                            
                            {/* Decorative line */}
                            <div className={cn(
                              "absolute bottom-0 left-0 right-0 h-1 bg-primary transition-all duration-500",
                              isActive 
                                ? "opacity-100" 
                                : "opacity-0 group-hover/btn:opacity-50"
                            )} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-amber-500/5 border border-amber-500/10 p-4 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-amber-500/80 uppercase tracking-wider">
                        Phương thức nạp
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                        Chuyển khoản ngân hàng qua mã <span className="text-foreground font-black">VietQR</span>. Xử lý tự động trong 1-5 phút.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-2 gap-8 items-center py-2"
                >
                  <div className="relative group justify-self-center">
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-violet-500/20 blur-xl opacity-50 group-hover:opacity-100 transition duration-700" />
                    <div className="relative bg-white p-3 rounded-[24px] shadow-2xl">
                    {currentPayment?.status === 'COMPLETED' ? (
                        <div className="w-48 h-48 flex flex-col items-center justify-center bg-emerald-50 text-emerald-500 rounded-xl gap-3">
                          <CheckCircle2 className="w-16 h-16" />
                          <p className="font-black uppercase tracking-widest text-[9px]">Thành công</p>
                        </div>
                      ) : currentPayment?.qrCode ? (
                        <img
                          src={currentPayment.qrCode}
                          alt="VietQR"
                          className="w-48 h-48 rounded-xl"
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center bg-muted/20 animate-pulse rounded-xl">
                          <QrCode className="w-10 h-10 text-muted-foreground/20" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                        {currentPayment?.status === 'COMPLETED' ? 'Giao dịch hoàn tất' : 'Đang chờ thanh toán'}
                      </p>
                      <p className="text-4xl font-black tracking-tighter text-foreground tabular-nums">
                        {Number(amount).toLocaleString()}đ
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground leading-relaxed italic">
                        {currentPayment?.status === 'COMPLETED' 
                          ? 'Số tiền đã được cộng vào tài khoản của bạn.' 
                          : 'Quét mã QR để hoàn tất nạp tiền.'}
                      </p>
                    </div>

                    <div className="w-full">
                      {currentPayment?.status === 'COMPLETED' ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                            Xác nhận thành công
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                          <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                          <p className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest">
                            Đang kiểm tra...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/5"
                onClick={handleCloseRequest}
              >
                Hủy bỏ
              </Button>
              {step === 'input' ? (
                <Button
                  className="flex-[2] h-14 rounded-2xl bg-primary shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs gap-2 group"
                  disabled={isLoading || !amount || Number(amount) < 10000}
                  onClick={handleCreatePayment}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Tiếp tục
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  className="flex-[2] h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 font-black uppercase tracking-widest text-xs gap-2"
                  onClick={handleManualCheck}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {currentPayment?.status === 'COMPLETED' ? 'Đóng' : 'Tôi đã nạp tiền'}
                </Button>
              )}
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancellation Confirmation */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent className="rounded-[24px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy thanh toán?</AlertDialogTitle>
            <AlertDialogDescription>
              Mã QR đã được tạo. Bạn có chắc chắn muốn hủy bỏ giao dịch nạp tiền này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">Không, tiếp tục nạp</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClose}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Của tôi, hủy bỏ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
