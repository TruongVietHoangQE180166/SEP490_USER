import { TeacherCourseModule } from '@/modules/teacher-course';

export const metadata = {
  title: 'Khoá học của tôi | VIC Teacher',
  description: 'Quản lý các khoá học do bạn tạo trên hệ thống VIC Teach',
};

export default function TeacherCoursesPage() {
  return <TeacherCourseModule />;
}
