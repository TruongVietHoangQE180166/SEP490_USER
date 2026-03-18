'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WalletTransaction, TransactionType, TransactionStatus } from '../../types';
import { fmt } from '../../utils';

interface TransactionHistoryProps {
  transactions: WalletTransaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const renderValue = (val: any) => {
    if (val === null || val === undefined || val === '') return <span className="text-muted-foreground/40 italic">Chưa có</span>;
    return val;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-3xl bg-card border border-border/40 shadow-2xl overflow-hidden"
    >
      {/* header */}
      <div className="px-10 py-8 border-b border-border/40 bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-black uppercase tracking-tight text-foreground italic flex items-center gap-3">
            <History size={18} className="text-primary" />
            Lịch sử hoạt động
          </h3>
          <p className="text-xs text-muted-foreground font-medium opacity-70">
            Nhật ký giao dịch tài chính cá nhân
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Tìm nội dung giao dịch..."
              className="bg-background border border-border/60 rounded-2xl pl-11 pr-5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 w-[260px] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-background border border-border/60 hover:bg-muted hover:border-primary/40 text-xs font-black transition-all">
            <Filter size={14} /> Lọc
          </button>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        {(transactions?.length ?? 0) > 0 ? (
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-black bg-muted/5">
                <th className="px-10 py-5 border-b border-border/40">Giao dịch</th>
                <th className="px-10 py-5 border-b border-border/40">Nội dung</th>
                <th className="px-10 py-5 border-b border-border/40">Thời gian</th>
                <th className="px-10 py-5 border-b border-border/40 text-right">Giá trị</th>
                <th className="px-10 py-5 border-b border-border/40 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              <AnimatePresence mode="popLayout">
                {transactions?.map((tx, idx) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 + 0.4 }}
                    className="hover:bg-primary/5 transition-colors group cursor-default"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <TxIcon type={tx.type} />
                        <div>
                          <span className="text-xs font-black uppercase tracking-tighter block leading-tight group-hover:text-primary transition-colors">
                            {tx.type}
                          </span>
                          <span className="text-[9px] text-muted-foreground/60 font-mono tracking-widest uppercase">
                            ID:{tx.id.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="max-w-[240px]">
                        <p className="text-sm font-bold text-foreground/90 truncate">{renderValue(tx.description)}</p>
                        {tx.referenceId && (
                          <span className="mt-1.5 inline-block px-2 py-0.5 rounded-lg bg-muted text-[8px] font-black font-mono text-muted-foreground/80 border border-border/40 uppercase tracking-tighter">
                            REF: {renderValue(tx.referenceId)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-foreground/80 tabular-nums">
                          {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString('vi-VN') : '--'}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50 font-mono">
                          {tx.timestamp
                            ? new Date(tx.timestamp).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </p>
                      </div>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap text-right">
                      <span
                        className={cn(
                          'text-base font-black font-mono tracking-tighter',
                          ['DEPOSIT', 'REFUND'].includes(tx.type) ? 'text-emerald-400' : 'text-foreground'
                        )}
                      >
                        {['DEPOSIT', 'REFUND'].includes(tx.type) ? '+' : '−'}${fmt(tx.amount ?? 0)}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <StatusBadge status={tx.status} />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-28 text-muted-foreground/20 italic">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6 shadow-inner">
              <History size={40} strokeWidth={1} />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.3em] opacity-40 italic">
              Hành trình giao dịch bắt đầu tại đây
            </p>
          </div>
        )}
      </div>

      <div className="px-10 py-6 bg-muted/5 border-t border-border/20 text-center">
        <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.25em]">
          Hệ thống chỉ hiển thị các giao dịch phát sinh gần nhất
        </p>
      </div>
    </motion.div>
  );
};

function TxIcon({ type }: { type: TransactionType }) {
  if (type === 'DEPOSIT' || type === 'REFUND') {
    return (
      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0 shadow-inner group-hover:rotate-12 transition-transform">
        <ArrowDownLeft className="text-emerald-400 w-5 h-5" />
      </div>
    );
  }
  if (type === 'WITHDRAW' || type === 'PAYMENT' || type === 'TRANSFER') {
    return (
      <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shrink-0 shadow-inner group-hover:-rotate-12 transition-transform">
        <ArrowUpRight className="text-rose-400 w-5 h-5" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
      <History className="text-blue-400 w-5 h-5" />
    </div>
  );
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Hoàn tất
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-400/20 shadow-sm">
          <Clock size={10} className="animate-spin-slow" /> Đang xử lý
        </span>
      );
    case 'FAILED':
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-400/20 shadow-sm">
          <XCircle size={10} /> Thất bại
        </span>
      );
    default:
      return null;
  }
}
