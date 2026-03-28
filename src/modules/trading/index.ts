// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  CandleType,
  OrderType,
  PositionType,
  TradingState,
  ReplayState,
  OrderSide,
  OrderKind,
  OrderTypeStatus,
  ReplaySpeed,
  Timeframe,
} from './types';

// ─── Store ────────────────────────────────────────────────────────────────────
export { tradingState$, tradingActions } from './store';

// ─── Services ─────────────────────────────────────────────────────────────────
export {
  generateMockCandles,
  simulateRealtimeTick,
  calculatePnL,
  fetchTradeOrders,
  cancelTradeOrder,
  placeTradeOrder,
  timeframeToSeconds,
} from './services';
export type { PnLResult } from './services';

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { useRealtimeFeed } from './hooks/useRealtimeFeed';
export { useReplay } from './hooks/useReplay';
export { useOrderPanel } from './hooks/useOrderPanel';
export { usePositions } from './hooks/usePositions';

// ─── Components ───────────────────────────────────────────────────────────────
export { TradingChart } from './components/TradingChart';
export { OrderPanel } from './components/OrderPanel';
export { PositionPanel } from './components/PositionPanel';
export { ReplayControls } from './components/ReplayControls';
export { MarketHeader } from './components/MarketHeader';
export { TradingView } from './components/TradingView';
