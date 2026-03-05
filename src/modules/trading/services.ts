import { CandleType, OrderType, PositionType, OrderSide } from './types';
import { tradingActions, tradingState$ } from './store';
import { ApiConfigService } from '@/services/apiConfig';

/**
 * Maps UI timeframe to API frame string.
 */
export function timeframeToApiFrame(tf: string): string {
  const map: Record<string, string> = {
    '1s': 'S1',
    '1m': 'M1',
    '1h': 'H1',
    '1d': 'D1',
    '1month': 'MO1',
  };
  return map[tf] ?? 'H1';
}

/**
 * Fetches historical candle data from the backend.
 */
export async function getChartHistory(
  symbol: string,
  timeframe: string,
  limit: number = 2000
): Promise<CandleType[]> {
  const frame = timeframeToApiFrame(timeframe);
  // Real symbol might need mapping or can be passed directly.
  // User asked for XAU-USDT-SWAP specifically.
  const response = await ApiConfigService.get<any[]>(
    `/api/chart/history?symbol=${symbol}&frame=${frame}&limit=${limit}`
  );

  if (!Array.isArray(response)) {
    return [];
  }

  // 1. Map to CandleType
  const mapped = response.map(item => ({
    time: Math.floor(item.openTime / 1000), // Convert ms to seconds (UTC)
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
    closed: item.closed
  }));

  // 2. Sort by time ascending
  mapped.sort((a, b) => a.time - b.time);

  // 3. Deduplicate by time (lightweight-charts requirement)
  const deduped: CandleType[] = [];
  for (const candle of mapped) {
    if (deduped.length === 0 || candle.time > deduped[deduped.length - 1].time) {
      deduped.push(candle);
    }
  }

  return deduped;
}

// ─────────────────────────────────────────────
// 1. Mock Data Generation
// ─────────────────────────────────────────────

/**
 * Generate an array of mock OHLCV candles.
 * @param count   Number of candles
 * @param startPrice Starting price
 * @param intervalSeconds Timeframe in seconds (e.g. 3600 for 1h)
 */
export function generateMockCandles(
  count: number = 300,
  startPrice: number = 2600,   // XAUT ≈ giá vàng spot USD/oz
  intervalSeconds: number = 3600
): CandleType[] {
  const candles: CandleType[] = [];
  let currentPrice = startPrice;
  const now = Math.floor(Date.now() / 1000);
  let time = now - count * intervalSeconds;
  time = Math.floor(time / intervalSeconds) * intervalSeconds;

  for (let i = 0; i < count; i++) {
    const volatility = currentPrice * 0.015;
    const change = (Math.random() - 0.48) * volatility;
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = 100 + Math.random() * 2000;

    candles.push({
      time,
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume: +volume.toFixed(2),
    });

    currentPrice = close;
    time += intervalSeconds;
  }

  return candles;
}

/**
 * Simulate a realtime tick: mutates the last candle's close/high/low.
 */
export function simulateRealtimeTick(
  lastCandle: CandleType,
  currentPrice: number
): { updatedCandle: CandleType; newPrice: number } {
  const volatility = currentPrice * 0.0015;
  const delta = (Math.random() - 0.5) * volatility;
  const newPrice = Math.max(1, currentPrice + delta);

  const updatedCandle: CandleType = {
    ...lastCandle,
    close: +newPrice.toFixed(2),
    high: +Math.max(lastCandle.high, newPrice).toFixed(2),
    low: +Math.min(lastCandle.low, newPrice).toFixed(2),
    volume: +(lastCandle.volume + Math.random() * 10).toFixed(2),
  };

  return { updatedCandle, newPrice };
}

// ─────────────────────────────────────────────
// 2. Order Execution
// ─────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface MarketOrderParams {
  symbol: string;
  side: OrderSide;
  quantity: number;
  currentPrice: number;
  balance: number;
  takeProfit?: number;
  stopLoss?: number;
}

/**
 * Execute a market order immediately at currentPrice.
 */
export function executeMarketOrder(params: MarketOrderParams): PositionType {
  const { symbol, side, quantity, currentPrice, balance, takeProfit, stopLoss } = params;
  const cost = currentPrice * quantity;

  if (cost > balance) {
    throw new Error(
      `Số dư không đủ. Cần: $${cost.toFixed(2)}, Hiện có: $${balance.toFixed(2)}`
    );
  }

  const order: OrderType = {
    id: generateId(),
    symbol,
    side,
    kind: 'MARKET',
    status: 'FILLED',
    price: 0,
    quantity,
    createdAt: Date.now(),
    filledAt: Date.now(),
    filledPrice: currentPrice,
  };

  tradingActions.adjustBalance(-cost);
  const currentHistory = tradingState$.orderHistory.get();
  tradingState$.orderHistory.set([order, ...currentHistory]);

  const position: PositionType = {
    id: generateId(),
    symbol,
    side,
    entryPrice: currentPrice,
    quantity,
    openedAt: Date.now(),
    takeProfit,
    stopLoss,
  };

  tradingActions.addPosition(position);
  return position;
}

interface LimitOrderParams {
  symbol: string;
  side: OrderSide;
  quantity: number;
  limitPrice: number;
  takeProfit?: number;
  stopLoss?: number;
}

/**
 * Place a pending limit order.
 */
export function executeLimitOrder(params: LimitOrderParams): OrderType {
  const { symbol, side, quantity, limitPrice } = params;

  const order: OrderType = {
    id: generateId(),
    symbol,
    side,
    kind: 'LIMIT',
    status: 'PENDING',
    price: limitPrice,
    quantity,
    createdAt: Date.now(),
  };

  tradingActions.addPendingOrder(order);
  return order;
}

// ─────────────────────────────────────────────
// 3. PnL Calculation
// ─────────────────────────────────────────────

export interface PnLResult {
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  totalValue: number;
}

export function calculatePnL(position: PositionType, currentPrice: number): PnLResult {
  const { side, entryPrice, quantity } = position;
  const priceDelta =
    side === 'LONG' ? currentPrice - entryPrice : entryPrice - currentPrice;

  const unrealizedPnL = priceDelta * quantity;
  const unrealizedPnLPercent = (priceDelta / entryPrice) * 100;
  const totalValue = currentPrice * quantity;

  return {
    unrealizedPnL: +unrealizedPnL.toFixed(2),
    unrealizedPnLPercent: +unrealizedPnLPercent.toFixed(2),
    totalValue: +totalValue.toFixed(2),
  };
}

/**
 * Check and auto-fill pending limit orders at current price.
 */
export function checkAndFillLimitOrders(
  pendingOrders: OrderType[],
  currentPrice: number,
  balance: number
): void {
  pendingOrders.forEach(order => {
    if (order.status !== 'PENDING') return;

    const shouldFill =
      (order.side === 'LONG' && currentPrice <= order.price) ||
      (order.side === 'SHORT' && currentPrice >= order.price);

    if (shouldFill) {
      const cost = order.price * order.quantity;
      if (cost > balance) {
        tradingActions.cancelOrder(order.id);
        return;
      }

      tradingActions.fillOrder(order.id, currentPrice);
      tradingActions.adjustBalance(-cost);

      const position: PositionType = {
        id: generateId(),
        symbol: order.symbol,
        side: order.side,
        entryPrice: currentPrice,
        quantity: order.quantity,
        openedAt: Date.now(),
      };
      tradingActions.addPosition(position);
    }
  });
}

/**
 * Close a position and return value to balance.
 */
export function closePosition(position: PositionType, currentPrice: number): void {
  const { unrealizedPnL } = calculatePnL(position, currentPrice);
  tradingActions.adjustBalance(position.entryPrice * position.quantity + unrealizedPnL);
  tradingActions.removePosition(position.id);
}

/**
 * Auto-close positions that hit TP or SL.
 */
export function checkTakeProfitStopLoss(
  positions: PositionType[],
  currentPrice: number
): void {
  positions.forEach(pos => {
    if (pos.takeProfit) {
      const hit =
        (pos.side === 'LONG' && currentPrice >= pos.takeProfit) ||
        (pos.side === 'SHORT' && currentPrice <= pos.takeProfit);
      if (hit) { closePosition(pos, currentPrice); return; }
    }
    if (pos.stopLoss) {
      const hit =
        (pos.side === 'LONG' && currentPrice <= pos.stopLoss) ||
        (pos.side === 'SHORT' && currentPrice >= pos.stopLoss);
      if (hit) closePosition(pos, currentPrice);
    }
  });
}

/**
 * Timeframe string → interval in seconds.
 */
export function timeframeToSeconds(tf: string): number {
  const map: Record<string, number> = {
    '1s': 1,
    '1m': 60,
    '1h': 3600,
    '1d': 86400,
    '1month': 2592000,
  };
  return map[tf] ?? 3600;
}
