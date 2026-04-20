'use client';

import { tradingState$, tradingActions } from '../store';
import { Timeframe } from '../types';
import { cn } from '@/lib/utils';
import { observer } from '@legendapp/state/react';
import { FileText } from 'lucide-react';
import Image from 'next/image';

// Chỉ dùng XAUT
const SYMBOL = 'XAU-USDT-SWAP';
const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: '1 giây', value: '1s' },
  { label: '1 phút', value: '1m' },
  { label: '1 tiếng', value: '1h' },
  { label: '1 ngày', value: '1d' },
  { label: '1 tháng', value: '1month' },
];

export const MarketHeader = observer(function MarketHeader() {
  const currentPrice = tradingState$.currentPrice.get();
  const ticker = tradingState$.marketTicker.get();
  const isUp = ticker.change24hPct >= 0;

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-2 px-3 md:px-6 py-3 md:py-2 bg-card/40 backdrop-blur-md border-b border-border/40 w-full">
      {/* Top Header Group (Mobile: Row, Desktop: Row) */}
      <div className="flex items-center justify-between w-full md:w-auto border-b md:border-b-0 border-border/40 pb-3 md:pb-0 shrink-0">
        <div className="flex items-center">
          {/* Symbol Area */}
          <div className="flex items-center gap-2 md:gap-3 pr-3 md:pr-6 border-r border-border/40 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center p-1 shadow-inner shrink-0 overflow-hidden">
               <Image 
                 src="/tether-gold-xaut-seeklogo.png" 
                 alt="Tether Gold" 
                 width={24} 
                 height={24} 
                 className="object-contain"
               />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-foreground text-sm tracking-tighter uppercase">{SYMBOL}</span>
              <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Perpetual</span>
            </div>
          </div>

          {/* Main Price */}
          <div id="tut-market-price" className="flex flex-col px-3 md:px-6 md:border-r border-border/40 shrink-0">
            <span className={cn(
              "text-lg font-mono font-black italic tracking-tighter leading-none mb-1",
              isUp ? 'text-emerald-400' : 'text-rose-400'
            )}>
              {currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className={cn('flex items-center gap-1 text-[10px] font-bold', isUp ? 'text-emerald-400' : 'text-rose-400')}>
              <span>{isUp ? '+' : ''}{ticker.change24h.toFixed(2)}</span>
              <span className="opacity-60">({isUp ? '+' : ''}{ticker.change24hPct.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Tutorial Button (Mobile Layout) */}
        <div className="md:hidden ml-auto">
          <button
            onClick={() => window.dispatchEvent(new Event('start-trading-tutorial'))}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
            title="Xem lại hướng dẫn giao dịch"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid - 2 per row on mobile, flex row on desktop */}
      <div id="tut-market-stats" className="grid grid-cols-2 gap-y-4 gap-x-4 py-2 md:py-0 md:flex md:items-center md:gap-8 md:px-6 shrink-0 w-full md:w-auto md:overflow-x-auto no-scrollbar whitespace-nowrap md:whitespace-normal">
        <StatItem label="Chỉ số" value={ticker.indexPrice} prefix="$" />
        <StatItem label="Giá đánh dấu" value={ticker.markPrice} prefix="$" />
        <StatItem label="Giá Tether Gold" value={ticker.tetherGoldPrice} prefix="$" />
        <StatItem label="Cao 24h" value={ticker.high24h} prefix="$" />
        <StatItem label="Thấp 24h" value={ticker.low24h} prefix="$" />
        <StatItem label="KL 24h (XAUT)" value={ticker.vol24h} />
        <StatItem label="Giá trị 24h (USDT)" value={ticker.value24h} prefix="$" />
      </div>

      {/* Tutorial Button (Desktop Layout) */}
      <div className="hidden md:flex ml-auto items-center shrink-0 pl-4">
        <button
          onClick={() => window.dispatchEvent(new Event('start-trading-tutorial'))}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
          title="Xem lại hướng dẫn giao dịch"
        >
          <FileText className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});

function StatItem({ label, value, prefix = '' }: { label: string; value: number; prefix?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">{label}</span>
      <span className="text-[11px] font-mono font-bold text-foreground/90 tracking-tight leading-none">
        {prefix}{value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </div>
  );
}
