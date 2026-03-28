'use client';

import { useEffect, useRef, useCallback } from 'react';
import { tradingState$, tradingActions } from '../store';
import { authState$ } from '@/modules/auth/store';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { API_BASE_URL } from '@/services/apiConfig';

const WS_URL = `${API_BASE_URL}/ws`;
const BACKEND_SYMBOL = 'XAU-USDT-SWAP';

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

function updateTickerStats(newPrice: number) {
  const currentTicker = tradingState$.marketTicker.get();
  const currentChart = tradingState$.chartData.get() || [];
  let basePrice = tradingState$.basePrice24h.get();

  if (basePrice <= 0 && currentChart.length > 0) {
    const now = Date.now() / 1000;
    const dayAgo = now - 86400;
    const last24h = currentChart.filter(c => c.time >= dayAgo);
    
    if (last24h.length > 0) {
      basePrice = last24h[0].open;
      tradingState$.basePrice24h.set(basePrice);
      
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

  if (basePrice <= 0) basePrice = newPrice;

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
    change24hPct: +changePct.toFixed(3),
  });
}

export function useRealtimeFeed() {
  const stompClientRef = useRef<Client | null>(null);
  // Cờ xác nhận đã nhận được dữ liệu nến đầu tiên
  const dataReceivedRef = useRef(false);
  // Watchdog timer: toast nếu sau 8s không có data
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Throttle tick buffer to prevent React update depth exceeded from WS flood
  const pendingTickRef = useRef<any>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (stompClientRef.current?.connected) return;

    const tf = tradingState$.timeframe.get();
    const wsFrame = timeframeToWsFrame(tf);
    const userId = authState$.user.get()?.userId || localStorage.getItem('userId');

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      connectHeaders: userId ? { userId } : undefined,

      onConnect: () => {
        console.log('[RealtimeFeed] STOMP connected');
        dataReceivedRef.current = false;

        // ── Watchdog: 8s sau kết nối, nếu chưa có dữ liệu → silent log ──
        watchdogRef.current = setTimeout(() => {
          if (!dataReceivedRef.current) {
            console.warn('[RealtimeFeed] Watchdog: no data received after 8s');
          }
        }, 8000);

        // Bắt đầu interval xử lý buffer nến ở 20 FPS (50ms) để không dồn update vào React
        if (!tickIntervalRef.current) {
          tickIntervalRef.current = setInterval(() => {
            if (!pendingTickRef.current) return;
            const data = pendingTickRef.current;
            pendingTickRef.current = null; // Clear processed tick

            try {
              const newPrice = data.close;
              const newCandle = {
                time: Math.floor(data.openTime / 1000),
                open: data.open,
                high: data.high,
                low: data.low,
                close: data.close,
                volume: data.volume,
                closed: data.closed,
              };

              // Đánh dấu có data → xóa watchdog
              if (!dataReceivedRef.current) {
                dataReceivedRef.current = true;
                if (watchdogRef.current) {
                  clearTimeout(watchdogRef.current);
                  watchdogRef.current = null;
                }
              }

              // Log giá hiện tại từ socket (giới hạn theo rate limit)
              console.log('[RealtimeFeed] Current price from socket:', newPrice);

              const current = tradingState$.chartData.get() || [];
              const last = current[current.length - 1];
              if (!last || newCandle.time > last.time) {
                tradingActions.appendCandle(newCandle);
              } else if (newCandle.time === last.time) {
                tradingActions.updateLastCandle(newCandle);
              }

              tradingActions.setCurrentPrice(newPrice);
              updateTickerStats(newPrice);

              if (tradingState$.isChartLoading.get()) {
                tradingActions.setIsChartLoading(false);
              }
            } catch (err) {
              console.error('[RealtimeFeed] Error processing pending tick', err);
            }
          }, 50);
        }

        // ── 1. Subscribe to candles ──────────────────────────────────────
        const topic = `/topic/candles/${BACKEND_SYMBOL}/${wsFrame}`;
        client.subscribe(topic, (message) => {
          try {
            const data = JSON.parse(message.body);
            pendingTickRef.current = data; // Chỉ ghi đè vào ref (0 cost)
          } catch (err) {
            console.error('[RealtimeFeed] Error parsing candle message', err);
          }
        });

        // ── 2. Subscribe to user trading feed (Wallet & Positions) ───────
        if (userId) {
          const userTopic = `/topic/trading/${userId}`;
          client.subscribe(userTopic, (message) => {
            try {
              const data = JSON.parse(message.body);

              console.log('[TradingWS] RAW wallet:', data.wallet);
              console.log('[TradingWS] RAW positions:', data.positions);

              if (data.wallet) {
                tradingActions.setWalletData({
                  originalWalletBalance: Number(data.wallet.originalWalletBalance) || 0,
                  totalEquity: Number(data.wallet.totalEquity) || 0,
                  dailyPnl: Number(data.wallet.dailyPnl) || 0,
                  dailyPnlPercent: Number(data.wallet.dailyPnlPercent) || 0,
                });
              }

              if (data.positions && Array.isArray(data.positions)) {
                const mappedPositions = data.positions.map((p: any, idx: number) => {
                  const mapped = {
                    id: p.id ?? `pos-${p.symbol}-${p.side}-${idx}`,
                    symbol: p.symbol ?? 'XAUT',
                    side: p.side,
                    entryPrice: Number(p.entryPrice) ?? 0,
                    markPrice: Number(p.markPrice) ?? 0,
                    quantity: Number(p.quantity) ?? 0,
                    margin: Number(p.margin) ?? 0,
                    leverage: Number(p.leverage) ?? 1,
                    unrealizedPnl: Number(p.unrealizedPnl) ?? 0,
                    pnlPercentage: Number(p.pnlPercentage) ?? 0,
                    liquidationPrice: Number(p.liquidationPrice) ?? 0,
                    takeProfit: p.takeProfit != null ? Number(p.takeProfit) : null,
                    stopLoss: p.stopLoss != null ? Number(p.stopLoss) : null,
                  };
                  console.log('[TradingWS] Mapped position:', mapped);
                  return mapped;
                });
                tradingState$.openPositions.set(mappedPositions);
              }
            } catch (err) {
              console.error('[RealtimeFeed] Error processing user trading data', err);
            }
          });
        }

        // ── 3. Request initial candle batch ──────────────────────────────
        client.publish({
          destination: `/app/init-candles/${BACKEND_SYMBOL}/${wsFrame}`,
          body: JSON.stringify({}),
        });
      },

      onDisconnect: () => {
        console.warn('[RealtimeFeed] STOMP disconnected');
        if (watchdogRef.current) {
          clearTimeout(watchdogRef.current);
          watchdogRef.current = null;
        }
        if (tickIntervalRef.current) {
          clearInterval(tickIntervalRef.current);
          tickIntervalRef.current = null;
        }
      },

      onWebSocketClose: (evt) => {
        console.warn('[RealtimeFeed] WebSocket closed', evt);
      },

      onStompError: (frame) => {
        const errorMsg = frame.headers['message'] || 'WebSocket error';
        console.error('[RealtimeFeed] STOMP error', errorMsg);
        if (watchdogRef.current) {
          clearTimeout(watchdogRef.current);
          watchdogRef.current = null;
        }
        if (tickIntervalRef.current) {
          clearInterval(tickIntervalRef.current);
          tickIntervalRef.current = null;
        }
      },
    });

    client.activate();
    stompClientRef.current = client;
  }, []);

  const stop = useCallback(() => {
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
      console.log('[RealtimeFeed] STOMP deactivated');
    }
  }, []);

  useEffect(() => {
    return () => { stop(); };
  }, [stop]);

  return { start, stop };
}
