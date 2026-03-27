import { observable } from '@legendapp/state';
import { TradingState, CandleType, PositionType, ClosedPositionType, OrderType, FutureOrderType, ReplaySpeed, Timeframe } from './types';

const initialTradingState: TradingState = {
  currentSymbol: 'BTC/USDT',
  timeframe: '1h',
  balance: 10000,
  wallet: {
    availableBalance: 10000,
    lockedBalance: 0,
    goldBalance: 0,
    lockedGoldBalance: 0,
  },
  currentPrice: 0,
  previousPrice: 0,
  basePrice24h: 0,
  marketTicker: {
    indexPrice: 0,
    markPrice: 0,
    tetherGoldPrice: 0,
    high24h: 0,
    low24h: 0,
    vol24h: 0,
    value24h: 0,
    change24h: 0,
    change24hPct: 0,
  },
  chartData: [],
  openPositions: [],
  closedPositions: [],
  pendingOrders: [],
  pendingFutureOrders: [],
  orderHistory: [],
  replayState: {
    isActive: false,
    isPlaying: false,
    currentIndex: 0,
    speed: 1,
  },
  isRealtimeActive: true,
  isChartLoading: false,
};

export const tradingState$ = observable<TradingState>(initialTradingState);

export const tradingActions = {
  // ─── Loading ──────────────────────────────────────────────
  setIsChartLoading: (loading: boolean) => {
    tradingState$.isChartLoading.set(loading);
  },
  // ─── Symbol / Timeframe ───────────────────────────────────
  setSymbol: (symbol: string) => {
    tradingState$.currentSymbol.set(symbol);
  },

  setTimeframe: (tf: Timeframe) => {
    tradingState$.timeframe.set(tf);
  },

  // ─── Price / Ticker / Chart ────────────────────────────────
  setCurrentPrice: (price: number) => {
    const current = tradingState$.currentPrice.get();
    if (current !== price) {
      tradingState$.previousPrice.set(current);
      tradingState$.currentPrice.set(price);
    }
  },

  setMarketTicker: (ticker: Partial<any>) => {
    tradingState$.marketTicker.set({
      ...tradingState$.marketTicker.get(),
      ...ticker
    } as any);
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
    const last = current[current.length - 1];
    // Bail out early if nothing actually changed
    if (
      last &&
      last.time === candle.time &&
      last.open === candle.open &&
      last.high === candle.high &&
      last.low === candle.low &&
      last.close === candle.close &&
      last.volume === candle.volume
    ) return;
    const updated = [...current];
    updated[updated.length - 1] = candle;
    tradingState$.chartData.set(updated);
  },

  // ─── Balance / Wallet ────────────────────────────────────
  setWalletData: (data: Partial<TradingState['wallet']>) => {
    const current = tradingState$.wallet.get();
    const newData = { ...current, ...data };
    tradingState$.wallet.set(newData);
    // Sync main balance convenience field
    tradingState$.balance.set(newData.availableBalance);
  },

  setBalance: (balance: number) => {
    tradingState$.balance.set(balance);
    tradingState$.wallet.availableBalance.set(balance);
  },

  adjustBalance: (delta: number) => {
    const current = tradingState$.balance.get();
    const next = Math.max(0, current + delta);
    tradingState$.balance.set(next);
    tradingState$.wallet.availableBalance.set(next);
  },

  refreshWalletData: async () => {
    try {
      const { WalletService } = await import('../wallet/services');
      const [wallet, assets] = await Promise.all([
        WalletService.getMyWallet('USDT'),
        WalletService.getMyAssets()
      ]);
      
      if (wallet) {
        tradingActions.setWalletData({
          availableBalance: wallet.availableBalance,
          lockedBalance: wallet.lockedBalance,
        });
      }
      
      const goldAsset = assets.find(a => a.assetSymbol === 'XAUT');
      if (goldAsset) {
        tradingActions.setWalletData({
          goldBalance: goldAsset.quantity,
          lockedGoldBalance: goldAsset.lockedQuantity,
        });
      }
    } catch (err) {
      console.warn('[TradingStore] Failed to refresh wallet data', err);
    }
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

  closePosition: async (positionId: string, exitPrice: number) => {
    try {
      const { closeFuturePosition } = await import('./services');
      const res = await closeFuturePosition(positionId);
      
      if (res && res.success && res.data) {
        const current = tradingState$.openPositions.get();
        const pos = current.find(p => p.id === positionId);
        
        const data = res.data;
        const realExitPrice = data.closePrice || exitPrice || data.entryPrice;
        const pnl = data.realizedPnl || 0;

        if (pos) {
          const closedPos = {
            ...pos,
            exitPrice: realExitPrice,
            closedAt: new Date(data.createdDate).getTime() || Date.now(),
            pnl,
          };

          tradingState$.openPositions.set(current.filter(p => p.id !== positionId));
          const history = tradingState$.closedPositions.get();
          tradingState$.closedPositions.set([closedPos, ...history]);
        }
        
        // Cân bằng tài sản & refresh list lệnh if any
        tradingActions.refreshWalletData();
        return { success: true, message: res.message?.messageDetail || 'Đóng vị thế thành công' };
      }
      
      return { success: false, message: res?.message?.messageDetail || 'Đóng vị thế thất bại' };
    } catch (error: any) {
      console.error('Lỗi khi close position:', error);
      return { success: false, message: error?.message || 'Lỗi gọi API đóng vị thế' };
    }
  },

  // ─── Orders ───────────────────────────────────────────────
  fetchAndSetOrders: async () => {
    // Need to dynamically import to prevent cyclic dependency on store -> services -> store
    const { fetchTradeOrders, fetchMyFuturePositions } = await import('./services');
    
    // Fetch Spot & Future
    const [orders, futures] = await Promise.all([
      fetchTradeOrders(1, 1000, 'createdDate', 'desc'),
      fetchMyFuturePositions(1, 1000, 'createdDate', 'desc')
    ]);
    
    // 1. Chờ khớp/Lịch sử (Spot Orders)
    const spotPending = orders.filter(o => o.status === 'PENDING');
    const spotHistory = orders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED');
    
    // 2. Phân loại Future
    const futurePending = futures.filter(f => f.status === 'PENDING');
    const futureOpen = futures.filter(f => f.status === 'OPEN');
    // Lịch sử vị thế (Future Positions đã đóng, hủy hoặc thanh lý)
    const futureHistory = futures.filter(f => f.status === 'CLOSED' || f.status === 'CANCELLED' || f.status === 'LIQUIDATED');

    // 3. Mapping Future -> UI Types
    const mappedPendingFutures: OrderType[] = futurePending.map(f => ({
      id: f.id, userId: f.userId, username: f.username, email: f.email, symbol: f.symbol, currency: f.currency,
      type: f.side === 'LONG' ? 'BUY' : 'SELL',
      category: f.orderCategory,
      limitPrice: f.entryPrice,
      quantity: f.quantity,
      totalMoney: f.margin,
      status: 'PENDING',
      avgPrice: null, closePrice: 0, takeProfit: f.takeProfit, stopLoss: f.stopLoss,
      changeBalance: null, changePercent: null, createdDate: f.createdDate, completed: false
    }));

    const mappedOpenPositions: PositionType[] = futureOpen.map(f => ({
      id: f.id, symbol: f.symbol, side: f.side, entryPrice: f.entryPrice, quantity: f.quantity,
      openedAt: new Date(f.createdDate).getTime(),
      takeProfit: f.takeProfit ?? undefined,
      stopLoss: f.stopLoss ?? undefined,
      margin: f.margin, leverage: f.leverage, liquidationPrice: f.liquidationPrice ?? undefined
    }));

    const mappedClosedPositions: ClosedPositionType[] = futureHistory.map(f => ({
      id: f.id, symbol: f.symbol, side: f.side, entryPrice: f.entryPrice, quantity: f.quantity,
      openedAt: new Date(f.createdDate).getTime(),
      takeProfit: f.takeProfit ?? undefined,
      stopLoss: f.stopLoss ?? undefined,
      margin: f.margin, leverage: f.leverage, liquidationPrice: f.liquidationPrice ?? undefined,
      exitPrice: f.closePrice || f.entryPrice,
      closedAt: new Date(f.createdDate).getTime(),
      pnl: f.realizedPnl || 0,
      status: f.status,
      orderCategory: f.orderCategory,
      positionValue: f.positionValue,
      currency: f.currency
    }));

    // 4. Cập nhật Store
    tradingState$.pendingOrders.set(spotPending); // Trình diễn mỗi spot ở đây cho Clear
    tradingState$.pendingFutureOrders.set(futurePending); 
    tradingState$.orderHistory.set(spotHistory);
    tradingState$.openPositions.set(mappedOpenPositions);
    tradingState$.closedPositions.set(mappedClosedPositions);
  },

  // Local mockup actions removed.
  // We rely on fetchAndSetOrders or websocket events to update pending and filled orders.

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
