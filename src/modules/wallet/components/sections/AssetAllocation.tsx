'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAsset, WalletPnL } from '../../types';
import { fmt } from '../../utils';

interface AssetAllocationProps {
  availableBalance: number;
  lockedBalance: number;
  xautValue: number;
  xautAsset: UserAsset | undefined;
  usdtPct: number;
  xautPct: number;
  lockPct: number;
  pnl: WalletPnL | null;
}

export const AssetAllocation: React.FC<AssetAllocationProps> = ({
  availableBalance,
  lockedBalance,
  xautValue,
  xautAsset,
  usdtPct,
  xautPct,
  lockPct,
  pnl,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-3xl bg-card border border-border/40 p-10 shadow-xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Layers size={120} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
              <Layers size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-[0.2em] text-foreground italic">
                Phân bổ danh mục
              </h3>
              <p className="text-xs text-muted-foreground font-medium">Cấu trúc vốn hóa theo thị trường</p>
            </div>
          </div>
          {pnl?.timestamp && (
            <div className="text-right">
              <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.1em]">
                Cập nhật lần cuối
              </p>
              <p className="text-xs font-bold text-muted-foreground/60 font-mono">
                {new Date(pnl.timestamp).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>
            </div>
          )}
        </div>

        {/* stacked segment bar */}
        <div className="relative h-5 rounded-2xl bg-muted/30 overflow-hidden mb-10 flex border border-white/5 shadow-inner p-1">
          <motion.div
            className="h-full bg-primary rounded-xl"
            initial={{ width: 0 }}
            animate={{ width: `${usdtPct}%` }}
            transition={{ duration: 1.5, ease: 'circOut', delay: 0.3 }}
          />
          <motion.div
            className="h-full bg-amber-400 mx-0.5 rounded-sm"
            initial={{ width: 0 }}
            animate={{ width: `${xautPct}%` }}
            transition={{ duration: 1.5, ease: 'circOut', delay: 0.5 }}
          />
          {lockPct > 0 && (
            <motion.div
              className="h-full bg-rose-400 rounded-xl"
              initial={{ width: 0 }}
              animate={{ width: `${lockPct}%` }}
              transition={{ duration: 1.5, ease: 'circOut', delay: 0.7 }}
            />
          )}
        </div>

        {/* legend tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LegendTile
            color="bg-primary"
            label="Tài khoản USDT"
            value={`$${fmt(availableBalance)}`}
            sub="Tín dụng khả dụng"
            pct={usdtPct}
          />
          <LegendTile
            color="bg-amber-400"
            label="Số dư XAUT"
            value={`${xautAsset?.quantity ? xautAsset.quantity.toFixed(4) : '0.0000'} XAUT`}
            sub={`≈ $${fmt(xautValue)}`}
            pct={xautPct}
          />
          <LegendTile
            color="bg-rose-400"
            label="Ký quỹ & Lock"
            value={`$${fmt(lockedBalance)}`}
            sub="Đang giao dịch"
            pct={lockPct}
          />
        </div>
      </div>
    </motion.div>
  );
};

function LegendTile({
  color,
  label,
  value,
  sub,
  pct,
}: {
  color: string;
  label: string;
  value: string;
  sub: string;
  pct: number;
}) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-2xl bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('w-2.5 h-2.5 rounded-full shadow-lg', color)} />
          <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">
            {label}
          </span>
        </div>
        <span className="text-[10px] font-black text-primary italic opacity-0 group-hover:opacity-60 transition-opacity">
          {pct.toFixed(1)}%
        </span>
      </div>
      <div className="space-y-0.5">
        <span className="text-xl font-black tabular-nums text-foreground tracking-tighter">{value}</span>
        <p className="text-[10px] font-bold text-muted-foreground/50 italic">{sub}</p>
      </div>
    </div>
  );
}
