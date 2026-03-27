import { CandleType, OrderType, PositionType, OrderSide, PlaceOrderRequest, PlaceFutureOrderRequest, FutureOrderType } from './types';
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

export async function fetchTradeOrders(page = 1, size = 1000, field = 'createdDate', direction = 'desc') {
  try {
    const response = await ApiConfigService.get<{
      data?: {
        content: OrderType[];
      }
    }>(`/api/v1/trade-orders?page=${page}&size=${size}&field=${field}&direction=${direction}`);
    return response?.data?.content || [];
  } catch (error) {
    console.error('Lỗi lấy danh sách order:', error);
    return [];
  }
}

export async function cancelTradeOrder(orderId: string) {
  try {
    const response = await ApiConfigService.delete<{
      message?: { messageDetail: string };
      success: boolean;
    }>(`/api/v1/trade-orders/${orderId}/cancel`);
    return response;
  } catch (error) {
    console.error('Lỗi hủy lệnh:', error);
    throw error;
  }
}

export async function placeTradeOrder(params: PlaceOrderRequest) {
  try {
    const response = await ApiConfigService.post<{
      message?: { messageCode: string; messageDetail: string };
      success: boolean;
      data?: OrderType;
      errors?: Array<{ field: string; message: string }>;
    }>(`/api/v1/trade-orders/place`, params);
    
    return response;
  } catch (error) {
    console.error('Lỗi đặt lệnh:', error);
    throw error;
  }
}

export async function placeFutureOrder(params: PlaceFutureOrderRequest) {
  try {
    const response = await ApiConfigService.post<{
      message?: { messageCode: string; messageDetail: string };
      success: boolean;
      data?: FutureOrderType;
      errors?: Array<{ field: string; message: string }> | null;
    }>(`/api/v1/futures`, params);
    
    return response;
  } catch (error) {
    console.error('Lỗi đặt lệnh Future:', error);
    throw error;
  }
}

export async function closeFuturePosition(futureId: string) {
  try {
    const response = await ApiConfigService.post<{
      message?: { messageCode: string; messageDetail: string };
      success: boolean;
      data?: FutureOrderType;
    }>(`/api/v1/futures/${futureId}/close`);
    return response;
  } catch (error) {
    console.error('Lỗi đóng vị thế Future:', error);
    throw error;
  }
}

export async function fetchMyFuturePositions(page = 1, size = 1000, field = 'createdDate', direction = 'desc') {
  try {
    const response = await ApiConfigService.get<{
      data?: {
        content: FutureOrderType[];
        totalElement?: number;
      };
      success?: boolean;
    }>(`/api/v1/futures/my-positions?page=${page}&size=${size}&field=${field}&direction=${direction}`);
    return response?.data?.content || [];
  } catch (error) {
    console.error('Lỗi lấy lịch sử vị thế Future:', error);
    return [];
  }
}

export async function cancelFutureOrder(futureId: string) {
  try {
    const response = await ApiConfigService.delete<{
      message?: { messageDetail: string };
      success: boolean;
    }>(`/api/v1/futures/${futureId}/cancel`);
    return response;
  } catch (error) {
    console.error('Lỗi hủy lệnh Future:', error);
    throw error;
  }
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

// (Backend handles limit orders and TP/SL execution)

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
