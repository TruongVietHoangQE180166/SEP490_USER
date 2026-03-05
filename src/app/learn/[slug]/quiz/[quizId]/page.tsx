'use client';

import { QuizInterface } from '@/modules/course/components/QuizInterface';
import { useParams } from 'next/navigation';

export default function QuizPage() {
  const params = useParams();
  const slug = params.slug as string;
  const quizId = params.quizId as string;

  return (
    <div className="min-h-screen bg-background">
      <QuizInterface quizId={quizId} slug={slug} />
    </div>
  );
}
