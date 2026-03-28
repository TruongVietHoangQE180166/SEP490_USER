'use client';

import { useEffect, useRef, useCallback } from 'react';
import { tradingState$, tradingActions } from '../store';
// Logic is now handled by the backend
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast } from '@/components/ui/toast';

const WS_URL = 'https://vict-beeab2c3akcqgyej.malaysiawest-01.azurewebsites.net/ws';
// Symbol used for backend - requested XAU-USDT-SWAP
const BACKEND_SYMBOL = 'XAU-USDT-SWAP';

/**
 * Maps UI timeframe to WebSocket frame string (requested 1s, 1m, 1H, 1D, 1M).
 */
const timeframeToWsFrame = (tf: string): string => {
  const map: Record<string, string> = {
    '1s': '1s',
    '1m': '1m',
    '1h': '1H',
    '1d': '1D',
    '1month': '1M',
  };
  return map[tf] ?? tf;
};

/**
 * Hook that manages the realtime price feed via WebSocket (STOMP).
 * Subscribes to the corresponding topic and handles candle updates.
 */
/**
 * Computes 24h ticker statistics. 
 * Improved logic: stays stable across timeframe changes by using a persistent basePrice24h.
 */
function updateTickerStats(newPrice: number) {
  const currentTicker = tradingState$.marketTicker.get();
  const currentChart = tradingState$.chartData.get() || [];
  let basePrice = tradingState$.basePrice24h.get();

  // 1. If we don't have a stable base price yet, try to find it from the 1h/1m chart data
  if (basePrice <= 0 && currentChart.length > 0) {
    const now = Date.now() / 1000;
    const dayAgo = now - 86400;
    const last24h = currentChart.filter(c => c.time >= dayAgo);
    
    if (last24h.length > 0) {
      basePrice = last24h[0].open;
      tradingState$.basePrice24h.set(basePrice);
      
      // Also initialize High/Low/Vol from historical data if it's the first time
      let h = -Infinity, l = Infinity, v = 0, val = 0;
      last24h.forEach(c => {
        if (c.high > h) h = c.high;
        if (c.low < l) l = c.low;
        v += c.volume;
        val += (c.volume * c.close);
      });
      
      tradingActions.setMarketTicker({
        high24h: +h.toFixed(2),
        low24h: +l.toFixed(2),
        vol24h: +v.toFixed(2),
        value24h: +val.toFixed(2),
      });
    }
  }

  // 2. Fallback if still no base price (likely no data in current timeframe)
  if (basePrice <= 0) basePrice = newPrice;

  // 3. Incremental updates: price movement affects high/low regardless of timeframe
  const newHigh = Math.max(currentTicker.high24h || newPrice, newPrice);
  const newLow = currentTicker.low24h <= 0 ? newPrice : Math.min(currentTicker.low24h, newPrice);
  
  const change = newPrice - basePrice;
  const changePct = (change / basePrice) * 100;

  tradingActions.setMarketTicker({
    indexPrice: +(newPrice * 1.0002).toFixed(2),
    markPrice: +(newPrice * 0.9999).toFixed(2),
    tetherGoldPrice: +(newPrice * 1.0005).toFixed(2),
    high24h: +newHigh.toFixed(2),
    low24h: +newLow.toFixed(2),
    change24h: +change.toFixed(2),
    change24hPct: +changePct.toFixed(3)
    // Note: Volume is harder to update incrementally across timeframes without backend help,
    // so we keep the value from the last stable calculation.
  });
}

export function useRealtimeFeed() {
  const stompClientRef = useRef<Client | null>(null);

  const start = useCallback(() => {
    if (stompClientRef.current?.connected) return;

    const tf = tradingState$.timeframe.get();
    const wsFrame = timeframeToWsFrame(tf);
    
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('[RealtimeFeed] STOMP connected');
        const topic = `/topic/candles/${BACKEND_SYMBOL}/${wsFrame}`;
        
        client.subscribe(topic, (message) => {
          try {
            const data = JSON.parse(message.body);
            const newPrice = data.close;
            const newCandle = {
              time: Math.floor(data.openTime / 1000), // ms -> seconds
              open: data.open,
              high: data.high,
              low: data.low,
              close: data.close,
              volume: data.volume,
              closed: data.closed,
            };

            const current = tradingState$.chartData.get() || [];
            const last = current[current.length - 1];

            // If time is newer, append. If same time, update.
            if (!last || newCandle.time > last.time) {
              tradingActions.appendCandle(newCandle);
            } else if (newCandle.time === last.time) {
              tradingActions.updateLastCandle(newCandle);
            }
            
            tradingActions.setCurrentPrice(newPrice);
            updateTickerStats(newPrice);
            
            // Clear loading state when the first realtime message arrives
            if (tradingState$.isChartLoading.get()) {
              tradingActions.setIsChartLoading(false);
            }
            
            // Note: Limit order checks and TP/SL checks are now handled by the backend directly.
          } catch (err) {
            console.error('[RealtimeFeed] Error processing message', err);
          }
        });

        // Request initial candle
        client.publish({
          destination: `/app/init-candles/${BACKEND_SYMBOL}/${wsFrame}`,
          body: JSON.stringify({}),
        });
      },
      onStompError: (frame) => {
        const errorMsg = frame.headers['message'] || 'WebSocket error';
        console.error('[RealtimeFeed] STOMP error', errorMsg);
        toast.error(`Lỗi kết nối: ${errorMsg}`);
      },
    });

    client.activate();
    stompClientRef.current = client;
  }, []);

  const stop = useCallback(() => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
      console.log('[RealtimeFeed] STOMP deactivated');
    }
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { start, stop };
}
