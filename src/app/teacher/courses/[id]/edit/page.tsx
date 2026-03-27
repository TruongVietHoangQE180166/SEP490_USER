'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
// Using relative path to be absolutely sure about the location during compilation
import { TeacherCourseEditPanel } from '../../../../../modules/teacher-course/components/TeacherCourseEditPanel';

export default function TeacherCourseEditRoute() {
  const router = useRouter();
  const params = useParams();
  
  // Robust ID extraction
  const id = typeof params?.id === 'string' ? params.id : '';

  if (!id) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p className="text-muted-foreground font-bold">Không tìm thấy mã khóa học...</p>
        </div>
    );
  }

  return (
    <TeacherCourseEditPanel
      courseId={id}
      onBack={() => router.push('/teacher/courses')}
    />
  );
}
