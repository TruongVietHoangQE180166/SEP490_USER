'use client';

import { observer } from '@legendapp/state/react';
import { usePaymentOrder } from '../hooks/usePayment';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  Zap, 
  CheckCircle2, 
  Info,
  Lock,
  Wallet,
  Building2,
  Copy,
  RotateCcw,
  Coins,
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

// ============================================================================
// CUSTOM SCROLLBAR STYLE
// ============================================================================
const CustomScrollbarStyle = () => (
    <style jsx global>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 5px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(var(--primary-rgb, 59, 130, 246), 0.2);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(var(--primary-rgb, 59, 130, 246), 0.4);
      }
    `}</style>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PaymentCheckout = observer(() => {
  const router = useRouter();
  const { 
    paymentInfo, 
    currentOrder, 
    isLoading, 
    isPaymentCompleted,
    error, 
    handleCreateOrder, 
    resetOrder, 
    formatPrice,
    userPoints
  } = usePaymentOrder();
  const [selectedMethod, setSelectedMethod] = useState<'VNPAY' | 'WALLET' | 'BANK' | 'POINT'>('BANK');

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-background pt-8 pb-24">
        <div className="mx-auto max-w-8xl px-6">
          <Skeleton className="mb-12 h-12 w-48 rounded-full" />
          <div className="space-y-12">
            <div className="space-y-6 text-center lg:text-left">
              <Skeleton className="h-8 w-64 rounded-full mx-auto lg:mx-0" />
              <Skeleton className="h-20 w-3/4 rounded-2xl mx-auto lg:mx-0" />
            </div>
            
            <div className="relative overflow-hidden rounded-[40px] border border-border/20 bg-background/40 backdrop-blur-3xl min-h-[700px]">
               <div className="grid lg:grid-cols-12 h-full">
                  <div className="lg:col-span-5 h-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="lg:col-span-7 p-14 space-y-10 flex flex-col items-center justify-center">
                    <Skeleton className="h-64 w-64 rounded-[40px]" />
                    <Skeleton className="h-12 w-64 rounded-full" />
                    <Skeleton className="h-20 w-full rounded-3xl" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !paymentInfo) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-background px-6">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-background/60 backdrop-blur-xl border border-border/40 p-10 rounded-[32px] text-center space-y-8 shadow-2xl"
        >
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20 text-destructive">
              <Info className="h-12 w-12" />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">{error || 'Không tìm thấy thông tin'}</h2>
            <p className="text-foreground/60 font-medium">Vui lòng quay lại danh sách khóa học và thử lại.</p>
          </div>
          <Button 
            onClick={() => router.push('/course')} 
            className="w-full rounded-full h-14 bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Quay lại danh sách khóa học
          </Button>
        </motion.div>
      </main>
    );
  }

  const onConfirmPayment = async () => {
    try {
        await handleCreateOrder(selectedMethod);
    } catch (err) {
        // Error handled in hook
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background pt-8 pb-24">
      <CustomScrollbarStyle />
      {/* Glassmorphism background blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-[160px] animate-pulse" />
        <div className="absolute top-1/2 right-[10%] h-[400px] w-[400px] rounded-full bg-primary/[0.03] blur-[140px]" />
        <div className="absolute bottom-10 left-[15%] h-[500px] w-[500px] rounded-full bg-primary/[0.02] blur-[150px]" />
      </div>

      <div className="relative px-6">
        <div className="mx-auto max-w-8xl">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.back()}
            className="group mb-12 flex items-center gap-2.5 rounded-full border border-primary/20 bg-background/60 px-5 py-2.5 text-sm font-bold text-foreground backdrop-blur-xl transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span>Quay lại trang chi tiết</span>
          </motion.button>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center"
          >
            <div className="w-full max-w-8xl space-y-12">
              <motion.div variants={itemVariants} className="space-y-6 text-center lg:text-left">
                 <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
                    <Lock className="h-3.5 w-3.5" />
                    Thanh toán bảo mật chuẩn quốc tế
                 </div>
                 <h1 className="text-4xl font-black tracking-tight text-foreground md:text-7xl">
                    Hoàn tất <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">Đăng ký học</span>
                 </h1>
              </motion.div>

              {/* Main Unified Checkout Card */}
              <motion.div 
                variants={itemVariants} 
                className="relative overflow-hidden rounded-[40px] border border-border/40 bg-background/40 backdrop-blur-3xl shadow-[0_48px_100px_-20px_rgba(0,0,0,0.15)] shadow-primary/5 group"
              >
                <div className="grid lg:grid-cols-12 min-h-[750px]">
                  {/* Left: Visual Section */}
                  <div className="relative lg:col-span-5 overflow-hidden border-b lg:border-b-0 lg:border-r border-border/20">
                    <img 
                      src={paymentInfo.courseThumbnail} 
                        alt={paymentInfo.courseTitle} 
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-60" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                  </div>

                  {/* Right: Info & Payment Section */}
                  <div className="lg:col-span-7 flex flex-col p-10 lg:p-14 bg-background/20 relative">
                    <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-[100px]" />
                    
                    <AnimatePresence mode="wait">
                      {isPaymentCompleted ? (
                        <motion.div 
                          key="success-view"
                          initial={{ opacity: 0, scale: 0.9, y: 30 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="relative flex flex-col h-full items-center justify-center text-center py-4"
                        >
                          {/* Celebration Icon Container */}
                          <div className="relative mb-8">
                            <motion.div 
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", damping: 10, stiffness: 150, delay: 0.1 }}
                              className="h-28 w-28 rounded-full bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-primary-foreground shadow-[0_20px_50px_-15px_rgba(var(--primary-rgb),0.5)] z-10 relative"
                            >
                              <CheckCircle2 className="h-14 w-14" strokeWidth={3} />
                            </motion.div>
                            
                            {/* Decorative Rings */}
                            {[...Array(3)].map((_, i) => (
                              <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.4 + i*0.2, 1.6 + i*0.2] }}
                                transition={{ repeat: Infinity, duration: 3, delay: i * 0.4 }}
                                className="absolute inset-0 rounded-full border-2 border-primary/30 -z-10"
                              />
                            ))}
                          </div>

                          <div className="space-y-4 mb-10">
                            <motion.h2 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="text-4xl md:text-5xl font-black text-foreground tracking-tight"
                            >
                              Thanh toán <span className="text-primary italic">Thành công!</span>
                            </motion.h2>
                            <motion.p 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="text-base font-medium text-foreground/50 max-w-md mx-auto"
                            >
                              Hệ thống đã xác nhận giao dịch của bạn. <br/>
                              Chào mừng bạn đến với khóa học <span className="text-foreground font-black">&quot;{paymentInfo.courseTitle}&quot;</span>.
                            </motion.p>
                          </div>

                          {/* Order Receipt Card */}
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="w-full max-w-sm rounded-3xl border border-primary/20 bg-primary/[0.03] backdrop-blur-sm overflow-hidden mb-12"
                          >
                            <div className="p-6 space-y-4">
                              <div className="flex justify-between items-center text-sm border-b border-primary/10 pb-4">
                                <span className="font-bold text-foreground/40 uppercase tracking-widest text-[10px]">Mã giao dịch</span>
                                <span className="font-mono font-black text-primary text-xs uppercase">{currentOrder?.id.substring(0, 8) || 'N/A'}</span>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="font-bold text-foreground/40 uppercase tracking-widest text-[10px]">Sản phẩm</span>
                                  <span className="font-black text-foreground/80 text-xs truncate max-w-[180px]">Course Access</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="font-bold text-foreground/40 uppercase tracking-widest text-[10px]">Ngày thanh toán</span>
                                  <span className="font-black text-foreground/80 text-xs">
                                    {new Date().toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <span className="font-bold text-foreground/40 uppercase tracking-widest text-[11px]">Tổng cộng</span>
                                  <span className="text-xl font-black text-primary">
                                    {formatPrice(currentOrder?.amount || 0)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Decorative Cut-outs for receipt look */}
                            <div className="relative h-4 bg-primary/10 flex justify-between items-center px-4 overflow-hidden">
                              {[...Array(12)].map((_, i) => (
                                <div key={i} className="h-2 w-2 rounded-full bg-background mt-[-1px]" />
                              ))}
                            </div>
                          </motion.div>

                          {/* Action Buttons */}
                          <div className="w-full max-w-sm space-y-5">
                            <div className="group relative">
                              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-primary/40 opacity-40 blur-lg group-hover:opacity-70 transition-opacity" />
                              <Button 
                                onClick={() => router.push('/my-course')}
                                className="relative w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-2xl transition-all hover:scale-[1.03] active:scale-[0.97]"
                              >
                                Bắt đầu học ngay
                                <ArrowLeft className="h-5 w-5 rotate-180 ml-2" />
                              </Button>
                            </div>
                            
                            <Button 
                              variant="ghost"
                              onClick={() => router.push('/course')}
                              className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest text-foreground/40 hover:text-primary hover:bg-primary/5 transition-all"
                            >
                              Khám phá thêm khóa học
                            </Button>
                          </div>
                        </motion.div>
                      ) : currentOrder ? (
                        <motion.div 
                          key="qr-view"
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 1.05, y: -20 }}
                          className="relative flex flex-col h-full items-center justify-center text-center space-y-10"
                        >
                          <div className="space-y-4">
                            <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 font-black text-[10px] tracking-widest uppercase px-3 py-1 animate-pulse">
                              ĐANG CHỜ QUÉT MÃ
                            </Badge>
                            <h2 className="text-4xl font-black text-foreground tracking-tight">Thanh toán qua QR</h2>
                            <p className="text-sm font-medium text-foreground/40 max-w-sm mx-auto">
                              Vui lòng sử dụng ứng dụng Ngân hàng hoặc Ví điện tử để quét mã dưới đây và hoàn tất thanh toán.
                            </p>
                          </div>

                          <div className="relative group/qr">
                            <div className="absolute -inset-4 rounded-[48px] bg-gradient-to-r from-primary to-primary/40 opacity-20 blur-2xl transition-opacity group-hover/qr:opacity-40" />
                            <div className="relative p-8 rounded-[40px] bg-white border border-border/40 shadow-2xl">
                              {currentOrder.qrCode ? (
                                <img 
                                  src={currentOrder.qrCode} 
                                  alt="Mã QR Thanh toán" 
                                  className="h-64 w-64 object-contain"
                                />
                              ) : (
                                <div className="h-64 w-64 flex items-center justify-center bg-gray-50 rounded-2xl">
                                  <Skeleton className="h-48 w-48 rounded-xl" />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="w-full max-w-sm space-y-4">
                            <div className="p-6 rounded-[28px] bg-background/40 border border-border/40 flex justify-between items-center group/price cursor-pointer hover:border-primary/40 transition-all">
                              <div className="text-left space-y-1">
                                <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest leading-none">Số tiền cần quét</p>
                                <span className="text-3xl font-black text-primary leading-none tracking-tighter">
                                  {formatPrice(currentOrder.amount)}
                                </span>
                              </div>
                              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover/price:scale-110">
                                <Copy className="h-5 w-5" />
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 justify-center py-3 bg-primary/5 rounded-full border border-primary/10">
                              <RotateCcw className="h-3 w-3 animate-spin text-primary" />
                              <span className="text-[9px] font-black text-primary/70 uppercase tracking-[0.2em]">Hệ thống đang kiểm tra trạng thái thanh toán tự động...</span>
                            </div>

                            <div className="flex items-center gap-3 justify-center py-3 bg-emerald-500/5 rounded-full border border-emerald-500/10">
                              <ShieldCheck className="h-4 w-4 text-emerald-500" />
                              <span className="text-[10px] font-black text-emerald-600/70 uppercase tracking-[0.2em]">Kênh thanh toán đã được bảo mật 256-bit</span>
                            </div>
                          </div>

                          <div className="pt-8 flex flex-col items-center gap-4">
                            <Button 
                              variant="ghost" 
                              onClick={resetOrder}
                              className="rounded-full font-black text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors flex items-center gap-2"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Hủy bỏ &amp; Chọn lại phương thức
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="setup-view"
                          initial={{ opacity: 0, scale: 1.05, y: -20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          className="relative flex flex-col h-full"
                        >
                          {/* Section 1: Course Branding & Title */}
                          <div className="mb-12 space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] tracking-widest uppercase px-3 py-1">KHOÁ HỌC TRỰC TUYẾN</Badge>
                              {paymentInfo.discountPercent > 0 && (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-black text-[10px] tracking-widest uppercase px-3 py-1 animate-pulse">
                                  GIẢM {paymentInfo.discountPercent}%
                                </Badge>
                              )}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-[1.1] tracking-tight">
                              {paymentInfo.courseTitle}
                            </h2>
                            
                            <div className="relative p-6 rounded-2xl bg-primary/[0.02] border border-primary/10 overflow-hidden group/desc">
                              <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                              <p className="text-sm font-medium text-foreground/60 leading-relaxed italic line-clamp-4">
                                &quot;{paymentInfo.courseDescription || 'Khóa học cung cấp kiến thức thực tế và kỹ năng chuyên sâu để bạn đạt được mục tiêu sự nghiệp của mình.'}&quot;
                              </p>
                            </div>
                            <div className="flex items-center gap-6 pt-2">
                               <div className="flex items-center gap-2 text-[11px] font-bold text-foreground/40 uppercase tracking-widest leading-none">
                                  <ShieldCheck className="h-4 w-4 text-primary" />
                                  Bảo mật SSL
                               </div>
                               <div className="flex items-center gap-2 text-[11px] font-bold text-foreground/40 uppercase tracking-widest leading-none">
                                  <Zap className="h-4 w-4 text-primary" />
                                  Kích hoạt ngay
                               </div>
                            </div>
                          </div>

                          {/* Section 2: Pricing & Order Details */}
                          <div className="mb-6 flex flex-col sm:flex-row justify-between items-end gap-6 p-8 rounded-[32px] bg-primary/[0.03] border border-primary/10">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">Tổng thanh toán</p>
                              <div className="text-5xl font-black bg-gradient-to-br from-primary via-primary to-primary/60 bg-clip-text text-transparent tracking-tighter">
                                {formatPrice(paymentInfo.salePrice)}
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              {paymentInfo.discountPercent > 0 && (
                                <>
                                  <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">Giá gốc</p>
                                  <span className="text-xl font-bold text-foreground/20 line-through tracking-wider block">
                                    {formatPrice(paymentInfo.price)}
                                  </span>
                                </>
                              )}
                              <div className="text-[10px] font-mono font-bold text-foreground/30 border border-border/40 px-3 py-1 rounded-full bg-background/40">
                                 ID: #{Math.random().toString(36).substring(7).toUpperCase()}
                              </div>
                            </div>
                          </div>

                          {/* Section 2b: User Points Card */}
                          {userPoints && (
                            <div className="mb-12 p-5 rounded-[28px] bg-gradient-to-r from-amber-500/10 via-orange-500/8 to-yellow-500/10 border border-amber-500/25 relative overflow-hidden">
                              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-amber-400/20 blur-2xl" />
                              <div className="relative flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/20">
                                    <Wallet className="h-5 w-5 text-amber-500" />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-amber-600/70 uppercase tracking-[0.25em]">Điểm thưởng của bạn</p>
                                    <p className="text-2xl font-black text-amber-500 tracking-tight leading-tight">
                                      {userPoints.currentPoints.toLocaleString('vi-VN')}
                                      <span className="text-sm font-bold text-amber-500/60 ml-1">điểm</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-black text-amber-600/60 uppercase tracking-[0.2em] mb-0.5">Tương đương</p>
                                  <p className="text-xl font-black text-amber-500">
                                    {(userPoints.currentPoints * 1000).toLocaleString('vi-VN')}đ
                                  </p>
                                  <p className="text-[9px] font-bold text-amber-500/50 mt-0.5">1 điểm = 1.000đ</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Section 3: Value Cards & Features */}
                          <div className="flex-1 space-y-10">
                             <div className="grid gap-4">
                                {[
                                  { 
                                    title: 'Quyền lợi học viên', 
                                    desc: 'Truy cập trọn đời, chứng chỉ hoàn tất và lộ trình học tập tối ưu.', 
                                    icon: <CheckCircle2 className="h-5 w-5" /> 
                                  },
                                  { 
                                    title: 'Hỗ trợ 24/7', 
                                    desc: 'Đội ngũ chuyên gia luôn sẵn sàng giải đáp mọi thắc mắc của bạn.', 
                                    icon: <Info className="h-5 w-5" /> 
                                  },
                                ].map((item, idx) => (
                                  <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-background/20 border border-border/10 hover:border-primary/20 transition-colors group">
                                     <div className="mt-1 h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        {item.icon}
                                     </div>
                                     <div className="space-y-1">
                                        <p className="text-sm font-black text-foreground">{item.title}</p>
                                        <p className="text-[11px] font-bold text-foreground/40 leading-relaxed">{item.desc}</p>
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>

                          {/* Section 4: Call to Action */}
                          <div className="mt-12 space-y-6">
                             {/* Payment Method Selector */}
                             <div className="space-y-3">
                               <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">Phương thức thanh toán</p>
                               <div className="grid grid-cols-1 gap-2">
                                 {/* BANK */}
                                 <button
                                   onClick={() => setSelectedMethod('BANK')}
                                   className={cn(
                                     'flex items-center gap-4 p-4 rounded-2xl border transition-all text-left',
                                     selectedMethod === 'BANK'
                                       ? 'border-primary/60 bg-primary/5 shadow-lg shadow-primary/10'
                                       : 'border-border/40 bg-background/30 hover:border-primary/30 hover:bg-primary/[0.02]'
                                   )}
                                 >
                                   <div className={cn(
                                     'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                                     selectedMethod === 'BANK' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                                   )}>
                                     <Building2 className="h-5 w-5" />
                                   </div>
                                   <div className="flex-1">
                                     <p className="text-sm font-black text-foreground">Chuyển khoản ngân hàng (QR)</p>
                                     <p className="text-[10px] font-bold text-foreground/40">Quét mã QR qua app ngân hàng</p>
                                   </div>
                                   <div className={cn(
                                     'h-4 w-4 rounded-full border-2 transition-colors',
                                     selectedMethod === 'BANK' ? 'border-primary bg-primary' : 'border-border/60'
                                   )} />
                                 </button>

                                 {/* POINT */}
                                 <button
                                   onClick={() => setSelectedMethod('POINT')}
                                   disabled={!userPoints || userPoints.currentPoints === 0}
                                   className={cn(
                                     'flex items-center gap-4 p-4 rounded-2xl border transition-all text-left relative overflow-hidden',
                                     selectedMethod === 'POINT'
                                       ? 'border-amber-500/60 bg-amber-500/5 shadow-lg shadow-amber-500/10'
                                       : 'border-amber-500/20 bg-amber-500/[0.02] hover:border-amber-500/40',
                                     (!userPoints || userPoints.currentPoints === 0) && 'opacity-50 cursor-not-allowed'
                                   )}
                                 >
                                   {selectedMethod === 'POINT' && (
                                     <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-400/5 pointer-events-none" />
                                   )}
                                   <div className={cn(
                                     'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                                     selectedMethod === 'POINT' ? 'bg-amber-500 text-white' : 'bg-amber-500/10 text-amber-500'
                                   )}>
                                     <Coins className="h-5 w-5" />
                                   </div>
                                   <div className="flex-1">
                                     <div className="flex items-center gap-2">
                                       <p className="text-sm font-black text-foreground">Thanh toán bằng điểm</p>
                                       <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 uppercase tracking-wider">Tức thì</span>
                                     </div>
                                     <p className="text-[10px] font-bold text-foreground/40">
                                       {userPoints
                                         ? `Số dư: ${userPoints.currentPoints.toLocaleString('vi-VN')} điểm ≈ ${(userPoints.currentPoints * 1000).toLocaleString('vi-VN')}đ`
                                         : 'Đang tải số dư điểm...'}
                                     </p>
                                   </div>
                                   <div className={cn(
                                     'h-4 w-4 rounded-full border-2 transition-colors',
                                     selectedMethod === 'POINT' ? 'border-amber-500 bg-amber-500' : 'border-amber-500/30'
                                   )} />
                                 </button>
                               </div>
                             </div>

                             <div className="group relative">
                                <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-r from-primary to-primary/40 opacity-40 blur-xl group-hover:opacity-70 transition-opacity animate-pulse" />
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      disabled={isLoading}
                                      className="relative w-full h-20 rounded-[28px] bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-black text-2xl shadow-3xl border-none overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                      <span className="relative z-10 flex items-center gap-4">
                                        Xác nhận Thanh toán
                                        <ArrowLeft className="h-6 w-6 rotate-180 transition-transform group-hover:translate-x-2" />
                                      </span>
                                      <motion.div
                                        initial={{ x: '-150%' }}
                                        animate={{ x: '350%' }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                      />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="rounded-[32px] border-border/40 bg-background/80 backdrop-blur-2xl p-8 max-w-[500px]">
                                    <AlertDialogHeader className="space-y-4">
                                      <div className={cn(
                                        'flex h-16 w-16 items-center justify-center rounded-2xl mb-2',
                                        selectedMethod === 'POINT' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'
                                      )}>
                                        {selectedMethod === 'POINT' ? <Coins className="h-8 w-8" /> : <CreditCard className="h-8 w-8" />}
                                      </div>
                                      <AlertDialogTitle className="text-3xl font-black text-foreground tracking-tight">
                                        {selectedMethod === 'POINT' ? 'Xác nhận dùng điểm?' : 'Xác nhận thanh toán?'}
                                      </AlertDialogTitle>
                                      <AlertDialogDescription asChild>
                                        <div className="text-base font-bold text-foreground/50 leading-relaxed">
                                          <p>
                                            Bạn đang thực hiện đăng ký khóa học{' '}
                                            <span className="text-primary">&quot;{paymentInfo.courseTitle}&quot;</span>.
                                          </p>
                                          {selectedMethod === 'POINT' ? (
                                            <div className="mt-2">
                                              <p>Điểm thưởng sẽ được trừ ngay lập tức và bạn có thể bắt đầu học ngay sau khi xác nhận.</p>
                                              {userPoints && (
                                                <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                                                  <div className="flex items-center gap-2">
                                                    <Coins className="h-3.5 w-3.5 text-amber-500" />
                                                    <span className="text-xs font-black text-amber-600 uppercase tracking-wider">Chi tiết giao dịch</span>
                                                  </div>
                                                  <div className="space-y-2">
                                                    <div className="flex justify-between text-xs">
                                                      <span className="text-foreground/60">Số điểm hiện có</span>
                                                      <span className="font-black text-amber-500">{userPoints.currentPoints.toLocaleString('vi-VN')} điểm</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                      <span className="text-foreground/60">Chi phí khóa học</span>
                                                      <span className="font-black text-foreground">{formatPrice(paymentInfo.salePrice)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                      <span className="text-foreground/60">Điểm cần dùng</span>
                                                      <span className="font-black text-red-500">−{(paymentInfo.salePrice / 1000).toLocaleString('vi-VN')} điểm</span>
                                                    </div>
                                                    <div className="h-px bg-amber-500/20" />
                                                    <div className="flex justify-between text-xs">
                                                      <span className="text-foreground/60">Còn lại sau giao dịch</span>
                                                      <span className="font-black text-emerald-500">
                                                        {Math.max(0, userPoints.currentPoints - paymentInfo.salePrice / 1000).toLocaleString('vi-VN')} điểm
                                                      </span>
                                                    </div>
                                                  </div>
                                                  <p className="text-[10px] text-amber-500/50">Quy đổi: 1 điểm = 1.000đ</p>
                                                </div>
                                              )}
                                            </div>
                                          ) : (
                                            <div className="mt-2">
                                              <p>Sau khi nhấn xác nhận, thông tin thanh toán sẽ được hiển thị để bạn hoàn tất giao dịch.</p>
                                              {userPoints && (
                                                <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                                                  <div className="flex items-center gap-2 mb-2">
                                                    <Wallet className="h-3.5 w-3.5 text-amber-500" />
                                                    <span className="text-xs font-black text-amber-600 uppercase tracking-wider">Điểm thưởng hiện có</span>
                                                  </div>
                                                  <div className="flex items-baseline justify-between">
                                                    <span className="text-lg font-black text-amber-500">{userPoints.currentPoints.toLocaleString('vi-VN')} điểm</span>
                                                    <span className="text-sm font-bold text-amber-500/70">≈ {(userPoints.currentPoints * 1000).toLocaleString('vi-VN')}đ</span>
                                                  </div>
                                                  <p className="text-[10px] text-amber-500/50 mt-1">Quy đổi: 1 điểm = 1.000đ</p>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="mt-10 gap-4 sm:gap-0">
                                      <AlertDialogCancel className="h-14 rounded-2xl border-border/40 bg-background/40 font-black text-sm px-8 hover:bg-background/80 transition-all">Huỷ bỏ</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={onConfirmPayment}
                                        className={cn(
                                          'h-14 rounded-2xl font-black text-sm px-8 transition-all hover:scale-[1.02] active:scale-[0.98]',
                                          selectedMethod === 'POINT'
                                            ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20'
                                            : 'bg-primary text-primary-foreground shadow-xl shadow-primary/20'
                                        )}
                                      >
                                        {selectedMethod === 'POINT' ? '🪙 Dùng điểm thanh toán' : 'Tiếp tục thanh toán'}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                             </div>

                             <p className="text-[10px] text-center text-foreground/30 font-bold px-6 leading-relaxed">
                                Bằng việc nhấn xác nhận, bạn đồng ý với{' '}
                                <span className="text-primary hover:underline cursor-pointer mx-1">Điều khoản dịch vụ</span>
                                {' '}và <span className="text-primary hover:underline cursor-pointer">Chính sách bảo mật</span> của chúng tôi.
                             </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
});
