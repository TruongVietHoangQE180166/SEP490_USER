'use client';

import { observer } from '@legendapp/state/react';
import { tradingState$ } from '../store';
import { cn } from '@/lib/utils';
import { useMemo, useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

export const OrderBook = observer(function OrderBook() {
  const currentPrice = tradingState$.currentPrice.get();
  const [orderData, setOrderData] = useState<{asks: any[], bids: any[]}>({ asks: [], bids: [] });
  const [viewMode, setViewMode] = useState<'both' | 'asks' | 'bids'>('both');
  
  const basePriceRef = useRef(currentPrice);
  const lastPriceRef = useRef(currentPrice);
  const [priceDir, setPriceDir] = useState<'up' | 'down'>('up');

  // Khởi tạo và cập nhật dữ liệu realtime giả lập
  useEffect(() => {
    if (currentPrice > lastPriceRef.current) setPriceDir('up');
    else if (currentPrice < lastPriceRef.current) setPriceDir('down');
    lastPriceRef.current = currentPrice;

    const generateData = (basePrice: number) => {
      const askList = [];
      const bidList = [];
      const count = 60;
      
      let currentAskPrice = basePrice + Math.random() * 0.2;
      let currentBidPrice = basePrice - Math.random() * 0.2;

      for (let i = 1; i <= count; i++) {
        currentAskPrice += Math.random() > 0.4 ? 0.1 : 0.4;
        currentBidPrice -= Math.random() > 0.4 ? 0.1 : 0.4;

        askList.push({
          id: `ask-${i}`,
          price: currentAskPrice,
          amount: Math.random() * (Math.random() > 0.85 ? 120 : 25) + 0.1,
          flash: null,
        });
        bidList.push({
          id: `bid-${i}`,
          price: currentBidPrice,
          amount: Math.random() * (Math.random() > 0.85 ? 120 : 25) + 0.1,
          flash: null,
        });
      }
      return { asks: askList, bids: bidList };
    };

    if (orderData.asks.length === 0 || Math.abs(currentPrice - basePriceRef.current) > 10) {
      setOrderData(generateData(currentPrice));
      basePriceRef.current = currentPrice;
    }

    const interval = setInterval(() => {
      setOrderData(prev => {
        const updateList = (list: any[]) => {
          return list.map(item => {
            if (Math.random() > 0.6) {
              const change = (Math.random() - 0.5) * 10;
              const newAmount = Math.max(0.01, item.amount + change);
              return { 
                ...item, 
                amount: newAmount,
                flash: newAmount > item.amount ? 'up' : 'down'
              };
            }
            return { ...item, flash: null };
          });
        };

        return {
          asks: updateList(prev.asks),
          bids: updateList(prev.bids)
        };
      });
    }, 400);

    return () => clearInterval(interval);
  }, [currentPrice, orderData.asks.length]);

  // Tính toán dữ liệu hiển thị dựa trên viewMode
  const { asks, bids, maxTotal } = useMemo(() => {
    const rowLimit = viewMode === 'both' ? 20 : 42;
    
    let askTotal = 0;
    const processedAsks = [...orderData.asks]
      .sort((a, b) => b.price - a.price)
      .slice(-rowLimit)
      .map(item => { return { ...item }; }); // copy
      
    // Tính lại total cho asks từ thấp đến cao (bắt đầu từ giá sát market)
    let runningAskTotal = 0;
    const reversedAsks = processedAsks.reverse().map(item => {
      runningAskTotal += item.amount;
      return { ...item, total: runningAskTotal };
    }).reverse();

    let bidTotal = 0;
    const processedBids = [...orderData.bids]
      .sort((a, b) => b.price - a.price)
      .slice(0, rowLimit)
      .map(item => {
        bidTotal += item.amount;
        return { ...item, total: bidTotal };
      });

    return { 
      asks: reversedAsks, 
      bids: processedBids, 
      maxTotal: Math.max(runningAskTotal, bidTotal) || 1
    };
  }, [orderData, viewMode]);

  return (
    <div className="flex flex-col h-full bg-card rounded-md border border-border shadow-sm overflow-hidden select-none">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border/40 bg-muted/20 flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/80">Sổ lệnh</span>
        
        {/* Mode Toggle Buttons */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setViewMode('both')}
            className={cn("p-1.5 rounded-md transition-all border", viewMode === 'both' ? "bg-background border-primary/60 ring-1 ring-primary/30" : "text-muted-foreground border-border/50 hover:bg-muted")}
            title="Xem cả hai"
          >
            <div className="flex flex-col gap-0.5 w-[14px]">
              <div className="w-full h-[3px] bg-rose-500 rounded-sm" />
              <div className="w-full h-[3px] bg-emerald-500 rounded-sm" />
            </div>
          </button>
          <button 
            onClick={() => setViewMode('bids')}
            className={cn("p-1.5 rounded-md transition-all border", viewMode === 'bids' ? "bg-background border-primary/60 ring-1 ring-primary/30" : "text-muted-foreground border-border/50 hover:bg-muted")}
            title="Chỉ xem lệnh mua"
          >
            <div className="flex flex-col gap-0.5 justify-center h-[9px] w-[14px]">
              <div className="w-full h-[3px] bg-emerald-500 rounded-sm" />
              <div className="w-[80%] h-[3px] bg-emerald-500 rounded-sm mx-auto" />
            </div>
          </button>
          <button 
            onClick={() => setViewMode('asks')}
            className={cn("p-1.5 rounded-md transition-all border", viewMode === 'asks' ? "bg-background border-primary/60 ring-1 ring-primary/30" : "text-muted-foreground border-border/50 hover:bg-muted")}
            title="Chỉ xem lệnh bán"
          >
            <div className="flex flex-col gap-0.5 justify-center h-[9px] w-[14px]">
              <div className="w-full h-[3px] bg-rose-500 rounded-sm" />
              <div className="w-[80%] h-[3px] bg-rose-500 rounded-sm mx-auto" />
            </div>
          </button>
        </div>
      </div>

      {/* Tên cột */}
      <div className="grid grid-cols-3 px-3 py-2 text-[10px] uppercase font-bold text-muted-foreground border-b border-border/10">
        <span>Giá(USDT)</span>
        <span className="text-center">Số lượng</span>
        <span className="text-right">Tổng</span>
      </div>

      {/* Sells (Asks) */}
      {(viewMode === 'both' || viewMode === 'asks') && (
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col-reverse pt-1">
          {[...asks].reverse().map((ask, i) => (
            <div 
              key={`ask-${i}`} 
              className={cn(
                "relative grid grid-cols-3 px-3 py-[3px] text-[10px] sm:text-xs transition-colors duration-300 group cursor-crosshair",
                ask.flash === 'up' ? "bg-emerald-500/10" : ask.flash === 'down' ? "bg-rose-500/10" : "hover:bg-muted/30"
              )}
            >
              <div 
                className="absolute inset-y-0 right-0 bg-rose-500/10 transition-all duration-300 pointer-events-none"
                style={{ width: `${(ask.total / maxTotal) * 100}%` }}
              />
              <span className="font-mono font-bold text-rose-500 z-10">{ask.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
              <span className="text-center font-mono text-foreground/80 z-10">{ask.amount.toFixed(2)}</span>
              <span className="text-right font-mono text-muted-foreground/50 z-10">{ask.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Giá trung tâm (Spread) */}
      <div className="px-3 py-2 my-1 border-y border-border/20 bg-muted/5 flex items-center justify-between shadow-[0_0_15px_rgba(0,0,0,0.02)]">
        <span className={cn(
           "text-lg font-mono font-black tracking-tighter flex items-center gap-1",
           priceDir === 'up' ? "text-emerald-500" : "text-rose-500"
        )}>
          ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          {priceDir === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
        </span>
        <span className="text-[10px] text-muted-foreground font-mono font-medium opacity-80 decoration-border underline decoration-dashed underline-offset-4">
          Spread: 0.1
        </span>
      </div>

      {/* Buys (Bids) */}
      {(viewMode === 'both' || viewMode === 'bids') && (
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col justify-start pb-1">
          {bids.map((bid, i) => (
            <div 
              key={`bid-${i}`} 
              className={cn(
                "relative grid grid-cols-3 px-3 py-[3px] text-[10px] sm:text-xs transition-colors duration-300 group cursor-crosshair",
                bid.flash === 'up' ? "bg-emerald-500/10" : bid.flash === 'down' ? "bg-rose-500/10" : "hover:bg-muted/30"
              )}
            >
              <div 
                className="absolute inset-y-0 right-0 bg-emerald-500/10 transition-all duration-300 pointer-events-none"
                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
              />
              <span className="font-mono font-bold text-emerald-500 z-10">{bid.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
              <span className="text-center font-mono text-foreground/80 z-10">{bid.amount.toFixed(2)}</span>
              <span className="text-right font-mono text-muted-foreground/50 z-10">{bid.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer nhỏ */}
      <div className="px-3 py-2 bg-muted/10 border-t border-border/20 flex justify-between items-center rounded-b-md">
        <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Real-time</span>
        </div>
        <span className="text-[9px] font-mono font-bold text-foreground/50 bg-background px-1.5 py-0.5 rounded border border-border/40">0.1</span>
      </div>
    </div>
  );
});
