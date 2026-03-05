'use client';

import { useEffect, useRef, useCallback } from 'react';
import { tradingState$, tradingActions } from '../store';
import {
  checkAndFillLimitOrders,
  checkTakeProfitStopLoss,
} from '../services';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

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
            // Ignore if newCandle.time < last.time (stale data)
            
            tradingActions.setCurrentPrice(newPrice);
            
            // Side-effects (Limit orders and TP/SL)
            checkAndFillLimitOrders(tradingState$.pendingOrders.get(), newPrice, tradingState$.balance.get());
            checkTakeProfitStopLoss(tradingState$.openPositions.get(), newPrice);
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
        console.error('[RealtimeFeed] STOMP error', frame.headers['message']);
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
