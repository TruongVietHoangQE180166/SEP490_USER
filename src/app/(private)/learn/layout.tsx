import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Học tập | Learn',
  description: 'Giao diện học tập trực tuyến, bài học và video hướng dẫn chuyên sâu.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
