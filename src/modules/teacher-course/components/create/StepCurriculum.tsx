import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Video, FileText, ListChecks, UploadCloud, ChevronDown, ChevronUp, Clock, Target, GripVertical, BookPlus, Sparkles } from 'lucide-react';
import { Mooc, Lesson } from './types';
import { cn } from '@/lib/utils';

interface StepCurriculumProps {
  moocs: Mooc[];
  setMoocs: React.Dispatch<React.SetStateAction<Mooc[]>>;
  expandedMooc: string | null;
  setExpandedMooc: React.Dispatch<React.SetStateAction<string | null>>;
  handleAddMooc: () => void;
  handleAddLesson: (moocId: string, type: 'video' | 'document' | 'quiz') => void;
  handleDeleteMooc: (moocId: string) => void;
  handleDeleteLesson: (moocId: string, lessonId: string) => void;
}

const TYPE_CONFIG = {
  video: { icon: Video, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Video" },
  document: { icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Tài liệu" },
  quiz: { icon: ListChecks, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Kiểm tra" }
};

export const StepCurriculum = ({
  moocs, setMoocs, expandedMooc, setExpandedMooc, handleAddMooc, handleAddLesson, handleDeleteMooc, handleDeleteLesson
}: StepCurriculumProps) => {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Cấu trúc bài giảng</h2>
          <p className="text-sm text-muted-foreground font-medium">Lên kế hoạch và tổ chức nội dung cho khoá học chuyên nghiệp</p>
        </div>
        <Button 
          onClick={handleAddMooc} 
          className="rounded-xl h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} /> Thêm chương mới
        </Button>
      </div>

      {moocs.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-border/40 bg-muted/5 rounded-[2rem] flex flex-col items-center justify-center space-y-4">
          <div className="h-20 w-20 bg-background rounded-3xl flex items-center justify-center border-2 border-border shadow-xl mb-2 rotate-6">
            <BookPlus className="h-10 w-10 text-primary animate-bounce-slow" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black">Khung chương trình đang trống</h3>
            <p className="text-sm text-muted-foreground font-medium max-w-xs">Bắt đầu bằng cách tạo chương đầu tiên để học viên biết họ sẽ học gì!</p>
          </div>
          <Button variant="outline" onClick={handleAddMooc} className="rounded-xl font-bold border-2 h-11 px-8 hover:bg-muted/50 mt-4">
            Tạo chương ngay
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {moocs.map((mooc, index) => {
            const isExpanded = expandedMooc === mooc.id;

            return (
              <div key={mooc.id} className={cn(
                "group border-2 rounded-2xl bg-card transition-all duration-300 overflow-hidden",
                isExpanded ? "border-primary shadow-xl shadow-primary/5 ring-4 ring-primary/5" : "border-border/40 hover:border-border/80 shadow-md"
              )}>
                {/* Mooc Header */}
                <div className={cn(
                  "p-5 flex items-center gap-4 transition-colors",
                  isExpanded ? "bg-primary/[0.03] border-b-2 border-primary/10" : "bg-muted/5"
                )}>
                  <div className="p-2 cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-foreground transition-colors group-hover:scale-110">
                    <GripVertical size={20} />
                  </div>
                  <div className="font-black text-[10px] uppercase tracking-[0.2em] bg-background border-2 border-border px-3 py-1 rounded-sm text-muted-foreground shadow-sm">
                    CHƯƠNG {index + 1}
                  </div>
                  <Input 
                    value={mooc.title} 
                    onChange={(e) => {
                      setMoocs(prev => prev.map(m => m.id === mooc.id ? { ...m, title: e.target.value } : m));
                    }}
                    className="h-10 font-bold bg-transparent border-none focus-visible:ring-0 shadow-none text-lg placeholder:text-muted-foreground py-0" 
                    placeholder="Tên chương học này là gì?" 
                  />
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteMooc(mooc.id)} 
                      className="h-9 w-9 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg shrink-0"
                    >
                      <Trash2 size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setExpandedMooc(isExpanded ? null : mooc.id)} 
                      className={cn(
                        "h-9 w-9 rounded-lg transition-all",
                        isExpanded ? "bg-primary text-primary-foreground" : "bg-background border-2 border-border/80 hover:bg-muted shadow-sm"
                      )}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </Button>
                  </div>
                </div>

                {/* Lessons List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 space-y-5 bg-background">
                        {mooc.lessons.length === 0 ? (
                          <div className="py-10 text-center border-2 border-dashed border-border/30 rounded-xl bg-muted/5">
                            <Sparkles size={24} className="mx-auto mb-2 text-muted-foreground/30" />
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Chưa có bài giảng</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {mooc.lessons.map((lesson: Lesson) => {
                              const config = TYPE_CONFIG[lesson.type];
                              const Icon = config.icon;
                              
                              return (
                                <motion.div 
                                  layout
                                  key={lesson.id} 
                                  className="group/lesson flex items-start gap-5 p-5 border-2 border-border/40 bg-card hover:bg-muted/5 rounded-xl transition-all shadow-sm hover:shadow-md"
                                >
                                  <div className={cn(
                                    "mt-1 w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl border-2 transition-transform group-hover/lesson:scale-110 group-hover/lesson:rotate-3 shadow-sm",
                                    config.bg, config.color, config.border
                                  )}>
                                    <Icon size={22} />
                                  </div>
                                  
                                  <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                      <div className={cn("text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border-2", config.color, config.border)}>
                                        {config.label}
                                      </div>
                                      <Input 
                                        value={lesson.title}
                                        onChange={(e) => {
                                          setMoocs(prev => prev.map(m => m.id === mooc.id ? { ...m, lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, title: e.target.value } : l) } : m));
                                        }}
                                        className="h-9 font-bold bg-muted/10 border-none shadow-none focus-visible:ring-primary/20 rounded-lg text-sm" 
                                      />
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDeleteLesson(mooc.id, lesson.id)} 
                                        className="h-8 w-8 text-muted-foreground/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover/lesson:opacity-100"
                                      >
                                        <Trash2 size={16} />
                                      </Button>
                                    </div>

                                    {/* Action Content */}
                                    <div className="pl-0 sm:pl-2">
                                      {lesson.type === 'quiz' ? (
                                        <div className="grid grid-cols-2 gap-4 max-w-sm">
                                          <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Clock size={12}/> Giới hạn</Label>
                                            <div className="relative">
                                              <Input type="number" defaultValue={lesson.timeLimit} className="h-10 rounded-lg border-2 text-sm font-bold bg-muted/5 pr-10" />
                                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">ph</span>
                                            </div>
                                          </div>
                                          <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Target size={12}/> Để Đạt</Label>
                                            <div className="relative">
                                              <Input type="number" defaultValue={lesson.passingScore} className="h-10 rounded-lg border-2 text-sm font-bold bg-muted/5 pr-8" />
                                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">%</span>
                                            </div>
                                          </div>
                                          <Button variant="outline" className="col-span-2 rounded-lg h-10 border-2 font-bold text-xs gap-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/5 hover:border-emerald-500/40">
                                            <ListChecks size={14} /> Trình thiết lập câu hỏi
                                          </Button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-3">
                                          <Button variant="outline" size="sm" className="h-10 rounded-xl px-5 text-xs font-bold gap-2 border-2 bg-muted/5 hover:bg-muted/20 border-border/40 transition-all active:scale-95 group/upload">
                                            <UploadCloud size={16} className="text-primary group-hover:scale-110 transition-transform" />
                                            <span>Chọn {lesson.type === 'video' ? 'Video' : 'Tài liệu'}</span>
                                          </Button>
                                          <p className="text-[11px] text-muted-foreground font-medium italic">Kéo vào đây để tải lên nhanh</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        )}

                        {/* Add Lesson Menu */}
                        <div className="pt-6 border-t-2 border-border/20 flex flex-wrap items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 w-full sm:w-auto mb-2 sm:mb-0 mr-2">Thêm bài giảng:</span>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => handleAddLesson(mooc.id, 'video')} 
                            className="rounded-xl h-11 px-6 text-xs font-bold gap-2 bg-background border-2 border-blue-500/10 hover:border-blue-500/40 text-blue-600 hover:bg-blue-500/5 transition-all shadow-sm"
                          >
                            <Video size={16} /> <span>+ VIDEO</span>
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => handleAddLesson(mooc.id, 'document')} 
                            className="rounded-xl h-11 px-6 text-xs font-bold gap-2 bg-background border-2 border-amber-500/10 hover:border-amber-500/40 text-amber-600 hover:bg-amber-500/5 transition-all shadow-sm"
                          >
                            <FileText size={16} /> <span>+ TÀI LIỆU</span>
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => handleAddLesson(mooc.id, 'quiz')} 
                            className="rounded-xl h-11 px-6 text-xs font-bold gap-2 bg-background border-2 border-emerald-500/10 hover:border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/5 transition-all shadow-sm"
                          >
                            <ListChecks size={16} /> <span>+ BÀI KIỂM TRA</span>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
