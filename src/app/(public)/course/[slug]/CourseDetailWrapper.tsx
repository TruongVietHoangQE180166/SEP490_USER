'use client';

import { CourseDetail } from '@/modules/course/components/CourseDetail';
import { Course } from '@/modules/course/types';

export function CourseDetailWrapper({ slug, initialData }: { slug: string, initialData?: Course | null }) {
  return <CourseDetail slug={slug} initialData={initialData} />;
}
