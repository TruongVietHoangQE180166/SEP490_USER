'use client';

import { CourseDetail } from '@/modules/course/components/CourseDetail';

export function CourseDetailWrapper({ slug }: { slug: string }) {
  return <CourseDetail slug={slug} />;
}
