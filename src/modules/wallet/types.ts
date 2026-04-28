export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | 'PAYMENT' | 'REFUND';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
import { FutureOrderType } from '@/modules/trading/types';

// --- Wallet Info from REST API ---
export interface WalletInfo {
  id: string;
  userId: string;
  username: string;
  email: string;
  currency: string;
  availableBalance: number;
  lockedBalance: number;
  createdDate: string;
}

// --- PnL data pushed by WebSocket ---
export interface WalletPnL {
  totalBalance: number;
  dailyChange: number;
  dailyChangePercent: number;
  timestamp: string;
}

// --- User Asset (XAUT holdings) from /api/v1/assets/my-assets ---
export interface UserAsset {
  id: string;
  userId: string;
  username: string;
  email: string;
  assetSymbol: string;
  /** Tổng số lượng đang sở hữu */
  quantity: number;
  /** Số lượng đang gửi bán (đang lock chờ lệnh limit khớp) */
  lockedQuantity: number;
  createdDate: string;
}

// --- Transaction ---
export interface WalletTransaction {
  id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  timestamp: string;
  referenceId?: string;
}

// --- Trade Order (Gold Trading) ---
export interface TradeOrder {
  id: string;
  userId: string;
  username: string;
  email: string;
  symbol: string;
  currency: string;
  type: 'BUY' | 'SELL';
  category: 'LIMIT' | 'MARKET';
  limitPrice: number | null;
  quantity: number;
  totalMoney: number | null;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  avgPrice: number | null;
  closePrice: number | null;
  takeProfit: number | null;
  stopLoss: number | null;
  changeBalance: number | null;
  changePercent: number | null;
  createdDate: string;
  completed: boolean;
}

export interface PointDetail {
  id: string;
  userId: string;
  email: string;
  currentPoints: number;
}

export interface PointDetailApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: PointDetail;
  success: boolean;
}

export interface PaymentInfo {
  id: string;
  amount: number;
  courseId: string | null;
  courseTitle: string | null;
  thumbnailUrl: string | null;
  voucherCode: string | null;
  discountValue: number | null;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  qrCode: string;
  createdDate: string;
}

export interface PaymentApiResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: any;
  data: PaymentInfo;
  success: boolean;
}

// --- Store State ---
export interface WalletState {
  walletInfo: WalletInfo | null;
  pointDetail: PointDetail | null;
  assets: UserAsset[];
  pnl: WalletPnL | null;
  transactions: WalletTransaction[];
  tradeOrders: TradeOrder[];
  futureOrders: FutureOrderType[];
  paymentHistory: PaymentInfo[];
  currentPayment: PaymentInfo | null;
  isLoading: boolean;
  isPnlConnected: boolean;
  error: string | null;
}
