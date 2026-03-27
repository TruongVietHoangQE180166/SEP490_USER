'use client';

import { useOrderPanel } from '../hooks/useOrderPanel';
import { tradingState$ } from '../store';
import { cn } from '@/lib/utils';
import { observer } from '@legendapp/state/react';
import { Plus, Minus } from 'lucide-react';
import { SingleSlider } from '@/components/ui/slider';

export const OrderPanel = observer(function OrderPanel() {
  const {
    marketType, setMarketType,
    leverage, setLeverage,
    side, setSide,
    kind, setKind,
    price, setPrice,
    quantity, setQuantity,
    takeProfit, setTakeProfit,
    stopLoss, setStopLoss,
    placeOrder,
    isLoading,
  } = useOrderPanel();

  const wallet = tradingState$.wallet.get();
  const currentPrice = tradingState$.currentPrice.get();
  const balance = wallet.availableBalance;
  const gold = wallet.goldBalance;
  const lockedUsdt = wallet.lockedBalance;
  const lockedGold = wallet.lockedGoldBalance;
  const dailyPnl = wallet.dailyPnl;
  const dailyPnlPercent = wallet.dailyPnlPercent;

  const limitPrice = parseFloat(price) || 0;
  const qtyInput = parseFloat(quantity) || 0;
  
  const isUsdtInput = marketType === 'FUTURE' || side === 'LONG';

  // Nếu là Mua (hoặc Future): quantity state đại diện cho số tiền USDT
  // Nếu là Bán Spot: quantity state đại diện cho số lượng XAUT
  const estCost = isUsdtInput 
    ? qtyInput 
    : qtyInput * (kind === 'LIMIT' ? limitPrice : currentPrice);

  const priceForCalc = kind === 'LIMIT' ? (limitPrice || currentPrice) : currentPrice;
  const xautReceivedValue = isUsdtInput ? (qtyInput / priceForCalc) : 0;

  // Tính phần trăm tài sản hiện tại
  const maxAvailable = isUsdtInput ? balance : gold;
  const currentPercent = maxAvailable > 0 ? (qtyInput / maxAvailable) * 100 : 0;

  const handlePercentChange = (percent: number) => {
    const newVal = (maxAvailable * (percent / 100));
    // Format đẹp mắt
    setQuantity(isUsdtInput ? newVal.toFixed(0) : newVal.toFixed(4));
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-card h-max">

      {/* ── Spot / Future Toggle ── */}
      <div className="flex w-full border-2 border-primary/20 rounded-xl overflow-hidden p-1.5 bg-muted/30 gap-1 mb-1">
        <button
          id="tut-mode-spot"
          onClick={() => setMarketType('SPOT')}
          className={cn(
            'flex-1 py-2.5 text-[13px] font-black uppercase tracking-[0.15em] transition-all rounded-lg',
            marketType === 'SPOT'
              ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
              : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
          )}
        >
          Spot
        </button>
        <button
          id="tut-mode-future"
          onClick={() => setMarketType('FUTURE')}
          className={cn(
            'flex-1 py-2.5 text-[13px] font-black uppercase tracking-[0.15em] transition-all rounded-lg',
            marketType === 'FUTURE'
              ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
              : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
          )}
        >
          Future
        </button>
      </div>

      {/* ── Header: Wallet Details ────────────────────────────────── */}
      <div id="tut-order-wallet" className="flex flex-col gap-2 pb-1">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/60">Tài chính</h3>
          <div className="h-px flex-1 mx-3 bg-border/40" />
        </div>
        
        <div className="flex flex-col gap-2">
          {/* Hàng 1: USDT (Thường dùng để Buy) */}
          <div className={cn(
            "flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200",
            side === 'LONG' ? "bg-emerald-500/5 border-emerald-500/20" : "bg-muted/10 border-border/40"
          )}>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Khả dụng USDT</span>
              <span className="text-sm font-mono font-black text-foreground">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            {lockedUsdt > 0 && (
              <div className="text-right">
                <span className="text-[9px] font-medium text-muted-foreground block">
                  Khóa: ${lockedUsdt.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Hàng 2: XAUT (Thường dùng để Sell) */}
          <div className={cn(
            "flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200",
            side === 'SHORT' ? "bg-rose-500/5 border-rose-500/20" : "bg-muted/10 border-border/40"
          )}>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Sở hữu XAUT</span>
              <span className="text-sm font-mono font-black text-foreground">
                {gold.toLocaleString('en-US', { minimumFractionDigits: 4 })} oz
              </span>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] font-bold text-primary/60">
                ≈ ${(gold * currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              {lockedGold > 0 && (
                <span className="text-[9px] font-medium text-muted-foreground">
                  Đang bán: {lockedGold} oz
                </span>
              )}
            </div>
          </div>

          {/* Hàng 3: Daily PnL từ WS */}
          {dailyPnl !== undefined && (
            <div className={cn(
              'flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200',
              dailyPnl >= 0
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-rose-500/5 border-rose-500/20'
            )}>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">PnL hôm nay</span>
                <span className={cn(
                  'text-sm font-mono font-black',
                  dailyPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'
                )}>
                  {dailyPnl >= 0 ? '+' : ''}{dailyPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
                </span>
              </div>
              {dailyPnlPercent !== undefined && (
                <div className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono font-bold',
                  dailyPnlPercent >= 0
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-rose-500/10 text-rose-500'
                )}>
                  {dailyPnlPercent >= 0 ? '+' : ''}{dailyPnlPercent.toFixed(2)}%
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Spacer or Divider if needed */}
      {marketType === 'FUTURE' && (
        <div id="tut-leverage-slider" className="flex flex-col gap-2 p-3 bg-muted/10 border border-border/40 rounded-lg">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-70">
              Đòn bẩy (Leverage)
            </label>
            <span className="text-sm font-mono font-black text-primary">{leverage}x</span>
          </div>
          <div className="px-1 pt-1">
            <SingleSlider 
              min={1} 
              max={100} 
              step={1} 
              value={leverage} 
              onValueChange={(val) => setLeverage(val)} 
            />
          </div>
        </div>
      )}

      {/* ── Mua / Bán ── */}
      <div id="tut-order-side" className="flex w-full border border-border rounded-lg overflow-hidden p-1 bg-muted/20 gap-1">
        <button
          onClick={() => setSide('LONG')}
          className={cn(
            'flex-1 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-md',
            side === 'LONG'
              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
              : 'text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500'
          )}
        >
          {marketType === 'FUTURE' ? 'Mua / Long' : 'Mua'}
        </button>
        <button
          onClick={() => setSide('SHORT')}
          className={cn(
            'flex-1 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-md',
            side === 'SHORT'
              ? 'bg-destructive text-destructive-foreground shadow-sm shadow-destructive/20'
              : 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
          )}
        >
          {marketType === 'FUTURE' ? 'Bán / Short' : 'Bán'}
        </button>
      </div>

      <div id="tut-order-type" className="flex w-full border border-border rounded-lg overflow-hidden bg-muted/20 p-1 gap-1">
        <button
          onClick={() => setKind('MARKET')}
          className={cn(
            'flex-1 py-1.5 text-[11px] font-black uppercase tracking-tight transition-all rounded-md',
            kind === 'MARKET'
              ? 'bg-foreground text-background shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Thị trường
        </button>
        <button
          onClick={() => setKind('LIMIT')}
          className={cn(
            'flex-1 py-1.5 text-[11px] font-black uppercase tracking-tight transition-all rounded-md',
            kind === 'LIMIT'
              ? 'bg-foreground text-background shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Giới hạn
        </button>
        {marketType === 'SPOT' && side === 'SHORT' && (
          <button
            onClick={() => setKind('TP/SL')}
            className={cn(
              'flex-1 py-1.5 text-[11px] font-black uppercase tracking-tight transition-all rounded-md',
              kind === 'TP/SL'
                ? 'bg-foreground text-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            TP/SL
          </button>
        )}
      </div>

      {/* ── Giá hiện tại ── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 rounded-lg border border-border/40 group hover:border-border/80 transition-all">
        <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-tight">Giá XAUT/USDT</span>
        <span className="ml-auto text-sm font-mono font-black text-foreground">
          ${tradingState$.currentPrice.get().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* ── Giá Limit ── */}
      {kind === 'LIMIT' && (
        <NumericInput 
          id="tut-order-price"
          label="Giá Limit (USDT)" 
          value={price} 
          onChange={setPrice} 
          step={0.1}
        />
      )}

      {/* ── Số tiền / Số lượng ── */}
      <div className="flex flex-col gap-2">
        <NumericInput 
          id="tut-order-amount"
          label={marketType === 'FUTURE' ? "Ký quỹ (USDT)" : (side === 'LONG' ? "Số tiền (USDT)" : "Số lượng (XAUT)")} 
          value={quantity} 
          onChange={setQuantity} 
          step={marketType === 'FUTURE' || side === 'LONG' ? 10 : 0.001}
        />
        
        {/* Slider phần trăm */}
        <div id="tut-order-slider" className="px-1 pt-1 flex flex-col gap-2">
          <SingleSlider 
            min={0} 
            max={100} 
            step={1} 
            value={Math.min(100, currentPercent)} 
            onValueChange={handlePercentChange} 
          />
          <div className="flex justify-between text-[9px] font-black text-muted-foreground/50 uppercase tracking-tighter">
            <span onClick={() => handlePercentChange(0)} className="hover:text-primary cursor-pointer transition-colors">0%</span>
            <span onClick={() => handlePercentChange(25)} className="hover:text-primary cursor-pointer transition-colors">25%</span>
            <span onClick={() => handlePercentChange(50)} className="hover:text-primary cursor-pointer transition-colors">50%</span>
            <span onClick={() => handlePercentChange(75)} className="hover:text-primary cursor-pointer transition-colors">75%</span>
            <span onClick={() => handlePercentChange(100)} className="hover:text-primary cursor-pointer transition-colors">100%</span>
          </div>
        </div>
      </div>

      {/* ── TP / SL ── */}
      {((marketType === 'SPOT' && side === 'SHORT' && (kind === 'TP/SL' || kind === 'LIMIT')) || marketType === 'FUTURE') && (
        <div id="tut-order-tpsl" className="flex flex-col gap-2">
          <NumericInput 
            label="Chốt Lời (TP)" 
            value={takeProfit} 
            onChange={setTakeProfit} 
            step={0.1}
            variant="success"
          />
          <NumericInput 
            label="Cắt Lỗ (SL)" 
            value={stopLoss} 
            onChange={setStopLoss} 
            step={0.1}
            variant="danger"
          />
          {marketType === 'SPOT' && kind === 'TP/SL' && (
            <p className="text-[10px] text-muted-foreground italic px-1 opacity-60">
              * Lệnh TP/SL sẽ kích hoạt theo giá thị trường khi chạm mức trigger.
            </p>
          )}
        </div>
      )}

      {/* ── Ước tính ─────────────────────────────────────────── */}
      {qtyInput > 0 && (
        <div className="flex flex-col gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
           <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{marketType === 'FUTURE' ? 'Ký quỹ dự kiến' : (side === 'LONG' ? 'Chi phí dự kiến' : 'Tổng giá trị nhận')}</span>
              <span className="font-mono font-black text-foreground">
                ${estCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
           </div>
           {(marketType === 'FUTURE' || side === 'LONG') && (
             <div className="flex items-center justify-between text-xs pt-2 border-t border-primary/10">
                <span className="text-muted-foreground">{marketType === 'FUTURE' ? 'Quy mô vị thế' : 'XAUT nhận được'}</span>
                {marketType === 'FUTURE' ? (
                  <span className="font-mono font-black text-emerald-500">
                    ≈ ${(qtyInput * leverage).toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT
                  </span>
                ) : (
                  <span className="font-mono font-black text-emerald-500">
                    ≈ {xautReceivedValue.toFixed(6)} oz
                  </span>
                )}
             </div>
           )}
        </div>
      )}

      <button
        id="tut-order-submit"
        onClick={placeOrder}
        disabled={isLoading}
        className={cn(
          'w-full rounded-lg py-3 text-sm font-extrabold tracking-wider transition-all duration-200 active:scale-[0.98]',
          side === 'LONG'
            ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'
            : 'bg-destructive hover:opacity-90 text-destructive-foreground shadow-lg shadow-destructive/20',
          isLoading && 'opacity-50 pointer-events-none'
        )}
      >
        {isLoading ? 'Đang xử lý...' : marketType === 'FUTURE' ? (kind === 'MARKET' ? 'Vào lệnh Thị trường' : 'Đặt lệnh Giới hạn') : (kind === 'MARKET' ? 'Vào lệnh Thị trường' : kind === 'LIMIT' ? 'Đặt lệnh Giới hạn' : 'Đặt lệnh TP/SL')} —{' '}
        {side === 'LONG' ? (marketType === 'FUTURE' ? 'Long XAUT' : 'Mua XAUT') : (marketType === 'FUTURE' ? 'Short XAUT' : 'Bán XAUT')}
      </button>

    </div>
  );
});

/**
 * Custom Numeric Input with Premium UI
 */
function NumericInput({ 
  id,
  label, 
  value, 
  onChange, 
  step = 1, 
  variant = 'default' 
}: { 
  id?: string;
  label: string; 
  value: string; 
  onChange: (val: string) => void; 
  step?: number;
  variant?: 'default' | 'success' | 'danger';
}) {
  const handleStep = (dir: number) => {
    const current = parseFloat(value) || 0;
    const precision = step.toString().split('.')[1]?.length || 0;
    const next = (current + dir * step).toFixed(precision);
    onChange(next);
  };

  return (
    <div id={id} className="flex flex-col gap-1.5 group">
      <label className="text-[10px] text-muted-foreground font-black uppercase tracking-widest pl-1 opacity-70">
        {label}
      </label>
      <div className={cn(
        "flex w-full items-center bg-muted/20 border border-border rounded-lg overflow-hidden transition-all duration-200 focus-within:border-primary/50 focus-within:bg-background/50",
        variant === 'success' && "focus-within:border-emerald-500/50",
        variant === 'danger' && "focus-within:border-rose-500/50",
      )}>
        <button
          onClick={() => handleStep(-1)}
          className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-transparent text-center text-sm font-mono font-bold text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0.00"
        />
        <button
          onClick={() => handleStep(1)}
          className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
