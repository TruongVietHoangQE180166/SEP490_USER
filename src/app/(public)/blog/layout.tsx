import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Kiến thức & Tin tức',
  description: 'Cập nhật tin tức mới nhất về thị trường Crypto, phân tích chuyên sâu và các bài viết chia sẻ kinh nghiệm đầu tư từ các chuyên gia VICTEACH.',
  keywords: ['tin tức crypto', 'phân tích bitcoin', 'kiến thức đầu tư', 'blog tài chính', 'victeach blog'],
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
