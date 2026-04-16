import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tài liệu hướng dẫn',
  description: 'Hướng dẫn sử dụng nền tảng VICTEACH, các câu hỏi thường gặp và tài liệu hỗ trợ cho học viên và giảng viên.',
  keywords: ['hướng dẫn sử dụng', 'faq', 'tài liệu victeach', 'trợ giúp'],
};

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
