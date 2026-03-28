'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { TeacherCourseDetailPanel } from '@/modules/teacher-course/components/TeacherCourseDetailPanel';

export default function TeacherCourseDetailRoute() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  return (
    <TeacherCourseDetailPanel
      courseId={id}
      onBack={() => router.push('/teacher/courses')}
    />
  );
}
