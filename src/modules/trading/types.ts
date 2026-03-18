// ─────────────────────────────────────────────
// Candle (OHLCV)
// ─────────────────────────────────────────────
export interface CandleType {
  time: number;      // Unix timestamp (seconds)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closed?: boolean;
}

// ─────────────────────────────────────────────
// Order
// ─────────────────────────────────────────────
export type OrderSide = 'LONG' | 'SHORT';
export type OrderKind = 'MARKET' | 'LIMIT';
export type OrderStatus = 'PENDING' | 'FILLED' | 'CANCELLED';

export interface OrderType {
  id: string;
  symbol: string;
  side: OrderSide;
  kind: OrderKind;
  status: OrderStatus;
  price: number;         // limit price (0 for market)
  quantity: number;
  createdAt: number;     // Unix ms
  filledAt?: number;
  filledPrice?: number;
}

// ─────────────────────────────────────────────
// Position
// ─────────────────────────────────────────────
export interface PositionType {
  id: string;
  symbol: string;
  side: OrderSide;
  entryPrice: number;
  quantity: number;
  openedAt: number;      // Unix ms
  takeProfit?: number;
  stopLoss?: number;
}

export interface ClosedPositionType extends PositionType {
  exitPrice: number;
  closedAt: number;      // Unix ms
  pnl: number;
}

// ─────────────────────────────────────────────
// Replay state
// ─────────────────────────────────────────────
export type ReplaySpeed = 1 | 2 | 5 | 10;

export interface ReplayState {
  isActive: boolean;
  isPlaying: boolean;
  currentIndex: number;
  speed: ReplaySpeed;
}

// ─────────────────────────────────────────────
// Global Trading State
// ─────────────────────────────────────────────
export type Timeframe = '1s' | '1m' | '1h' | '1d' | '1month';

export interface TradingState {
  currentSymbol: string;
  timeframe: Timeframe;
  balance: number;
  currentPrice: number;
  chartData: CandleType[];
  openPositions: PositionType[];
  closedPositions: ClosedPositionType[];
  pendingOrders: OrderType[];
  orderHistory: OrderType[];
  replayState: ReplayState;
  isRealtimeActive: boolean;
}
