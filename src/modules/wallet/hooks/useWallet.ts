'use client';

import { useEffect, useCallback } from 'react';
import { walletActions, walletState$ } from '../store';
import { WalletService } from '../services';
import { tradingState$ } from '@/modules/trading/store';
import { useRealtimeFeed } from '@/modules/trading/hooks/useRealtimeFeed';

const CURRENCY = 'USDT';

export function useWallet() {
  const walletInfo = walletState$.walletInfo.get();
  const assets = walletState$.assets.get();
  const transactions = walletState$.transactions.get();
  const tradeOrders = walletState$.tradeOrders.get();
  const isLoading = walletState$.isLoading.get();
  const error = walletState$.error.get();

  // ─── Realtime wallet data từ socket của Trading module ────────────
  // Socket /topic/trading/{userId} đẩy data vào tradingState$.wallet
  // gồm: originalWalletBalance, totalEquity, dailyPnl, dailyPnlPercent
  const originalWalletBalance = tradingState$.wallet.originalWalletBalance.get() ?? 0;
  const totalEquity           = tradingState$.wallet.totalEquity.get()           ?? 0;
  const dailyPnl              = tradingState$.wallet.dailyPnl.get()              ?? 0;
  const dailyPnlPercent       = tradingState$.wallet.dailyPnlPercent.get()       ?? 0;

  // ─── Kết nối socket trading để nhận realtime PnL ─────────────────
  const { start: startTradingSocket, stop: stopTradingSocket } = useRealtimeFeed();

  // ------------------------------------------------------------------ //
  // Fetch wallet info from REST API
  // ------------------------------------------------------------------ //
  const fetchWalletInfo = useCallback(async () => {
    if (walletState$.isLoading.peek()) return;

    walletActions.setLoading(true);
    walletActions.setError(null);
    try {
      const settleAll = await Promise.allSettled([
        WalletService.getMyWallet(CURRENCY),
        WalletService.getMyAssets(),
        WalletService.getTransactions(),
        WalletService.getTradeOrders(),
      ]);

      if (settleAll[0].status === 'fulfilled') walletActions.setWalletInfo(settleAll[0].value);
      if (settleAll[1].status === 'fulfilled') walletActions.setAssets(settleAll[1].value);
      if (settleAll[2].status === 'fulfilled') walletActions.setTransactions(settleAll[2].value);
      if (settleAll[3].status === 'fulfilled') walletActions.setTradeOrders(settleAll[3].value);

      if (settleAll[0].status === 'rejected' && settleAll[1].status === 'rejected') {
        throw new Error('Không thể tải thông tin ví');
      }
    } catch (err: any) {
      walletActions.setError(err.message || 'Lỗi khi tải dữ liệu');
    } finally {
      walletActions.setLoading(false);
    }
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
  const availableBalance   = walletInfo?.availableBalance ?? 0;
  const lockedBalance      = walletInfo?.lockedBalance    ?? 0;
  // totalEquity = tổng giá trị tài sản (XAUT + USDT) từ socket trading
  const totalDisplayBalance = totalEquity || (availableBalance + originalWalletBalance);

  // ------------------------------------------------------------------ //
  // Effects
  // ------------------------------------------------------------------ //
  useEffect(() => {
    fetchWalletInfo();
    // Khởi động socket trading để nhận realtime PnL (nếu chưa chạy)
    startTradingSocket();

    return () => {
      stopTradingSocket();
    };
  }, [fetchWalletInfo, startTradingSocket, stopTradingSocket]);

  return {
    walletInfo,
    assets,
    transactions,
    tradeOrders,
    isLoading,
    error,
    // Realtime PnL từ trading socket
    originalWalletBalance,
    totalEquity,
    dailyPnl,
    dailyPnlPercent,
    // Derived
    availableBalance,
    lockedBalance,
    totalDisplayBalance,
    // Actions
    fetchWalletInfo,
    handleDeposit,
  };
}

