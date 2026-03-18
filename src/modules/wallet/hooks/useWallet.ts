'use client';

import { useEffect, useCallback, useRef } from 'react';
import { walletActions, walletState$ } from '../store';
import { WalletService } from '../services';

const CURRENCY = 'USDT';

export function useWallet() {
  const walletInfo = walletState$.walletInfo.get();
  const assets = walletState$.assets.get();
  const pnl = walletState$.pnl.get();
  const transactions = walletState$.transactions.get();
  const tradeOrders = walletState$.tradeOrders.get();
  const isLoading = walletState$.isLoading.get();
  const isPnlConnected = walletState$.isPnlConnected.get();
  const error = walletState$.error.get();

  const cleanupSocketRef = useRef<(() => void) | null>(null);

  // ------------------------------------------------------------------ //
  // Fetch wallet info from REST API
  // ------------------------------------------------------------------ //
  const fetchWalletInfo = useCallback(async () => {
    walletActions.setLoading(true);
    walletActions.setError(null);
    try {
      const [info, assetList, txs, orders] = await Promise.all([
        WalletService.getMyWallet(CURRENCY),
        WalletService.getMyAssets(),
        WalletService.getTransactions(),
        WalletService.getTradeOrders(),
      ]);
      walletActions.setWalletInfo(info);
      walletActions.setAssets(assetList);
      walletActions.setTransactions(txs);
      walletActions.setTradeOrders(orders);
    } catch (err: any) {
      walletActions.setError(err.message || 'Không thể tải dữ liệu ví');
    } finally {
      walletActions.setLoading(false);
    }
  }, []);

  // ------------------------------------------------------------------ //
  // Connect to WebSocket PnL stream
  // ------------------------------------------------------------------ //
  const connectPnL = useCallback(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!userId) return;

    // Disconnect any previous socket first
    cleanupSocketRef.current?.();

    cleanupSocketRef.current = WalletService.connectPnLSocket(
      userId,
      (data) => {
        walletActions.setPnl(data);
      },
      () => walletActions.setPnlConnected(true),
      () => walletActions.setPnlConnected(false),
    );
  }, []);

  // ------------------------------------------------------------------ //
  // Actions
  // ------------------------------------------------------------------ //
  const handleDeposit = async (amount: number) => {
    try {
      const response = await WalletService.deposit(amount);
      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (err: any) {
      walletActions.setError(err.message || 'Lỗi khi nạp tiền');
    }
  };

  // ------------------------------------------------------------------ //
  // Derived Values
  // ------------------------------------------------------------------ //
  /**
   * Tổng tài sản hiển thị:
   *   - availableBalance  = số USDT khả dụng (gọi từ API)
   *   - lockedBalance     = USDT đang bị lock cho lệnh limit
   *   - pnl.totalBalance  = tổng giá trị XAUT tính ra USDT theo giá hiện tại (socket)
   *
   * Tổng hiển thị trên card chính = availableBalance + pnl.totalBalance
   * (lockedBalance hiển thị riêng để user biết đang bị giữ bao nhiêu)
   */
  const availableBalance = walletInfo?.availableBalance ?? 0;
  const lockedBalance = walletInfo?.lockedBalance ?? 0;
  const xautValue = pnl?.totalBalance ?? 0;
  const totalDisplayBalance = availableBalance + xautValue;

  // ------------------------------------------------------------------ //
  // Effects
  // ------------------------------------------------------------------ //
  useEffect(() => {
    fetchWalletInfo();
    connectPnL();

    return () => {
      cleanupSocketRef.current?.();
    };
  }, [fetchWalletInfo, connectPnL]);

  return {
    walletInfo,
    assets,
    pnl,
    transactions,
    tradeOrders,
    isLoading,
    isPnlConnected,
    error,
    // Derived
    availableBalance,
    lockedBalance,
    xautValue,
    totalDisplayBalance,
    // Actions
    fetchWalletInfo,
    handleDeposit,
  };
}
