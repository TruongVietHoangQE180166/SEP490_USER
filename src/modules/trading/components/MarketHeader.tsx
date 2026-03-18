'use client';

import { tradingState$, tradingActions } from '../store';
import { Timeframe } from '../types';
import { cn } from '@/lib/utils';
import { observer } from '@legendapp/state/react';
import { HelpCircle } from 'lucide-react';

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
    <div className="flex flex-nowrap items-center gap-2 px-6 py-3 bg-card/40 backdrop-blur-md border-b border-border/40 overflow-x-auto no-scrollbar whitespace-nowrap">
      {/* Symbol Area */}
      <div className="flex items-center gap-3 pr-6 border-r border-border/40 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
           <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-12h4v8h-4z"/>
           </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-foreground text-sm tracking-tighter uppercase">{SYMBOL}</span>
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Perpetual</span>
        </div>
      </div>

      {/* Main Price */}
      <div id="tut-market-price" className="flex flex-col px-6 border-r border-border/40 min-w-[120px]">
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

      {/* Stats Grid */}
      <div id="tut-market-stats" className="flex items-center gap-8 px-6 shrink-0">
        <StatItem label="Chỉ số" value={ticker.indexPrice} prefix="$" />
        <StatItem label="Giá đánh dấu" value={ticker.markPrice} prefix="$" />
        <StatItem label="Giá Tether Gold" value={ticker.tetherGoldPrice} prefix="$" />
        <StatItem label="Cao 24h" value={ticker.high24h} prefix="$" />
        <StatItem label="Thấp 24h" value={ticker.low24h} prefix="$" />
        <StatItem label="Khối lượng 24h (XAUT)" value={ticker.vol24h} />
        <StatItem label="Giá trị 24h (USDT)" value={ticker.value24h} prefix="$" />
      </div>

      <div className="ml-auto pl-4 shrink-0">
        <button
          onClick={() => window.dispatchEvent(new Event('start-trading-tutorial'))}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
          title="Xem lại hướng dẫn giao dịch"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">Hướng dẫn</span>
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
