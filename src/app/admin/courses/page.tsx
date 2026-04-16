import { ManageCourseModule } from '@/modules/manage-course';

export const metadata = {
  title: 'Quản lý khoá học | VIC Admin',
  description: 'Quản lý toàn bộ khoá học trong hệ thống VICTEACH',
};

export default function AdminCoursesPage() {
  return <ManageCourseModule />;
}
