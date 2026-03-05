'use client';

import { tradingState$, tradingActions } from '../store';
import { Timeframe } from '../types';
import { cn } from '@/lib/utils';
import { observer } from '@legendapp/state/react';

// Chỉ dùng XAUT
const SYMBOL = 'XAU-USDT-SWAP';
const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: '1 giây', value: '1s' },
  { label: '1 phút', value: '1m' },
  { label: '1 tiếng', value: '1h' },
  { label: '1 ngày', value: '1d' },
  { label: '1 tháng', value: '1month' },
];

interface MarketHeaderProps {
  onTimeframeChange?: (tf: Timeframe) => void;
}

export const MarketHeader = observer(function MarketHeader({ onTimeframeChange }: MarketHeaderProps) {
  const tf = tradingState$.timeframe.get();
  const currentPrice = tradingState$.currentPrice.get();

  const handleTfChange = (newTf: Timeframe) => {
    tradingActions.setTimeframe(newTf);
    onTimeframeChange?.(newTf);
  };

  // Lấy close trước đó để tính % change
  const chartData = tradingState$.chartData.get();
  const prevPrice = chartData.length >= 2
    ? chartData[chartData.length - 2].close
    : currentPrice;
  const priceChange = currentPrice - prevPrice;
  const priceChangePct = prevPrice > 0 ? (priceChange / prevPrice) * 100 : 0;
  const isUp = priceChange >= 0;

  return (
    <div className="flex flex-wrap items-center gap-6 px-5 py-4 bg-card/80 backdrop-blur-xl">
      {/* Symbol + giá */}
      <div className="flex items-center gap-4">
        {/* Logo/Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 text-primary animate-pulse-slow">
           <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-12h4v8h-4z"/>
           </svg>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground text-sm tracking-widest uppercase">{SYMBOL}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30 font-bold uppercase tracking-tighter">
              Gold
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider opacity-70">Tokenized Gold Asset</span>
        </div>
      </div>

      {/* Giá hiện tại - font mono đặc thù crypto */}
      <div className="flex flex-col min-w-[140px]">
        <span className="text-2xl font-mono font-bold text-foreground tracking-tighter leading-none mb-1">
          ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <div className={cn('flex items-center gap-1.5 text-xs font-mono font-bold', isUp ? 'text-emerald-500' : 'text-rose-500')}>
          <span className="text-[10px]">{isUp ? '▲' : '▼'}</span>
          <span>{Math.abs(priceChange).toFixed(2)}</span>
          <span className="opacity-80">({isUp ? '+' : ''}{priceChangePct.toFixed(3)}%)</span>
        </div>
      </div>

      <div className="flex items-center gap-8 ml-4">
          <div className="h-10 w-px bg-border/50" />
          
          {/* Timeframe selector - dạng tab bar hiện đại */}
          <div className="flex items-center bg-muted/30 p-1 rounded-xl border border-border/40">
            {TIMEFRAMES.map(t => (
              <button
                key={t.value}
                onClick={() => handleTfChange(t.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 uppercase tracking-tight',
                  tf === t.value
                    ? 'bg-background text-primary shadow-sm border border-border/50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
      </div>

    </div>
  );
});
