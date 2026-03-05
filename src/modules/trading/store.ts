import { observable } from '@legendapp/state';
import { TradingState, CandleType, PositionType, OrderType, ReplaySpeed, Timeframe } from './types';

const initialTradingState: TradingState = {
  currentSymbol: 'BTC/USDT',
  timeframe: '1h',
  balance: 10000,
  currentPrice: 0,
  chartData: [],
  openPositions: [],
  closedPositions: [],
  pendingOrders: [],
  orderHistory: [],
  replayState: {
    isActive: false,
    isPlaying: false,
    currentIndex: 0,
    speed: 1,
  },
  isRealtimeActive: true,
};

export const tradingState$ = observable<TradingState>(initialTradingState);

export const tradingActions = {
  // ─── Symbol / Timeframe ───────────────────────────────────
  setSymbol: (symbol: string) => {
    tradingState$.currentSymbol.set(symbol);
  },

  setTimeframe: (tf: Timeframe) => {
    tradingState$.timeframe.set(tf);
  },

  // ─── Price / Chart ────────────────────────────────────────
  setCurrentPrice: (price: number) => {
    tradingState$.currentPrice.set(price);
  },

  setChartData: (candles: CandleType[]) => {
    tradingState$.chartData.set(candles);
  },

  appendCandle: (candle: CandleType) => {
    const current = tradingState$.chartData.get();
    tradingState$.chartData.set([...current, candle]);
  },

  updateLastCandle: (candle: CandleType) => {
    const current = tradingState$.chartData.get();
    if (current.length === 0) return;
    const updated = [...current];
    updated[updated.length - 1] = candle;
    tradingState$.chartData.set(updated);
  },

  // ─── Balance ──────────────────────────────────────────────
  setBalance: (balance: number) => {
    tradingState$.balance.set(balance);
  },

  adjustBalance: (delta: number) => {
    const current = tradingState$.balance.get();
    tradingState$.balance.set(Math.max(0, current + delta));
  },

  // ─── Positions ────────────────────────────────────────────
  addPosition: (position: PositionType) => {
    const current = tradingState$.openPositions.get();
    tradingState$.openPositions.set([...current, position]);
  },

  removePosition: (positionId: string) => {
    const current = tradingState$.openPositions.get();
    tradingState$.openPositions.set(current.filter(p => p.id !== positionId));
  },

  updatePosition: (positionId: string, updates: Partial<PositionType>) => {
    const current = tradingState$.openPositions.get();
    tradingState$.openPositions.set(
      current.map(p => p.id === positionId ? { ...p, ...updates } : p)
    );
  },

  closePosition: (positionId: string, exitPrice: number) => {
    const current = tradingState$.openPositions.get();
    const pos = current.find(p => p.id === positionId);
    if (!pos) return;

    const pnl = pos.side === 'LONG' 
      ? (exitPrice - pos.entryPrice) * pos.quantity 
      : (pos.entryPrice - exitPrice) * pos.quantity;

    const closedPos = {
      ...pos,
      exitPrice,
      closedAt: Date.now(),
      pnl,
    };

    tradingState$.openPositions.set(current.filter(p => p.id !== positionId));
    const history = tradingState$.closedPositions.get();
    tradingState$.closedPositions.set([closedPos, ...history]);

    // Trả lại ký quỹ + PnL (giả định ký quỹ là full giá trị cho đơn giản)
    // Tùy mô hình thực tế mà logic cân bằng tiền sẽ khác
    const delta = (pos.entryPrice * pos.quantity) + pnl;
    tradingActions.adjustBalance(delta);
  },

  // ─── Orders ───────────────────────────────────────────────
  addPendingOrder: (order: OrderType) => {
    const current = tradingState$.pendingOrders.get();
    tradingState$.pendingOrders.set([...current, order]);
  },

  fillOrder: (orderId: string, filledPrice: number) => {
    const pending = tradingState$.pendingOrders.get();
    const order = pending.find(o => o.id === orderId);
    if (!order) return;

    const filledOrder: OrderType = {
      ...order,
      status: 'FILLED',
      filledAt: Date.now(),
      filledPrice,
    };

    tradingState$.pendingOrders.set(pending.filter(o => o.id !== orderId));
    const history = tradingState$.orderHistory.get();
    tradingState$.orderHistory.set([filledOrder, ...history]);
  },

  cancelOrder: (orderId: string) => {
    const pending = tradingState$.pendingOrders.get();
    const order = pending.find(o => o.id === orderId);
    if (!order) return;

    const cancelled: OrderType = { ...order, status: 'CANCELLED' };
    tradingState$.pendingOrders.set(pending.filter(o => o.id !== orderId));
    const history = tradingState$.orderHistory.get();
    tradingState$.orderHistory.set([cancelled, ...history]);
  },

  // ─── Realtime ─────────────────────────────────────────────
  setRealtimeActive: (active: boolean) => {
    tradingState$.isRealtimeActive.set(active);
  },

  // ─── Replay ───────────────────────────────────────────────
  startReplay: () => {
    tradingState$.replayState.isActive.set(true);
    tradingState$.replayState.isPlaying.set(true);
    tradingState$.replayState.currentIndex.set(0);
    tradingState$.isRealtimeActive.set(false);
  },

  pauseReplay: () => {
    tradingState$.replayState.isPlaying.set(false);
  },

  resumeReplay: () => {
    tradingState$.replayState.isPlaying.set(true);
  },

  stopReplay: () => {
    tradingState$.replayState.set({
      isActive: false,
      isPlaying: false,
      currentIndex: 0,
      speed: tradingState$.replayState.speed.get(),
    });
    tradingState$.isRealtimeActive.set(true);
  },

  setReplaySpeed: (speed: ReplaySpeed) => {
    tradingState$.replayState.speed.set(speed);
  },

  advanceReplayIndex: () => {
    const current = tradingState$.replayState.currentIndex.get();
    tradingState$.replayState.currentIndex.set(current + 1);
  },

  // ─── Reset ────────────────────────────────────────────────
  reset: () => {
    tradingState$.set(initialTradingState);
  },
};
