'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { AdminCourseDetailPage } from '@/modules/manage-course/components/CourseDetailPanel';

export default function AdminCourseDetailRoute() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  return (
    <AdminCourseDetailPage
      slug={slug}
      onBack={() => router.push('/admin/courses')}
    />
  );
}
