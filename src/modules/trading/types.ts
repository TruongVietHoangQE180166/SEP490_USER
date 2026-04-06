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
export type OrderKind = 'MARKET' | 'LIMIT' | 'TP/SL';
export type OrderTypeStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED'; // match real API

export interface OrderType {
  id: string;
  userId: string;
  username: string;
  email: string;
  symbol: string;
  currency: string;
  type: string; // "BUY" | "SELL"
  category: string; // "LIMIT" | "MARKET"
  limitPrice: number | null;
  quantity: number;
  totalMoney: number | null;
  status: OrderTypeStatus;
  avgPrice: number | null;
  closePrice: number;
  takeProfit: number | null;
  stopLoss: number | null;
  changeBalance: number | null;
  changePercent: number | null;
  createdDate: string; // e.g. "2026-03-02..."
  completed: boolean;
}

export interface PlaceOrderRequest {
  type: "BUY" | "SELL";
  category: "LIMIT" | "MARKET";
  limitPrice: number | null;
  quantity: number | null;
  totalMoney: number | null;
  takeProfit: number | null;
  stopLoss: number | null;
}

export interface PlaceFutureOrderRequest {
  side: "LONG" | "SHORT";
  orderCategory: "LIMIT" | "MARKET";
  margin: number;
  leverage: number;
  entryPrice: number | null;
  takeProfit: number | null;
  stopLoss: number | null;
}

export interface FutureOrderType {
  id: string;
  userId: string;
  username: string;
  email: string;
  symbol: string;
  currency: string;
  side: string;
  orderCategory: string;
  status: string;
  quantity: number;
  entryPrice: number;
  closePrice: number | null;
  liquidationPrice: number | null;
  leverage: number;
  margin: number;
  unrealizedPnl: number;
  realizedPnl: number;
  positionValue: number;
  takeProfit: number | null;
  stopLoss: number | null;
  createdDate: string;
}

// ─────────────────────────────────────────────
// Position
// ─────────────────────────────────────────────
export interface PositionType {
  id?: string;
  symbol: string;
  side: OrderSide | string;
  entryPrice: number;
  quantity: number;
  openedAt?: number;      // Unix ms
  takeProfit?: number | null;
  stopLoss?: number | null;
  
  // Realtime fields from WS
  markPrice?: number;
  margin?: number;
  leverage?: number;
  unrealizedPnl?: number;
  pnlPercentage?: number;
  liquidationPrice?: number;
}

export interface ClosedPositionType extends PositionType {
  exitPrice: number;
  closedAt: number;      // Unix ms
  pnl: number;
  status?: string;
  orderCategory?: string;
  positionValue?: number;
  currency?: string;
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

// ─────────────────────────────────────────────
// Market Ticker (24h stats)
// ─────────────────────────────────────────────
export interface MarketTicker {
  indexPrice: number;
  markPrice: number;
  tetherGoldPrice: number;
  high24h: number;
  low24h: number;
  vol24h: number;      // Volume in XAUT
  value24h: number;    // Value in USDT
  change24h: number;   // Absolute change
  change24hPct: number; // Percentage change
}

export interface WalletTradingData {
  availableBalance: number; // USDT
  lockedBalance: number;    // USDT in pending buy orders
  goldBalance: number;      // Total XAUT
  lockedGoldBalance: number; // XAUT in pending sell orders

  // Realtime fields from WS
  originalWalletBalance?: number;
  totalEquity?: number;
  dailyPnl?: number;
  dailyPnlPercent?: number;
}

export interface TradingState {
  currentSymbol: string;
  timeframe: Timeframe;
  balance: number; // Keep for convenience (maps to availableBalance)
  wallet: WalletTradingData;
  currentPrice: number;
  previousPrice: number;
  basePrice24h: number;
  marketTicker: MarketTicker;
  chartData: CandleType[];
  openPositions: PositionType[];
  closedPositions: ClosedPositionType[];
  pendingOrders: OrderType[];
  pendingFutureOrders: FutureOrderType[];
  orderHistory: OrderType[];
  replayState: ReplayState;
  isRealtimeActive: boolean;
  isChartLoading: boolean;
}

// ─────────────────────────────────────────────
// AI Chat
// ─────────────────────────────────────────────
export interface ChatMessageItem {
  userId: string;
  username: string;
  email: string;
  userMessage: string;
  aiResponse: string;
}

export interface ChatPaginatedResponse {
  content: ChatMessageItem[];
  request: {
    page: number;
    size: number;
    sortRequest: { direction: string; field: string };
  };
  totalElement: number;
}

export interface ChatHistoryApiResponse {
  message: { messageCode: string; messageDetail: string };
  errors: any;
  data: ChatPaginatedResponse;
  success: boolean;
}

export interface SendChatMessageResponse {
  message: { messageCode: string; messageDetail: string };
  errors: any;
  data: string;
  success: boolean;
}
