import { observable } from '@legendapp/state';
import { WalletState, UserAsset } from './types';

export const walletState$ = observable<WalletState>({
  walletInfo: null,
  assets: [],
  pnl: null,
  transactions: [],
  tradeOrders: [],
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
  setPnl: (pnl: WalletState['pnl']) => {
    walletState$.pnl.set(pnl);
  },
  setTransactions: (transactions: WalletState['transactions']) => {
    walletState$.transactions.set(transactions);
  },
  setTradeOrders: (tradeOrders: WalletState['tradeOrders']) => {
    walletState$.tradeOrders.set(tradeOrders);
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
};
