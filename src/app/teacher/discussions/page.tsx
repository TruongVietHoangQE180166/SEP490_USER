import { TeacherDiscussionMain } from '@/modules/teacher-discussion/components/TeacherDiscussionMain';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý Thảo luận - Teacher Dashboard',
  description: 'Trung tâm quản lý các cuộc thảo luận và hỗ trợ học viên trong các khóa học của bạn.',
};

export default function TeacherDiscussionPage() {
  return (
    <div className="h-full overflow-hidden">
      <TeacherDiscussionMain />
    </div>
  );
}
