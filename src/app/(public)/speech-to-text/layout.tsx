import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chuyển đổi Giọng nói thành Văn bản',
  description: 'Công cụ AI hỗ trợ chuyển đổi video bài giảng và âm thanh thành văn bản tự động, giúp tối ưu hóa việc học tập tại VICTEACH.',
  keywords: ['speech to text', 'chuyển đổi giọng nói', 'tự động ghi chép', 'công cụ học tập AI'],
};

export default function SpeechToTextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
