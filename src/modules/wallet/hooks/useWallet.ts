'use client';

import { useEffect, useCallback } from 'react';
import { walletActions, walletState$ } from '../store';
import { WalletService } from '../services';
import { tradingState$ } from '@/modules/trading/store';
import { useRealtimeFeed } from '@/modules/trading/hooks/useRealtimeFeed';

const CURRENCY = 'USDT';

export function useWallet() {
  const walletInfo = walletState$.walletInfo.get();
  const pointDetail = walletState$.pointDetail.get();
  const assets = walletState$.assets.get();
  const transactions = walletState$.transactions.get();
  const tradeOrders = walletState$.tradeOrders.get();
  const futureOrders = walletState$.futureOrders.get();
  const paymentHistory = walletState$.paymentHistory.get();
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
        WalletService.getFutureOrders(),
        WalletService.getPointDetail(),
        WalletService.getPaymentHistory(),
      ]);

      if (settleAll[0].status === 'fulfilled') walletActions.setWalletInfo(settleAll[0].value);
      if (settleAll[1].status === 'fulfilled') walletActions.setAssets(settleAll[1].value);
      if (settleAll[2].status === 'fulfilled') walletActions.setTransactions(settleAll[2].value);
      if (settleAll[3].status === 'fulfilled') walletActions.setTradeOrders(settleAll[3].value);
      if (settleAll[4].status === 'fulfilled') walletActions.setFutureOrders(settleAll[4].value);
      if (settleAll[5].status === 'fulfilled') walletActions.setPointDetail(settleAll[5].value);
      if (settleAll[6].status === 'fulfilled') walletActions.setPaymentHistory(settleAll[6].value);

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

  const createTopUp = async (amount: number) => {
    walletActions.setLoading(true);
    walletActions.setError(null);
    try {
      const payment = await WalletService.createTopUpPayment(amount);
      walletActions.setPayment(payment);
      return { success: true, data: payment };
    } catch (err: any) {
      const errorMessage = err.message || 'Lỗi khi tạo yêu cầu nạp tiền';
      walletActions.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      walletActions.setLoading(false);
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    try {
      const detail = await WalletService.getPaymentDetail(paymentId);
      if (detail) {
        walletActions.setPayment(detail);
        return detail;
      }
      return null;
    } catch (err) {
      console.error('Error checking payment status:', err);
      return null;
    }
  };

  const cancelPayment = () => {
    walletActions.setPayment(null);
    walletActions.setError(null);
  };

  const handleExchangePoints = async (amount: number) => {
    try {
      const response = await WalletService.exchangePoints(amount);
      if (response.success) {
        // Refresh wallet and point details after successful exchange
        await fetchWalletInfo();
        return true;
      }
      return false;
    } catch (err: any) {
      walletActions.setError(err.message || 'Lỗi khi đổi điểm');
      return false;
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
    pointDetail,
    assets,
    transactions,
    tradeOrders,
    futureOrders,
    paymentHistory,
    currentPayment: walletState$.currentPayment.get(),
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
    handleExchangePoints,
    createTopUp,
    checkPaymentStatus,
    cancelPayment,
  };
}
