import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xác thực tài khoản',
  description: 'Nhập mã OTP để xác thực tài khoản VICTEACH.',
};

export default function VerifyOtpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
