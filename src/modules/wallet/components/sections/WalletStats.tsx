'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Coins, Lock, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAsset } from '../../types';
import { fmt } from '../../utils';

interface WalletStatsProps {
  availableBalance: number;
  lockedBalance: number;
  xautValue: number;
  xautAsset: UserAsset | undefined;
  usdtPct: number;
  xautPct: number;
  lockPct: number;
}

export const WalletStats: React.FC<WalletStatsProps> = ({
  availableBalance,
  lockedBalance,
  xautValue,
  xautAsset,
  usdtPct,
  xautPct,
  lockPct,
}) => {
  return (
    <div className="lg:col-span-5 flex flex-col gap-4">
      {/* USDT Available */}
      <ProminentStatCard
        delay={0.05}
        icon={<Activity size={16} className="text-primary" />}
        label="Khả dụng (USDT)"
        value={`$${fmt(availableBalance)}`}
        sub={`${usdtPct.toFixed(1)}% Portfolio`}
        accent="primary"
        footer={
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">Sẵn sàng giao dịch</span>
          </div>
        }
      />

      {/* XAUT Ownership */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="group flex-1 rounded-3xl bg-card border border-amber-400/30 px-7 py-6 shadow-[0_0_20px_rgba(251,191,36,0.1)] flex flex-col gap-5 hover:border-amber-400/50 transition-all hover:bg-amber-400/[0.02]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Coins size={16} className="text-amber-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-400/80">Số dư Vàng (XAUT)</span>
          </div>
          <span className="text-[11px] font-black text-amber-400/40 font-mono tracking-tighter italic">
            {xautPct.toFixed(1)}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest pl-0.5">Sở hữu</p>
            <p className="text-3xl font-black tabular-nums text-amber-400 tracking-tight">
              {xautAsset?.quantity ? xautAsset.quantity.toFixed(4) : '0.0000'}
              <span className="text-xs ml-1 opacity-60">XAUT</span>
            </p>
          </div>
          <div className="space-y-1 border-l border-border/40 pl-4">
            <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest">Quy đổi</p>
            <p className="text-3xl font-black tabular-nums text-foreground tracking-tight">
              <span className="text-sm mr-0.5 opacity-40">$</span>
              {fmt(xautValue)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border/20">
          <div className="flex items-center justify-between bg-amber-400/[0.03] rounded-2xl px-4 py-3 border border-amber-400/10">
            <div className="flex items-center gap-2">
              <Lock size={12} className="text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">Đang Lock bài bán</span>
            </div>
            <span className="text-base font-black text-amber-400 font-mono tabular-nums">
              {xautAsset?.lockedQuantity ? xautAsset.lockedQuantity.toFixed(4) : '0.0000'}
              <span className="text-[10px] ml-1 opacity-60">XAUT</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Locked USDT */}
      <ProminentStatCard
        delay={0.15}
        icon={<Lock size={16} className="text-rose-400" />}
        label="USDT Lock (Lệnh Buy)"
        value={`$${fmt(lockedBalance)}`}
        sub={`${lockPct.toFixed(1)}% Portfolio`}
        accent="rose"
        footer={
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-rose-400" />
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80 italic">Đang chờ khớp lệnh mua</span>
          </div>
        }
      />
    </div>
  );
};

interface ProminentStatCardProps {
  delay: number;
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: 'primary' | 'amber' | 'rose';
  footer?: React.ReactNode;
}

function ProminentStatCard({ delay, icon, label, value, sub, accent, footer }: ProminentStatCardProps) {
  const styles = {
    primary: {
      border: 'border-primary/30',
      glow: 'shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]',
      bgHover: 'hover:bg-primary/[0.02]',
      iconBg: 'bg-primary/10',
      textColor: 'text-primary'
    },
    amber: {
      border: 'border-amber-400/30',
      glow: 'shadow-[0_0_20px_rgba(251,191,36,0.1)]',
      bgHover: 'hover:bg-amber-400/[0.02]',
      iconBg: 'bg-amber-400/10',
      textColor: 'text-amber-400'
    },
    rose: {
      border: 'border-rose-400/30',
      glow: 'shadow-[0_0_20px_rgba(251,113,133,0.1)]',
      bgHover: 'hover:bg-rose-400/[0.02]',
      iconBg: 'bg-rose-500/10',
      textColor: 'text-rose-400'
    }
  }[accent];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={cn(
        "group flex-1 rounded-3xl bg-card border px-7 py-6 shadow-lg flex flex-col gap-4 transition-all",
        styles.border,
        styles.glow,
        styles.bgHover,
        `hover:${styles.border.replace('30', '50')}`
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform", styles.iconBg)}>
            {icon}
          </div>
          <span className={cn("text-[10px] font-black uppercase tracking-[0.15em]", styles.textColor + "/80")}>
            {label}
          </span>
        </div>
        <span className="text-[11px] font-black text-muted-foreground/40 font-mono tracking-tighter italic">
          {sub}
        </span>
      </div>

      <div className="px-1">
        <span className={cn("text-4xl font-black tabular-nums tracking-tight drop-shadow-sm", accent === 'primary' ? 'text-primary' : accent === 'rose' ? 'text-rose-400' : 'text-foreground')}>
          {value}
        </span>
      </div>

      {footer && (
        <div className="pt-4 border-t border-border/20 mt-1">
          <div className={cn("bg-muted/30 rounded-2xl px-4 py-2.5 border border-border/40")}>
            {footer}
          </div>
        </div>
      )}
    </motion.div>
  );
}
