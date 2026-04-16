import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description: 'Tìm hiểu về sứ mệnh và tầm nhìn của VICTEACH - Nền tảng giáo dục tài chính số hàng đầu, giúp mọi người tiếp cận kiến thức đầu tư một cách bài bản nhất.',
  keywords: ['về victeach', 'đội ngũ victeach', 'tầm nhìn victeach', 'giáo dục tài chính'],
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
