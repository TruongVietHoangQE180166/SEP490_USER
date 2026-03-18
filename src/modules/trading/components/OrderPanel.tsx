'use client';

import { useOrderPanel } from '../hooks/useOrderPanel';
import { tradingState$ } from '../store';
import { cn } from '@/lib/utils';

export function OrderPanel() {
  const {
    side, setSide,
    kind, setKind,
    price, setPrice,
    quantity, setQuantity,
    takeProfit, setTakeProfit,
    stopLoss, setStopLoss,
    placeOrder,
    error,
    success,
  } = useOrderPanel();

  const currentPrice = tradingState$.currentPrice.get();
  const balance = tradingState$.balance.get();
  const limitPrice = parseFloat(price) || 0;
  const qty = parseFloat(quantity) || 0;
  const estCost = qty * (kind === 'LIMIT' ? limitPrice : currentPrice);

  return (
    <div className="flex flex-col gap-3 p-4 bg-card h-full overflow-y-auto">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Đặt Lệnh</h3>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-muted-foreground">Số dư</span>
          <span className="text-sm font-mono font-bold text-primary">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* ── Mua / Bán — segmented control ────────────────────────────── */}
      <div className="flex w-full border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setSide('LONG')}
          className={cn(
            'flex-1 py-2 text-xs font-bold transition-colors border-r border-border',
            side === 'LONG'
              ? 'bg-emerald-500 text-white'
              : 'bg-card text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
          )}
        >
          Mua / Long
        </button>
        <button
          onClick={() => setSide('SHORT')}
          className={cn(
            'flex-1 py-2 text-xs font-bold transition-colors',
            side === 'SHORT'
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-card text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
          )}
        >
          Bán / Short
        </button>
      </div>

      {/* ── Thị trường / Giới hạn — segmented control ─────────────────── */}
      <div className="flex w-full border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setKind('MARKET')}
          className={cn(
            'flex-1 py-1.5 text-xs font-semibold transition-colors border-r border-border',
            kind === 'MARKET'
              ? 'bg-foreground text-background'
              : 'bg-card text-muted-foreground hover:text-foreground hover:bg-accent'
          )}
        >
          Thị trường
        </button>
        <button
          onClick={() => setKind('LIMIT')}
          className={cn(
            'flex-1 py-1.5 text-xs font-semibold transition-colors',
            kind === 'LIMIT'
              ? 'bg-foreground text-background'
              : 'bg-card text-muted-foreground hover:text-foreground hover:bg-accent'
          )}
        >
          Giới hạn
        </button>
      </div>

      {/* ── Giá hiện tại ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/60 rounded-lg border border-border/60">
        <span className="text-xs text-muted-foreground">Giá XAUT/USDT</span>
        <span className="ml-auto text-sm font-mono font-bold text-foreground">
          ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* ── Giá Limit (chỉ hiện khi chọn Giới hạn) ──────────────────── */}
      {kind === 'LIMIT' && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">Giá Limit (USD)</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Nhập giá..."
            className="w-full bg-background border border-input text-foreground rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
      )}

      {/* ── Số lượng ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground font-medium">Số lượng (XAUT oz)</label>
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          placeholder="0.01"
          step="0.001"
          min="0.001"
          className="w-full bg-background border border-input text-foreground rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      {/* ── TP / SL — segmented input row ─────────────────────────────── */}
      <div className="flex w-full border border-border rounded-lg overflow-hidden">
        <div className="flex-1 flex flex-col border-r border-border">
          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 px-2.5 pt-1.5">
            Chốt Lời (TP)
          </span>
          <input
            type="number"
            value={takeProfit}
            onChange={e => setTakeProfit(e.target.value)}
            placeholder="Tùy chọn"
            className="w-full bg-transparent px-2.5 pb-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 px-2.5 pt-1.5">
            Cắt Lỗ (SL)
          </span>
          <input
            type="number"
            value={stopLoss}
            onChange={e => setStopLoss(e.target.value)}
            placeholder="Tùy chọn"
            className="w-full bg-transparent px-2.5 pb-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
        </div>
      </div>

      {/* ── Ước tính chi phí ─────────────────────────────────────────── */}
      {!isNaN(estCost) && estCost > 0 && (
        <div className="flex items-center justify-between px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg text-xs">
          <span className="text-muted-foreground">Ước tính chi phí</span>
          <span className="font-mono font-semibold text-foreground">
            ${estCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      )}

      {/* ── Nút đặt lệnh ─────────────────────────────────────────────── */}
      <button
        onClick={placeOrder}
        className={cn(
          'w-full rounded-lg py-3 text-sm font-bold tracking-wide transition-all duration-200',
          side === 'LONG'
            ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
            : 'bg-destructive hover:opacity-90 text-destructive-foreground'
        )}
      >
        {kind === 'MARKET' ? 'Thị trường' : 'Giới hạn'} —{' '}
        {side === 'LONG' ? 'Mua XAUT ↑' : 'Bán XAUT ↓'}
      </button>

      {/* ── Thông báo ────────────────────────────────────────────────── */}
      {error && (
        <div className="px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-lg text-xs text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-600 dark:text-emerald-400">
          {success}
        </div>
      )}
    </div>
  );
}
