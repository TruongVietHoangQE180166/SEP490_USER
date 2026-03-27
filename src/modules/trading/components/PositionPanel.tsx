'use client';

import { observer } from '@legendapp/state/react';
import { tradingState$ } from '../store';
import { cn } from '@/lib/utils';
import { X, TrendingUp, TrendingDown, Inbox } from 'lucide-react';

export const PositionPanel = observer(function PositionPanel() {
  const positions = tradingState$.openPositions.get();
  const currentPrice = tradingState$.currentPrice.get();

  // Tổng PnL từ tất cả vị thế
  const totalPnL = positions.reduce((sum, p) => sum + (p.unrealizedPnl ?? 0), 0);

  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-6 bg-card h-full text-muted-foreground">
        <Inbox className="w-10 h-10 opacity-20" />
        <p className="text-xs text-center">Chưa có vị thế nào đang mở</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-card h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h3 className="text-sm font-bold text-foreground">Vị thế đang mở</h3>
        <div className={cn(
          'text-sm font-mono font-bold px-2 py-0.5 rounded-md',
          totalPnL >= 0
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'bg-destructive/10 text-destructive'
        )}>
          {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)} USD
        </div>
      </div>

      {/* Danh sách vị thế */}
      <div className="flex flex-col gap-2">
        {positions.map((pos, i) => {
          const isLong = pos.side === 'LONG';
          const pnl = pos.unrealizedPnl ?? 0;
          const pnlPct = pos.pnlPercentage ?? 0;
          const isProfit = pnl >= 0;
          const markPx = pos.markPrice || currentPrice;

          return (
            <div
              key={pos.id ?? i}
              className={cn(
                'rounded-xl border p-3 flex flex-col gap-2 transition-all',
                isLong
                  ? 'border-emerald-500/25 bg-emerald-500/5'
                  : 'border-destructive/25 bg-destructive/5'
              )}
            >
              {/* Header hàng: Symbol + Side + nút Đóng */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {isLong
                    ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    : <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                  }
                  <span className={cn(
                    'text-xs font-bold',
                    isLong ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                  )}>
                    {isLong ? 'LONG' : 'SHORT'}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {pos.symbol ?? 'XAUT'}/USDT
                  </span>
                  {/* Leverage badge */}
                  {pos.leverage && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground">
                      x{pos.leverage}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {/* close handled by backend */}}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/30 rounded-md px-1.5 py-0.5 transition-all"
                >
                  <X className="w-2.5 h-2.5" />
                  Đóng
                </button>
              </div>

              {/* Dữ liệu chi tiết (2 cột) */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                {/* Cột trái */}
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Khối lượng</span>
                  <span className="font-mono text-foreground">{pos.quantity} oz</span>
                </div>

                {/* Cột phải */}
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Giá vào</span>
                  <span className="font-mono text-foreground">
                    ${pos.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Ký quỹ</span>
                  <span className="font-mono text-foreground">
                    ${pos.margin?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '—'}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Mark Price</span>
                  <span className="font-mono font-semibold text-foreground">
                    ${markPx.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Đòn bẩy</span>
                  <span className="font-mono text-foreground">x{pos.leverage ?? 1}</span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-orange-500/90">Giá thanh lý</span>
                  <span className="font-mono text-orange-500/90">
                    ${pos.liquidationPrice
                      ? pos.liquidationPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : '—'}
                  </span>
                </div>
              </div>

              {/* PnL bar */}
              <div className={cn(
                'flex items-center justify-between rounded-lg px-2.5 py-1.5',
                isProfit ? 'bg-emerald-500/10' : 'bg-destructive/10'
              )}>
                <span className="text-[10px] text-muted-foreground">Lãi/Lỗ chưa thực hiện</span>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-xs font-mono font-bold',
                    isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                  )}>
                    {isProfit ? '+' : ''}{pnl.toFixed(2)} $
                  </span>
                  <span className={cn(
                    'text-[10px] font-mono',
                    isProfit ? 'text-emerald-500/80' : 'text-destructive/80'
                  )}>
                    ({isProfit ? '+' : ''}{pnlPct.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
