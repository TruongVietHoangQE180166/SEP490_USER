import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khóa học của tôi',
  description: 'Danh sách các khóa học bạn đã tham gia. Tiếp tục hành trình học tập và chinh phục kiến thức mới.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
