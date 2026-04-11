'use client';

import React from 'react';
import { Payment } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, CreditCard, MoreHorizontal, Calendar, BookOpen, ExternalLink, DollarSign } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThunderLoader } from '@/components/thunder-loader';

interface PaymentTableProps {
  payments: Payment[];
  isLoading: boolean;
  onView: (payment: Payment) => void;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({ payments, isLoading, onView }) => {
  if (isLoading) {
    return (
      <div className="w-full h-80 flex flex-col items-center justify-center gap-4 bg-background/30 backdrop-blur-sm rounded-2xl border border-border/40">
        <ThunderLoader size="xl" variant="default" animate="thunder" showGlow showFill />
        <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.3em] animate-pulse">
          Đang tải dữ liệu giao dịch...
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-background/50 backdrop-blur-xl shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40 bg-muted/30">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Khóa học</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground text-right">Số tiền</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Thời gian</th>
              <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-muted-foreground">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment?.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 rounded-lg border-2 border-background shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                        {payment?.courseId ? (
                          <>
                            <AvatarImage src={payment?.thumbnailUrl} alt={payment?.courseTitle} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              <BookOpen size={20} />
                            </AvatarFallback>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-500/10 text-indigo-500 font-bold">
                            <CreditCard size={20} />
                          </div>
                        )}
                      </Avatar>
                      <div className="flex flex-col max-w-[300px]">
                        <span className="font-bold text-foreground text-sm line-clamp-1">
                          {payment?.courseId ? payment?.courseTitle : 'Nạp tiền Trading'}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                            {payment?.courseId ? `ID: ${payment?.id?.substring(0, 8)}...` : 'Nạp số dư ví trading'}
                          </span>
                          {!payment?.qrCode && (
                            <Badge variant="outline" className="h-4 px-1 text-[8px] font-black uppercase text-indigo-500 border-indigo-500/20 bg-indigo-500/5">
                              Thanh toán điểm
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-foreground tabular-nums tracking-tighter text-base">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment?.amount || 0)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      className={`rounded-lg font-black text-[10px] uppercase tracking-tighter border-none px-2.5 py-1 ${
                        payment?.status === 'COMPLETED' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : payment?.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      {payment?.status === 'COMPLETED' ? 'Thành công' : payment?.status === 'PENDING' ? 'Chờ thanh toán' : 'Đã hủy'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5 opacity-90">
                         {payment?.createdDate ? new Date(payment.createdDate).toLocaleDateString('vi-VN') : 'N/A'}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground opacity-60">
                         {payment?.createdDate ? new Date(payment.createdDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted rounded-full">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-1 rounded-xl border-border/40 shadow-xl backdrop-blur-xl bg-background/95">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 px-3 py-2">Giao dịch</DropdownMenuLabel>
                        {payment?.qrCode && (
                          <DropdownMenuItem 
                            onClick={() => window.open(payment.qrCode, '_blank')}
                            className="rounded-lg gap-2 cursor-pointer font-bold text-sm h-10 focus:bg-primary/10 focus:text-primary transition-colors text-primary"
                          >
                            <ExternalLink size={14} /> Xem mã QR
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => payment && onView(payment)}
                          className="rounded-lg gap-2 cursor-pointer font-bold text-sm h-10 focus:bg-primary/10 focus:text-primary transition-colors"
                        >
                          <Eye size={14} /> Xem chi tiết
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2 py-8">
                     <div className="p-4 bg-muted/20 rounded-2xl border-2 border-dashed border-border/40">
                        <CreditCard size={32} strokeWidth={1} />
                     </div>
                     <p className="font-bold text-sm mt-2 uppercase tracking-widest opacity-50">Không có dữ liệu thanh toán</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
