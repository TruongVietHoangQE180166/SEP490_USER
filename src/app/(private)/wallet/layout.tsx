import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ví của tôi | Wallet',
  description: 'Quản lý số dư, nạp tiền và theo dõi lịch sử giao dịch của bạn trên VICTEACH.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
