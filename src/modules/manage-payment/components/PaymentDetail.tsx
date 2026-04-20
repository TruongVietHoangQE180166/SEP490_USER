'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Receipt,
  Download,
  QrCode,
  Wallet,
  DollarSign
} from 'lucide-react';
import { Payment } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface PaymentDetailProps {
  payment: Payment;
  onBack: () => void;
}

export const PaymentDetail: React.FC<PaymentDetailProps> = ({ 
  payment, 
  onBack 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return {
          Icon: CheckCircle2,
          label: 'Giao dịch thành công',
          color: 'bg-emerald-500/10 text-emerald-500',
          desc: 'Số tiền đã được quyết toán và ghi nhận vào hệ thống.'
        };
      case 'CANCELLED':
        return {
          Icon: XCircle,
          label: 'Giao dịch đã hủy',
          color: 'bg-rose-500/10 text-rose-500',
          desc: 'Người dùng đã hủy hoặc giao dịch hết hạn thanh toán.'
        };
      default:
        return {
          Icon: Clock,
          label: 'Đang chờ thanh toán',
          color: 'bg-amber-500/10 text-amber-500',
          desc: 'Hệ thống đang đợi xác nhận từ cổng thanh toán.'
        };
    }
  };

  const { Icon, label, color, desc } = getStatusInfo(payment?.status || 'PENDING');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30"
    >
      {/* Sticky Header */}
      <div className="z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="w-full mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 hover:bg-muted/50 transition-all rounded-xl px-4 h-10 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Quay lại</span>
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Transaction ID</span>
            <code className="text-[10px] font-black bg-muted/50 px-2 py-1 rounded-md border border-border/40 select-all">
              {payment?.id}
            </code>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Transaction Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Payment Summary Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-[2.5rem] bg-card border border-border/40 shadow-2xl shadow-primary/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] -mr-4 -mt-4 transform rotate-12">
                <CreditCard size={180} />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${color.split(' ')[0]}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <Badge className={`${color} border-none font-black text-[10px] uppercase tracking-widest px-3 py-1`}>
                      {label}
                    </Badge>
                    <p className="text-sm font-medium text-muted-foreground mt-1">{desc}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <span className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Tổng thanh toán</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <h2 className="text-6xl font-[1000] tracking-tighter text-foreground">
                      {payment.amount.toLocaleString('vi-VN')}
                    </h2>
                    <span className="text-2xl font-black text-muted-foreground/50">VND</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Course Information Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground ml-2 flex items-center gap-2">
                {payment?.courseId ? (
                  <>
                    <BookOpen size={14} className="text-primary" />
                    Sản phẩm đăng ký
                  </>
                ) : (
                  <>
                    <CreditCard size={14} className="text-indigo-500" />
                    Loại giao dịch
                  </>
                )}
              </h3>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex flex-col md:flex-row gap-6 p-6 bg-card border border-border/40 rounded-3xl hover:border-primary/20 transition-all">
                  <div className="w-full md:w-48 aspect-video rounded-2xl overflow-hidden shadow-lg border border-border/20 flex items-center justify-center bg-muted/30">
                    {payment?.courseId ? (
                      <img 
                        src={payment.thumbnailUrl} 
                        alt={payment.courseTitle} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-indigo-500 animate-pulse">
                        <CreditCard size={48} strokeWidth={1.5} />
                        <span className="text-[10px] font-black uppercase tracking-widest">TRADING WALLET</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-2">
                      <h4 className="text-xl font-black leading-tight tracking-tight group-hover:text-primary transition-colors">
                        {payment?.courseId ? payment.courseTitle : 'Nạp tiền vào ví Trading'}
                      </h4>
                      <p className="text-sm font-medium text-muted-foreground line-clamp-2">
                        {payment?.courseId ? (
                          <>ID Khóa học: <span className="font-mono text-xs">{payment.courseId}</span></>
                        ) : (
                          <>Giao dịch nạp số dư để tham gia giao dịch demo/live trên hệ thống.</>
                        )}
                      </p>
                    </div>
                    {payment?.courseId && (
                      <Button variant="ghost" className="w-fit p-0 h-auto font-bold text-xs gap-1.5 text-primary hover:bg-transparent hover:underline">
                        Xem trang khóa học <ExternalLink size={12} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 flex items-center gap-1.5">
                  <Calendar size={12} /> Thời gian giao dịch
                </span>
                <p className="font-bold text-sm tracking-tight">{formatDate(payment.createdDate)}</p>
              </div>
              <div className="p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Hình thức thanh toán
                </span>
                <p className={cn(
                  "font-bold text-sm tracking-tight",
                  payment?.qrCode ? "text-emerald-600" : "text-indigo-600"
                )}>
                  {payment?.qrCode ? 'VietQR / MB Bank - Chuyển khoản' : 'Thanh toán bằng điểm Trading'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: QR & Meta */}
          <div className="space-y-6">
            {/* Visual Receipt Branding or Point Info */}
            <div className={cn(
              "p-8 rounded-[2rem] shadow-2xl relative overflow-hidden",
              payment?.qrCode 
                ? "bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-primary/20"
                : "bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white shadow-indigo-500/20"
            )}>
              <div className="absolute -bottom-8 -right-8 opacity-20 transform scale-150">
                {payment?.qrCode ? <Receipt size={120} /> : <Wallet size={120} />}
              </div>
              <div className="relative z-10 space-y-6 text-center">
                <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
                  {payment?.qrCode ? <QrCode size={32} strokeWidth={2.5} /> : <DollarSign size={32} strokeWidth={2.5} />}
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight leading-none uppercase">
                    {payment?.qrCode ? 'Hóa đơn điện tử' : 'Ví điểm hệ thống'}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mt-3">VIC Teach Finance</p>
                </div>
                <Separator className="bg-white/20" />
                <div className="space-y-4">
                  {payment?.qrCode ? (
                    <>
                      <div className="aspect-square bg-white p-4 rounded-[2rem] shadow-xl">
                        <img 
                          src={payment.qrCode} 
                          alt="Payment QR" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <Button 
                        variant="secondary" 
                        className="w-full h-12 rounded-xl font-black uppercase tracking-[0.2em] shadow-lg group bg-white hover:bg-white/90 text-primary"
                        onClick={() => window.open(payment.qrCode, '_blank')}
                      >
                        Tải mã QR <Download size={16} className="ml-2 group-hover:translate-y-1 transition-transform" />
                      </Button>
                    </>
                  ) : (
                    <div className="py-8 px-4 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20">
                      <p className="text-xs font-bold leading-relaxed opacity-90">
                        Giao dịch được thực hiện thông qua khấu trừ điểm trực tiếp từ ví Trading của người dùng.
                      </p>
                      <div className="mt-6 p-4 bg-white/10 rounded-2xl flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} />
                        <span className="text-[10px] font-black uppercase">Đã xác thực ví</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Trust Badges / Security */}
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800">Bảo mật giao dịch</span>
              </div>
              <p className="text-xs font-medium text-emerald-700/70 leading-relaxed italic">
                Tất cả các giao dịch được mã hóa và bảo vệ. Mọi dữ liệu tài chính của học viên đều tuân thủ các quy chuẩn bảo mật cao nhất của VIC Teach.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
