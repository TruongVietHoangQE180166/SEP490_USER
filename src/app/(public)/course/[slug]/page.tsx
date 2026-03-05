'use client';

import { CourseDetail } from '@/modules/course/components/CourseDetail';
import { useParams } from 'next/navigation';

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return <CourseDetail slug={slug} />;
}
