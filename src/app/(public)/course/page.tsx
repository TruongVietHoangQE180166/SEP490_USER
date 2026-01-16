'use client';

import { CourseListing } from '@/modules/course/components/CourseListing';

export default function CoursePage() {
  return (
    <div className="min-h-screen bg-background pt-8 pb-10">
      <CourseListing />
    </div>
  );
}
