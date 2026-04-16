import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thanh toán khóa học',
  description: 'Hoàn tất thanh toán để truy cập ngay vào các kiến thức chuyên sâu tại VICTEACH.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
