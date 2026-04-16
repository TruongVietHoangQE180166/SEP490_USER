import type { Metadata } from 'next';
import { TradingView } from '@/modules/trading';

export const metadata: Metadata = {
  title: 'Trading Simulator | Luyện tập giao dịch Crypto',
  description:
    'Sử dụng công cụ mô phỏng giao dịch thực tế với biểu đồ TradingView. ' +
    'Học cách đọc nến, phân tích kỹ thuật và thử nghiệm chiến lược đầu tư mà không rủi ro tài chính.',
  keywords: ['mô phỏng trading', 'học trade crypto', 'tradingview simulator', 'luyện tập đầu tư'],
};

export default function TradingPage() {
  return <TradingView />;
}
