'use client';

import { useEffect, useState, useCallback } from 'react';
import { observer } from '@legendapp/state/react';
import { tradingState$, tradingActions } from '../store';
import { TradingChart } from './TradingChart';
import { OrderPanel } from './OrderPanel';
import { OrderBook } from './OrderBook';
import { TradeDashboard } from './TradeDashboard';
import { MarketHeader } from './MarketHeader';
import { useRealtimeFeed } from '../hooks/useRealtimeFeed';
import { getChartHistory } from '../services';
import { CandleType, Timeframe } from '../types';
import { cn } from '@/lib/utils';

const SYMBOL = 'XAU-USDT-SWAP';

export const TradingView = observer(function TradingView() {

  const candles      = tradingState$.chartData.get();
  const positions    = tradingState$.openPositions.get();
  const currentPrice = tradingState$.currentPrice.get();
  const timeframe    = tradingState$.timeframe.get();
  const balance      = tradingState$.balance.get();
  const pendingCount = tradingState$.pendingOrders.get().length;

  const { start: startRealtime, stop: stopRealtime } = useRealtimeFeed();

  const loadData = useCallback(async (tf: Timeframe) => {
    try {
      const history = await getChartHistory(SYMBOL, tf, 2000);
      tradingActions.setChartData(history);
      
      const lastPrice = history[history.length - 1]?.close ?? 0;
      if (lastPrice > 0) {
        tradingActions.setCurrentPrice(lastPrice);
      }
      
      tradingActions.setSymbol(SYMBOL);
      tradingActions.setRealtimeActive(true);
    } catch (err) {
      console.error('[TradingView] Failed to load history', err);
    }
  }, []);

  useEffect(() => {
    tradingActions.setSymbol(SYMBOL);
    loadData(timeframe);
    startRealtime();
    return () => { stopRealtime(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTimeframeChange = (tf: Timeframe) => { stopRealtime(); loadData(tf); startRealtime(); };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* ── Khoảng cách trên ──────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 pt-6 flex flex-col gap-4">

        {/* ── MarketHeader ──────────────────────────────────────────── */}
        <div className="rounded-md border border-border bg-card overflow-hidden">
          <MarketHeader onTimeframeChange={handleTimeframeChange} />
        </div>

        {/* ── Nội dung chính: Chart + OrderBook + OrderPanel ─────── */}
        <div className="hidden lg:flex gap-4 items-start">
          {/* Cột trái - Chart */}
          <div className="flex-1 min-w-0">
            <div className="rounded-md border border-border bg-card overflow-hidden" style={{ height: 600 }}>
              <TradingChart
                candles={candles}
                positions={positions}
                currentPrice={currentPrice}
                timeframe={timeframe}
              />
            </div>
          </div>

          {/* Cột giữa — Order Book */}
          <div className="flex flex-col w-[200px] 2xl:w-[240px] flex-none h-[600px]">
            <OrderBook />
          </div>

          {/* Cột phải — Order Panel */}
          <div className="flex flex-col w-[300px] xl:w-[320px] flex-none h-[600px]">
            <div className="rounded-md border border-border bg-card overflow-hidden flex flex-col h-full">
              <div className="px-4 py-3 border-b border-border bg-muted/10">
                <span className="text-xs font-black uppercase tracking-widest text-foreground">Đặt lệnh</span>
              </div>
              <div className="flex-1 overflow-auto">
                <OrderPanel />
              </div>
            </div>
          </div>
        </div>

        {/* ── Dashboard (Full Width) ─────────────────────────────── */}
        <div className="hidden lg:block">
          <TradeDashboard />
        </div>

        {/* ── Mobile Layout ────────────────────────────────────────── */}
        <div className="flex lg:hidden flex-col gap-4">
          <div className="rounded-md border border-border bg-card overflow-hidden h-[400px]">
             <TradingChart candles={candles} positions={positions} currentPrice={currentPrice} timeframe={timeframe} />
          </div>
          <div className="rounded-md border border-border bg-card overflow-hidden">
            <OrderPanel />
          </div>
          <div className="rounded-md border border-border bg-card overflow-hidden">
            <OrderBook />
          </div>
          <div className="rounded-md border border-border bg-card overflow-hidden">
            <TradeDashboard />
          </div>
        </div>

      </div>
    </div>
  );
});
