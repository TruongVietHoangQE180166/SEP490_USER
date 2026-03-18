'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WalletInfo, WalletPnL } from '../../types';
import { fmt } from '../../utils';

interface WalletHeroProps {
  walletInfo: WalletInfo | null;
  pnl: WalletPnL | null;
  totalDisplayBalance: number;
  isPnlConnected: boolean;
  usdtPct: number;
  xautPct: number;
  lockPct: number;
}

export const WalletHero: React.FC<WalletHeroProps> = ({
  walletInfo,
  pnl,
  totalDisplayBalance,
  isPnlConnected,
  usdtPct,
  xautPct,
  lockPct,
}) => {
  const positive = (pnl?.dailyChange ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-7 relative group"
    >
      {/* ambient glow */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/30 via-indigo-500/10 to-violet-500/20 blur-2xl opacity-40 group-hover:opacity-60 transition duration-700" />

      <div className="relative h-full rounded-3xl bg-card/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl p-10 flex flex-col gap-8">
        {/* top row */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/80">
                Danh mục đầu tư
              </span>
            </div>
            <p className="text-sm font-bold text-foreground/80">
              {walletInfo?.username ?? 'Người dùng'}
            </p>
          </div>

          {/* live badge */}
          <motion.span
            animate={{ opacity: isPnlConnected ? 1 : 0.5 }}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500',
              isPnlConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'bg-muted/50 text-muted-foreground border-border/40'
            )}
          >
            {isPnlConnected ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live
                Market
              </>
            ) : (
              <>
                <WifiOff size={10} /> Offline
              </>
            )}
          </motion.span>
        </div>

        {/* big number */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold bg-gradient-to-b from-foreground/40 to-foreground/20 bg-clip-text text-transparent italic">
              $
            </span>
            <motion.span
              key={totalDisplayBalance}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-8xl font-black tracking-tighter text-foreground tabular-nums drop-shadow-sm"
            >
              {fmt(totalDisplayBalance)}
            </motion.span>
          </div>
          <p className="text-xs text-muted-foreground/50 ml-1 font-bold uppercase tracking-widest italic opacity-60">
            Thanh khoản USDT
          </p>
        </div>

        {/* PnL badge */}
        <div className="flex items-center gap-6">
          <motion.div
            key={pnl?.dailyChange}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              'inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-sm font-black transition-colors duration-500',
              positive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            )}
          >
            <div className={cn('p-1 rounded-lg', positive ? 'bg-emerald-400/20' : 'bg-rose-400/20')}>
              {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            </div>
            <span>
              {positive ? '+' : ''}
              {fmt(pnl?.dailyChange ?? 0)} USDT
            </span>
            <div className="w-px h-4 bg-current opacity-20 mx-1" />
            <span className="opacity-80 font-bold">
              {positive ? '+' : ''}
              {(pnl?.dailyChangePercent ?? 0).toFixed(2)}%
            </span>
          </motion.div>

          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
              Biến động (24h)
            </span>
            <span
              className={cn(
                'text-xs font-black italic',
                positive ? 'text-emerald-500/60' : 'text-rose-500/60'
              )}
            >
              Real-time PnL
            </span>
          </div>
        </div>

        {/* asset allocation mini visualizer */}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">
              Phân bổ tài sản
            </span>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-muted-foreground/40">{usdtPct.toFixed(0)}% USDT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] font-bold text-muted-foreground/40">{xautPct.toFixed(0)}% XAUT</span>
              </div>
            </div>
          </div>
          <div className="relative h-2 rounded-full bg-muted/20 overflow-hidden flex p-0.5 border border-white/5 shadow-inner">
            <motion.div
              className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${usdtPct}%` }}
              transition={{ duration: 1.5, ease: 'circOut', delay: 0.5 }}
            />
            <motion.div
              className="h-full bg-amber-400 mx-0.5 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${xautPct}%` }}
              transition={{ duration: 1.5, ease: 'circOut', delay: 0.7 }}
            />
            {lockPct > 0 && (
              <motion.div
                className="h-full bg-rose-400 rounded-full shadow-[0_0_8px_rgba(251,113,133,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${lockPct}%` }}
                transition={{ duration: 1.5, ease: 'circOut', delay: 0.9 }}
              />
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
