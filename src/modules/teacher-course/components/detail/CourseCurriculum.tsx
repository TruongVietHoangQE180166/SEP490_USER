import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight, PlayCircle, Timer, FileText, Clapperboard, ClipboardList, Eye } from 'lucide-react';
import { itemVariants } from './constants';

interface CourseCurriculumProps {
  moocs: any[];
  expandedSections: Record<string, boolean>;
  toggleSection: (key: string) => void;
  setSelectedLesson: (lesson: any) => void;
}

export const CourseCurriculum = ({ moocs, expandedSections, toggleSection, setSelectedLesson }: CourseCurriculumProps) => {
  return (
    <motion.div variants={itemVariants} className="rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">Nội dung khoá học</h3>
          <Badge variant="secondary" className="bg-background/50">{moocs.length} Chương</Badge>
        </div>

        {moocs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground/50">
            <BookOpen className="h-12 w-12" strokeWidth={1} />
            <p className="text-sm font-medium">Khoá học chưa có nội dung</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/50 [&::-webkit-scrollbar-track]:bg-muted/20">
            {[...moocs]
              .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0))
              .map((mooc: any, mIndex: number) => {
                const key = `section-${mIndex}`;
                const isExpanded = !!expandedSections[key];
                const lessons = [
                  ...(mooc.videos || []).map((v: any) => ({ ...v, type: 'video' })),
                  ...(mooc.quizzes || []).map((q: any) => ({ ...q, type: 'quiz' })),
                  ...(mooc.documents || []).map((d: any) => ({ ...d, type: 'document' })),
                ].sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));

                return (
                  <div key={mooc.id || mIndex} className="overflow-hidden rounded-xl border border-border/30 bg-background/30">
                    <button
                      onClick={() => toggleSection(key)}
                      className="w-full p-4 text-left transition-colors hover:bg-background/50 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold flex items-center gap-2 text-foreground">
                          <span className="bg-primary/10 text-primary h-6 w-6 rounded-full flex items-center justify-center text-xs shrink-0">
                            {mIndex + 1}
                          </span>
                          {mooc.title}
                        </h4>
                        <div className="flex items-center gap-3 ml-8 mt-1">
                          {(mooc.videos?.length ?? 0) > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-foreground/50">
                              <Clapperboard className="h-3 w-3" />
                              {mooc.videos.length} Video
                            </span>
                          )}
                          {(mooc.quizzes?.length ?? 0) > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-foreground/50">
                              <ClipboardList className="h-3 w-3" />
                              {mooc.quizzes.length} Quiz
                            </span>
                          )}
                          {(mooc.documents?.length ?? 0) > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-foreground/50">
                              <FileText className="h-3 w-3" />
                              {mooc.documents.length} Tài liệu
                            </span>
                          )}
                          {lessons.length === 0 && (
                            <span className="text-[10px] text-foreground/30 font-medium">Chưa có nội dung</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-foreground/40 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    <motion.div
                      initial={false}
                      animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/20">
                        {lessons.map((lesson: any, lIdx: number) => (
                          <div
                            key={lesson.id || `${lesson.type}-${lIdx}`}
                            className="flex items-center justify-between p-4 border-b border-border/10 last:border-b-0 hover:bg-background/40 transition-colors cursor-pointer group/lesson"
                            onClick={() => setSelectedLesson(lesson)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-background/50 text-foreground/60 shrink-0 group-hover/lesson:bg-primary/10 group-hover/lesson:text-primary transition-colors">
                                {lesson.type === 'video' ? <PlayCircle className="h-4 w-4" />
                                  : lesson.type === 'quiz' ? <Timer className="h-4 w-4" />
                                  : <FileText className="h-4 w-4" />}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground group-hover/lesson:text-primary transition-colors">{lesson.title}</p>
                                <p className="text-xs text-foreground/40">
                                  {lesson.type === 'video' ? 'Video' : lesson.type === 'quiz' ? 'Bài kiểm tra' : 'Tài liệu'}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover/lesson:opacity-100 transition-opacity text-primary">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
