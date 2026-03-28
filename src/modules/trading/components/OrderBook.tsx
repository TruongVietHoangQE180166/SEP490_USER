'use client';

import { observer } from '@legendapp/state/react';
import { tradingState$ } from '../store';
import { cn } from '@/lib/utils';
import { useMemo, useState, useEffect, useRef } from 'react';

export const OrderBook = observer(function OrderBook() {
  const currentPrice = tradingState$.currentPrice.get();
  const [orderData, setOrderData] = useState<{asks: any[], bids: any[]}>({ asks: [], bids: [] });
  const [viewMode, setViewMode] = useState<'both' | 'asks' | 'bids'>('both');
  const lastPriceRef = useRef(currentPrice);

  // Khởi tạo và cập nhật dữ liệu realtime giả lập
  useEffect(() => {
    const generateInitialData = (basePrice: number) => {
      const askList = [];
      const bidList = [];
      const count = 60; // Tạo nhiều data hơn để lấp đầy khoảng trống (800px)
      const step = 0.5;

      for (let i = 1; i <= count; i++) {
        askList.push({
          price: basePrice + (i * step),
          amount: Math.random() * 40 + 1,
        });
        bidList.push({
          price: basePrice - (i * step),
          amount: Math.random() * 40 + 1,
        });
      }
      return { asks: askList, bids: bidList };
    };

    // Khởi tạo lần đầu hoặc khi giá nhảy vọt
    if (orderData.asks.length === 0 || Math.abs(currentPrice - lastPriceRef.current) > 2) {
      setOrderData(generateInitialData(currentPrice));
      lastPriceRef.current = currentPrice;
    }

    const interval = setInterval(() => {
      setOrderData(prev => {
        const updateList = (list: any[]) => {
          return list.map(item => {
            if (Math.random() > 0.8) {
              const change = (Math.random() - 0.5) * 5;
              return { ...item, amount: Math.max(0.1, item.amount + change) };
            }
            return item;
          });
        };

        return {
          asks: updateList(prev.asks),
          bids: updateList(prev.bids)
        };
      });
    }, 500);

    return () => clearInterval(interval);
  }, [currentPrice, orderData.asks.length]);

  // Tính toán dữ liệu hiển thị dựa trên viewMode
  const { asks, bids, maxTotal } = useMemo(() => {
    // Tăng giới hạn dòng để lấp đầy 800px chiều cao
    const rowLimit = viewMode === 'both' ? 20 : 40;
    
    let askTotal = 0;
    const processedAsks = [...orderData.asks]
      .sort((a, b) => b.price - a.price)
      .slice(-rowLimit) // Lấy những giá gần nhất với market
      .map(item => {
        askTotal += item.amount;
        return { ...item, total: askTotal };
      });

    let bidTotal = 0;
    const processedBids = [...orderData.bids]
      .sort((a, b) => b.price - a.price)
      .slice(0, rowLimit)
      .map(item => {
        bidTotal += item.amount;
        return { ...item, total: bidTotal };
      });

    return { 
      asks: processedAsks, 
      bids: processedBids, 
      maxTotal: Math.max(askTotal, bidTotal) 
    };
  }, [orderData, viewMode]);

  return (
    <div className="flex flex-col h-full bg-card rounded-md border border-border overflow-hidden select-none">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border bg-muted/10 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Sổ lệnh</span>
        
        {/* Mode Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-background/50 p-1 rounded border border-border/50">
          <button 
            onClick={() => setViewMode('both')}
            className={cn("p-1 rounded transition-all", viewMode === 'both' ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground")}
            title="Xem cả hai"
          >
            <div className="flex flex-col gap-0.5">
              <div className="w-2.5 h-1 bg-rose-500/60 rounded-[1px]" />
              <div className="w-2.5 h-1 bg-emerald-500/60 rounded-[1px]" />
            </div>
          </button>
          <button 
            onClick={() => setViewMode('bids')}
            className={cn("p-1 rounded transition-all", viewMode === 'bids' ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground")}
            title="Chỉ xem lệnh mua"
          >
            <div className="flex flex-col gap-0.5">
              <div className="w-2.5 h-1 bg-emerald-500/60 rounded-[1px]" />
              <div className="w-2.5 h-1 bg-emerald-500/60 rounded-[1px]" />
            </div>
          </button>
          <button 
            onClick={() => setViewMode('asks')}
            className={cn("p-1 rounded transition-all", viewMode === 'asks' ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground")}
            title="Chỉ xem lệnh bán"
          >
            <div className="flex flex-col gap-0.5">
              <div className="w-2.5 h-1 bg-rose-500/60 rounded-[1px]" />
              <div className="w-2.5 h-1 bg-rose-500/60 rounded-[1px]" />
            </div>
          </button>
        </div>
      </div>

      {/* Tên cột */}
      <div className="grid grid-cols-3 px-3 py-1.5 text-[9px] uppercase font-bold text-muted-foreground border-b border-border/10">
        <span>Giá (USDT)</span>
        <span className="text-center">Số lượng</span>
        <span className="text-right">Tổng</span>
      </div>

      {/* Sells (Asks) - Chỉ hiện khi ở chế độ 'both' hoặc 'asks' */}
      {(viewMode === 'both' || viewMode === 'asks') && (
        <div className={cn(
          "flex-1 overflow-y-auto scrollbar-hide flex flex-col justify-end py-1",
          viewMode === 'asks' ? "justify-start" : "justify-end"
        )}>
          {asks.map((ask, i) => (
            <div key={i} className="relative grid grid-cols-3 px-3 py-[2px] text-[10px] hover:bg-muted/30 transition-colors group">
              <div 
                className="absolute inset-y-0 right-0 bg-rose-500/10 transition-all duration-500 pointer-events-none"
                style={{ width: `${(ask.total / maxTotal) * 100}%` }}
              />
              <span className="font-mono font-bold text-rose-500 z-10">{ask.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className="text-center font-mono text-foreground/80 z-10">{ask.amount.toFixed(2)}</span>
              <span className="text-right font-mono text-muted-foreground/60 z-10">{ask.total.toFixed(1)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Giá trung tâm (Spread) - Luôn hiện ở cả 3 chế độ */}
      <div className="px-3 py-3 border-y border-border/30 bg-muted/5 flex items-center justify-between">
        <span className="text-sm font-mono font-black tracking-tighter text-foreground">
          ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
        <span className="text-[9px] text-muted-foreground font-mono italic">
          Spread: 0.50
        </span>
      </div>

      {/* Buys (Bids) - Chỉ hiện khi ở chế độ 'both' hoặc 'bids' */}
      {(viewMode === 'both' || viewMode === 'bids') && (
        <div className="flex-1 overflow-y-auto scrollbar-hide py-1">
          {bids.map((bid, i) => (
            <div key={i} className="relative grid grid-cols-3 px-3 py-[2px] text-[10px] hover:bg-muted/30 transition-colors group">
              <div 
                className="absolute inset-y-0 right-0 bg-emerald-500/10 transition-all duration-500 pointer-events-none"
                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
              />
              <span className="font-mono font-bold text-emerald-500 z-10">{bid.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className="text-center font-mono text-foreground/80 z-10">{bid.amount.toFixed(2)}</span>
              <span className="text-right font-mono text-muted-foreground/60 z-10">{bid.total.toFixed(1)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer nhỏ */}
      <div className="px-3 py-1.5 bg-muted/5 border-t border-border/20 flex justify-between items-center">
        <span className="text-[9px] text-muted-foreground font-bold uppercase">Độ chính xác</span>
        <span className="text-[9px] font-mono text-foreground/50">0.01</span>
      </div>
    </div>
  );
});
