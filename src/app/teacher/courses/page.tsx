import { TeacherCourseModule } from '@/modules/teacher-course';

export const metadata = {
  title: 'Khoá học của tôi | VICTEACH Teacher',
  description: 'Quản lý các khoá học do bạn tạo trên hệ thống VICTEACH',
};

export default function TeacherCoursesPage() {
  return <TeacherCourseModule />;
}
