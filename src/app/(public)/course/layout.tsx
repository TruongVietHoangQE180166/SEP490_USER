import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách khóa học',
  description: 'Khám phá các khóa học chất lượng cao về đầu tư, trading và blockchain tại VICTEACH. Từ cơ bản đến nâng cao cho mọi đối tượng.',
  keywords: ['khóa học crypto', 'học đầu tư', 'khóa học trading', 'blockchain tutorial', 'victeach courses'],
};

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
