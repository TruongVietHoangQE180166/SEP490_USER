import { observable } from '@legendapp/state';
import { WalletState, UserAsset } from './types';

export const walletState$ = observable<WalletState>({
  walletInfo: null,
  pointDetail: null,
  assets: [],
  pnl: null,
  transactions: [],
  tradeOrders: [],
  futureOrders: [],
  paymentHistory: [],
  currentPayment: null,
  isLoading: false,
  isPnlConnected: false,
  error: null,
});

export const walletActions = {
  setAssets: (assets: UserAsset[]) => {
    walletState$.assets.set(assets);
  },
  setWalletInfo: (info: WalletState['walletInfo']) => {
    walletState$.walletInfo.set(info);
  },
  setPointDetail: (detail: WalletState['pointDetail']) => {
    walletState$.pointDetail.set(detail);
  },
  setPnl: (pnl: WalletState['pnl']) => {
    walletState$.pnl.set(pnl);
  },
  setTransactions: (transactions: WalletState['transactions']) => {
    walletState$.transactions.set(transactions);
  },
  setTradeOrders: (tradeOrders: WalletState['tradeOrders']) => {
    walletState$.tradeOrders.set(tradeOrders);
  },
  setFutureOrders: (futureOrders: WalletState['futureOrders']) => {
    walletState$.futureOrders.set(futureOrders);
  },
  setPaymentHistory: (paymentHistory: WalletState['paymentHistory']) => {
    walletState$.paymentHistory.set(paymentHistory);
  },
  setLoading: (isLoading: boolean) => {
    walletState$.isLoading.set(isLoading);
  },
  setPnlConnected: (connected: boolean) => {
    walletState$.isPnlConnected.set(connected);
  },
  setError: (error: string | null) => {
    walletState$.error.set(error);
  },
  setPayment: (payment: WalletState['currentPayment']) => {
    walletState$.currentPayment.set(payment);
  },
};
