'use client';

import { LearningView } from '@/modules/course/components/LearningView';
import { useParams } from 'next/navigation';

export default function LearnPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen bg-background">
      <LearningView id={id} />
    </div>
  );
}
