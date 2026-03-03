import { useState, useEffect } from 'react';
import { courseService } from '../services';
import { courseActions, courseState$ } from '../store';
import { toast } from '@/components/ui/toast';
import { Question } from '../types';

/**
 * Hook to fetch and manage quiz questions for a specific quiz.
 * Integrates with the global course store.
 */
export const useQuizQuestions = (quizId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quizQuestions = courseState$.quizQuestions.get();

  useEffect(() => {
    if (quizId) {
      loadQuizQuestions(quizId);
    } else {
      courseActions.setQuizQuestions([]);
    }
  }, [quizId]);

  const loadQuizQuestions = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const questions = await courseService.getQuizQuestions(id);
      courseActions.setQuizQuestions(questions);
    } catch (err: any) {
      const message = err.message || 'Không thể tải câu hỏi của bài kiểm tra';
      setError(message);
      toast.error(message);
      courseActions.setQuizQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    questions: quizQuestions,
    isLoading,
    error,
    refresh: () => quizId && loadQuizQuestions(quizId)
  };
};
