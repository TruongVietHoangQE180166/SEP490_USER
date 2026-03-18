import type { Metadata } from 'next';
import { TradingView } from '@/modules/trading';

export const metadata: Metadata = {
  title: 'Trading Simulator | Mô phỏng giao dịch Crypto',
  description:
    'Màn hình mô phỏng giao dịch crypto với TradingView Lightweight Charts. ' +
    'Luyện tập chiến lược trading với dữ liệu mock realtime và replay mode.',
};

export default function TradingPage() {
  return <TradingView />;
}
