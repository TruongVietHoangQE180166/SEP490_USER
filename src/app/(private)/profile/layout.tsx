import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hồ sơ cá nhân',
  description: 'Cập nhật thông tin cá nhân, theo dõi tiến độ học tập và tùy chỉnh tài khoản của bạn.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
