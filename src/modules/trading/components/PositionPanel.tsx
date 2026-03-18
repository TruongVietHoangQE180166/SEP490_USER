'use client';

import { usePositions } from '../hooks/usePositions';
import { cn } from '@/lib/utils';
import { X, TrendingUp, TrendingDown, Inbox } from 'lucide-react';

export function PositionPanel() {
  const { positionsWithPnL, totalPnL, currentPrice, handleClose } = usePositions();

  if (positionsWithPnL.length === 0) {
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
        {positionsWithPnL.map(pos => (
          <div
            key={pos.id}
            className={cn(
              'rounded-xl border p-3 flex flex-col gap-2 transition-all',
              pos.side === 'LONG'
                ? 'border-emerald-500/25 bg-emerald-500/5'
                : 'border-destructive/25 bg-destructive/5'
            )}
          >
            {/* Header hàng */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {pos.side === 'LONG'
                  ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  : <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                }
                <span className={cn(
                  'text-xs font-bold',
                  pos.side === 'LONG' ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                )}>
                  {pos.side === 'LONG' ? 'MUA' : 'BÁN'}
                </span>
                <span className="text-xs text-muted-foreground font-mono">XAUT/USDT</span>
              </div>
              <button
                onClick={() => handleClose(pos)}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/30 rounded-md px-1.5 py-0.5 transition-all"
              >
                <X className="w-2.5 h-2.5" />
                Đóng
              </button>
            </div>

            {/* Dữ liệu */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Giá vào</span>
                <span className="font-mono text-foreground">${pos.entryPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Giá hiện tại</span>
                <span className="font-mono font-semibold text-foreground">
                  ${currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Khối lượng</span>
                <span className="font-mono text-foreground">{pos.quantity} oz</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Giá trị</span>
                <span className="font-mono text-foreground">${pos.totalValue.toLocaleString()}</span>
              </div>
              {pos.takeProfit && (
                <div className="flex justify-between gap-2">
                  <span className="text-amber-600 dark:text-amber-400">Chốt lời</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">${pos.takeProfit.toLocaleString()}</span>
                </div>
              )}
              {pos.stopLoss && (
                <div className="flex justify-between gap-2">
                  <span className="text-purple-600 dark:text-purple-400">Cắt lỗ</span>
                  <span className="font-mono text-purple-600 dark:text-purple-400">${pos.stopLoss.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* PnL bar */}
            <div className={cn(
              'flex items-center justify-between rounded-lg px-2.5 py-1.5',
              pos.unrealizedPnL >= 0 ? 'bg-emerald-500/10' : 'bg-destructive/10'
            )}>
              <span className="text-[10px] text-muted-foreground">Lãi/Lỗ chưa thực hiện</span>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-xs font-mono font-bold',
                  pos.unrealizedPnL >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-destructive'
                )}>
                  {pos.unrealizedPnL >= 0 ? '+' : ''}{pos.unrealizedPnL.toFixed(2)}
                </span>
                <span className={cn(
                  'text-[10px] font-mono',
                  pos.unrealizedPnLPercent >= 0
                    ? 'text-emerald-500/80'
                    : 'text-destructive/80'
                )}>
                  ({pos.unrealizedPnLPercent >= 0 ? '+' : ''}{pos.unrealizedPnLPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
