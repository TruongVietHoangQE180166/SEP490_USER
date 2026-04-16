import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản',
  description: 'Tham gia cộng đồng VICTEACH ngay hôm nay để tiếp cận những khóa học tài chính chất lượng nhất.',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
