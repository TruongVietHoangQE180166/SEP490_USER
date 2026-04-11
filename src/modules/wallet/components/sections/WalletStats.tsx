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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* ── Card 1: USDT khả dụng ── */}
      <StatCard
        delay={0.05}
        accent="primary"
        icon={<Activity size={15} />}
        label="USDT Khả dụng"
        pct={usdtPct}
        mainValue={`$${fmt(availableBalance)}`}
        mainUnit="USDT"
        sub={
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            <span>Sẵn sàng giao dịch</span>
          </div>
        }
      />

      {/* ── Card 2: XAUT vàng ── */}
      <StatCard
        delay={0.1}
        accent="amber"
        icon={<Coins size={15} />}
        label="Số dư Vàng (XAUT)"
        pct={xautPct}
        mainValue={(xautAsset?.quantity ?? 0).toFixed(4)}
        mainUnit="XAUT"
        secondaryLabel="Quy đổi"
        secondaryValue={`$${fmt(xautValue)}`}
        sub={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <Lock size={11} className="opacity-60" />
              <span>Lock bán</span>
            </div>
            <span className="font-black tabular-nums">
              {(xautAsset?.lockedQuantity ?? 0).toFixed(4)}
              <span className="text-[9px] ml-1 opacity-50">XAUT</span>
            </span>
          </div>
        }
      />

      {/* ── Card 3: USDT bị khóa ── */}
      <StatCard
        delay={0.15}
        accent="rose"
        icon={<Lock size={15} />}
        label="USDT Đang khóa"
        pct={lockPct}
        mainValue={`$${fmt(lockedBalance)}`}
        mainUnit="USDT"
        sub={
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="opacity-60" />
            <span>Đang chờ khớp lệnh mua</span>
          </div>
        }
      />

    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Unified StatCard component — tất cả 3 card dùng chung
// ─────────────────────────────────────────────────────────────
interface StatCardProps {
  delay: number;
  accent: 'primary' | 'amber' | 'rose';
  icon: React.ReactNode;
  label: string;
  pct: number;
  mainValue: string;
  mainUnit: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  sub: React.ReactNode;
}

const accentMap = {
  primary: {
    border:    'border-primary/25 hover:border-primary/50',
    glow:      'shadow-[0_0_24px_rgba(var(--primary-rgb),0.08)]',
    iconBg:    'bg-primary/10',
    iconText:  'text-primary',
    labelText: 'text-primary/70',
    valueText: 'text-primary',
    pctText:   'text-primary/40',
    subBg:     'bg-primary/[0.04] border-primary/10',
    subText:   'text-primary/60',
  },
  amber: {
    border:    'border-amber-400/25 hover:border-amber-400/50',
    glow:      'shadow-[0_0_24px_rgba(251,191,36,0.08)]',
    iconBg:    'bg-amber-400/10',
    iconText:  'text-amber-400',
    labelText: 'text-amber-400/70',
    valueText: 'text-amber-400',
    pctText:   'text-amber-400/40',
    subBg:     'bg-amber-400/[0.04] border-amber-400/10',
    subText:   'text-amber-400/60',
  },
  rose: {
    border:    'border-rose-400/25 hover:border-rose-400/50',
    glow:      'shadow-[0_0_24px_rgba(251,113,133,0.08)]',
    iconBg:    'bg-rose-400/10',
    iconText:  'text-rose-400',
    labelText: 'text-rose-400/70',
    valueText: 'text-rose-400',
    pctText:   'text-rose-400/40',
    subBg:     'bg-rose-400/[0.04] border-rose-400/10',
    subText:   'text-rose-400/60',
  },
};

function StatCard({
  delay, accent, icon, label, pct,
  mainValue, mainUnit, secondaryLabel, secondaryValue, sub,
}: StatCardProps) {
  const s = accentMap[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: 'circOut', duration: 0.5 }}
      className={cn(
        'group relative rounded-2xl bg-card border px-5 py-5 flex flex-col gap-0 transition-all duration-300',
        s.border, s.glow,
      )}
    >
      {/* ── Header: icon + label + % ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110',
            s.iconBg, s.iconText,
          )}>
            {icon}
          </div>
          <span className={cn('text-[10px] font-black uppercase tracking-[0.18em] leading-tight', s.labelText)}>
            {label}
          </span>
        </div>
        <span className={cn('text-[10px] font-black tabular-nums font-mono italic', s.pctText)}>
          {pct.toFixed(1)}%
        </span>
      </div>

      {/* ── Main value ── */}
      <div className="mb-1">
        <span className={cn('text-3xl font-black tabular-nums tracking-tight leading-none', s.valueText)}>
          {mainValue}
        </span>
        <span className="text-[10px] font-bold text-muted-foreground/40 ml-1.5 align-middle uppercase tracking-wider">
          {mainUnit}
        </span>
      </div>

      {/* ── Secondary value (chỉ XAUT card) ── */}
      {secondaryLabel && secondaryValue && (
        <div className="mb-3">
          <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest mr-1">
            {secondaryLabel}:
          </span>
          <span className="text-sm font-black tabular-nums text-foreground/70">
            {secondaryValue}
          </span>
        </div>
      )}

      {/* Spacer đẩy footer xuống đáy */}
      <div className="flex-1" />

      {/* ── Footer ── */}
      <div className={cn(
        'mt-4 flex items-center rounded-xl px-3 py-2 border text-[10px] font-bold uppercase tracking-wider',
        s.subBg, s.subText,
      )}>
        {sub}
      </div>
    </motion.div>
  );
}
