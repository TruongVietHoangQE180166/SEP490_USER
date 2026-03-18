import { ApiConfigService } from '@/services/apiConfig';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WalletInfo, WalletPnL, WalletTransaction, UserAsset, TradeOrder } from './types';

const BASE_URL = 'https://vict-beeab2c3akcqgyej.malaysiawest-01.azurewebsites.net';

interface ApiResponse<T> {
  message: { messageCode: string; messageDetail: string };
  errors: null | unknown;
  data: T;
  success: boolean;
}

export const WalletService = {
  /**
   * GET /api/v1/wallets/my-wallet?currency=USDT
   * Returns the user's wallet info for a given currency.
   */
  async getMyWallet(currency: string = 'USDT'): Promise<WalletInfo | null> {
    const response = await ApiConfigService.get<ApiResponse<WalletInfo>>(
      `/api/v1/wallets/my-wallet?currency=${currency}`
    );
    if (response?.success && response.data) {
      return response.data;
    }
    return null;
  },

  /**
   * GET /api/v1/assets/my-assets
   * Returns list of assets the user holds.
   * - quantity       = tổng số lượng đang sở hữu
   * - lockedQuantity = số lượng đang gửi bán (chờ lệnh limit khớp)
   */
  async getMyAssets(): Promise<UserAsset[]> {
    try {
      const response = await ApiConfigService.get<ApiResponse<UserAsset[]>>(
        '/api/v1/assets/my-assets'
      );
      if (response?.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch {
      return [];
    }
  },

  async getTradeOrders(page: number = 1, size: number = 1000): Promise<TradeOrder[]> {
    try {
      const field = 'createdDate';
      const direction = 'desc';
      const response = await ApiConfigService.get<ApiResponse<{ content: TradeOrder[] }>>(
        `/api/v1/trade-orders?page=${page}&size=${size}&field=${field}&direction=${direction}`
      );
      if (response?.success && response.data?.content) {
        return response.data.content;
      }
      return [];
    } catch {
      return [];
    }
  },

  async getTransactions(limit: number = 20): Promise<WalletTransaction[]> {
    try {
      const response = await ApiConfigService.get<ApiResponse<WalletTransaction[]>>(
        `/api/v1/wallets/transactions?limit=${limit}`
      );
      if (response?.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch {
      return [];
    }
  },

  async deposit(amount: number): Promise<{ success: boolean; url?: string }> {
    return await ApiConfigService.post<{ success: boolean; url?: string }>(
      '/api/v1/wallets/deposit',
      { amount }
    );
  },

  /**
   * Connect to STOMP over SockJS and subscribe to /topic/wallet/{userId}.
   * Uses @stomp/stompjs v6+ Client API.
   * Returns a cleanup function to disconnect.
   *
   * The backend pushes WalletPnL data containing:
   *  { totalBalance, dailyChange, dailyChangePercent, timestamp }
   */
  connectPnLSocket(
    userId: string,
    onMessage: (data: WalletPnL) => void,
    onConnect?: () => void,
    onDisconnect?: () => void
  ): () => void {
    const client = new Client({
      // SockJS factory — @stomp/stompjs v6 accepts a webSocketFactory
      webSocketFactory: () => new (SockJS as any)(`${BASE_URL}/ws`),
      // Silence debug logs in production
      debug: () => {},
      reconnectDelay: 5000,
      onConnect: () => {
        onConnect?.();
        client.subscribe(`/topic/wallet/${userId}`, (frame) => {
          try {
            const parsed: WalletPnL = JSON.parse(frame.body);
            onMessage(parsed);
          } catch {
            // ignore malformed frames
          }
        });
      },
      onDisconnect: () => {
        onDisconnect?.();
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  },
};
