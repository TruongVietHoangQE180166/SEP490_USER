import { Metadata } from 'next';
import TeacherLayoutClient from './TeacherLayoutClient';

export const metadata: Metadata = {
  title: 'Cổng thông tin Giảng viên | Teacher',
  description: 'Giao diện dành riêng cho giảng viên tại VICTEACH.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherLayoutClient>{children}</TeacherLayoutClient>;
}
