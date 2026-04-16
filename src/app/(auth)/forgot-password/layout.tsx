import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quên mật khẩu',
  description: 'Lấy lại mật khẩu tài khoản VICTEACH của bạn.',
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
