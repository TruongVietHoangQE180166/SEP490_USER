'use client';

import { observer } from '@legendapp/state/react';
import { Lesson } from '../types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

export const LessonContent = ({ lesson }: { lesson: Lesson }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  if (lesson.type === 'video') {
    return (
      <div className="space-y-6">
        <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <Button variant="outline" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Đánh dấu hoàn thành
          </Button>
        </div>
      </div>
    );
  }

  if (lesson.type === 'document') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-8 px-6 bg-card rounded-3xl border border-border/50 shadow-sm">
        <h1 className="text-3xl font-black text-primary">{lesson.title}</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-black" 
             dangerouslySetInnerHTML={{ __html: lesson.content || '' }} 
        />
        <div className="pt-10 border-t border-border/50 flex justify-center">
            <Button size="lg" className="rounded-full px-12 font-bold transition-all hover:scale-105">
                Tôi đã đọc xong tài liệu
            </Button>
        </div>
      </div>
    );
  }

  if (lesson.type === 'quiz') {
    return (
      <div className="max-w-3xl mx-auto space-y-10 py-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black">{lesson.title}</h1>
          <p className="text-muted-foreground font-medium">Chọn câu trả lời đúng nhất cho các câu hỏi dưới đây.</p>
        </div>

        <div className="space-y-8">
          {lesson.quiz?.map((q, qIndex) => (
            <div key={q.id} className="bg-card border border-border/50 rounded-3xl p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold flex gap-4">
                <span className="text-primary">Câu {qIndex + 1}:</span>
                {q.question}
              </h2>
              <div className="grid gap-4">
                {q.options.map((opt, oIndex) => {
                  const isSelected = selectedAnswer[q.id] === oIndex;
                  const isCorrect = showResult && oIndex === q.correctAnswer;
                  const isWrong = showResult && isSelected && oIndex !== q.correctAnswer;

                  return (
                    <button
                      key={oIndex}
                      onClick={() => !showResult && setSelectedAnswer(prev => ({ ...prev, [q.id]: oIndex }))}
                      className={`
                        flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all font-medium
                        ${isSelected ? 'border-primary bg-primary/5' : 'border-border/50 hover:bg-muted/50'}
                        ${isCorrect ? 'border-green-500 bg-green-50 text-green-700' : ''}
                        ${isWrong ? 'border-red-500 bg-red-50 text-red-700' : ''}
                      `}
                    >
                      <div className={`
                        h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${isSelected ? 'border-primary bg-primary' : 'border-border/50'}
                        ${isCorrect ? 'border-green-500 bg-green-500' : ''}
                        ${isWrong ? 'border-red-500 bg-red-500' : ''}
                      `}>
                        {(isSelected || isCorrect || isWrong) && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-6">
          {!showResult ? (
            <Button 
                size="lg" 
                className="rounded-xl px-12 font-black h-14 text-lg"
                onClick={() => setShowResult(true)}
            >
              Nộp bài kiểm tra
            </Button>
          ) : (
            <Button 
                size="lg" 
                variant="outline"
                className="rounded-xl px-12 font-black h-14 text-lg"
                onClick={() => {setShowResult(false); setSelectedAnswer({});}}
            >
              Làm lại bài kiểm tra
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
};
