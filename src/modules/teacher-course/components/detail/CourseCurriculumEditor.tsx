import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Video, FileText, ListChecks, UploadCloud, ChevronDown, ChevronUp, Clock, Target, GripVertical, BookPlus, Sparkles, LayoutGrid, Settings2, Eye, LayoutList, AlertTriangle, Pencil, Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VideoChartDemo } from './VideoChartDemo';

// We'll define local types that map to the API structure or use a consistent one
interface Lesson {
    id: string;
    type: 'video' | 'document' | 'quiz';
    title: string;
    timeLimit?: number;
    passingScore?: number;
}

interface Mooc {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface CourseCurriculumEditorProps {
  moocs: Mooc[];
  onUpdateMoocs: (moocs: Mooc[]) => void;
  onLessonPreview: (lesson: any) => void;
  onLessonEdit: (lesson: any, moocId?: string) => void;
  onCreateMooc?: (title: string) => Promise<void>;
  isCreatingMooc?: boolean;
  onUpdateMooc?: (moocId: string, title: string) => Promise<void>;
  isUpdatingMooc?: boolean;
  onDeleteMooc?: (moocId: string) => Promise<void>;
  isDeletingMooc?: boolean;
  onDeleteVideo?: (videoId: string) => Promise<void>;
  isDeletingVideo?: boolean;
  onDeleteDocument?: (documentId: string) => Promise<void>;
  isDeletingDocument?: boolean;
  onDeleteQuiz?: (quizId: string) => Promise<void>;
  isDeletingQuiz?: boolean;
}

const TYPE_CONFIG = {
  video: { icon: Video, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "Video" },
  document: { icon: FileText, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "Tài liệu" },
  quiz: { icon: ListChecks, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "Kiểm tra" }
};

export const CourseCurriculumEditor = ({ moocs, onUpdateMoocs, onLessonPreview, onLessonEdit, onCreateMooc, isCreatingMooc, onUpdateMooc, isUpdatingMooc, onDeleteMooc, isDeletingMooc, onDeleteVideo, isDeletingVideo, onDeleteDocument, isDeletingDocument, onDeleteQuiz, isDeletingQuiz }: CourseCurriculumEditorProps) => {
  const [expandedMooc, setExpandedMooc] = React.useState<string | null>(moocs[0]?.id || null);
  const [editingMoocId, setEditingMoocId] = React.useState<string | null>(null);
  const [editDraftTitle, setEditDraftTitle] = React.useState<string>('');

  const handleStartEdit = (id: string, currentTitle: string) => {
    setEditingMoocId(id);
    setEditDraftTitle(currentTitle);
  };

  const handleSaveEdit = async () => {
    if (editingMoocId) {
      if (onUpdateMooc) {
        await onUpdateMooc(editingMoocId, editDraftTitle);
      } else {
        onUpdateMoocs(moocs.map(m => m.id === editingMoocId ? { ...m, title: editDraftTitle } : m));
      }
    }
    setEditingMoocId(null);
  };

  const handleCancelEdit = () => {
    setEditingMoocId(null);
  };


  const [isAddingMooc, setIsAddingMooc] = React.useState(false);
  const [newMoocTitle, setNewMoocTitle] = React.useState('');
  
  const [confirmState, setConfirmState] = React.useState<{
    isOpen: boolean,
    title: string,
    description: string,
    onAction: () => Promise<void> | void
  }>({
    isOpen: false,
    title: '',
    description: '',
    onAction: () => {}
  });

  const showConfirm = (title: string, description: string, onAction: () => void) => {
    setConfirmState({ isOpen: true, title, description, onAction });
  };

  const handleAddMooc = async () => {
    if (!newMoocTitle.trim()) return;
    
    if (onCreateMooc) {
      await onCreateMooc(newMoocTitle);
      setNewMoocTitle('');
      setIsAddingMooc(false);
    } else {
      const newMooc: Mooc = {
        id: `new-mooc-${Date.now()}`,
        title: newMoocTitle,
        lessons: [],
      };
      onUpdateMoocs([...moocs, newMooc]);
      setExpandedMooc(newMooc.id);
      setNewMoocTitle('');
      setIsAddingMooc(false);
    }
  };

  const handleDeleteMooc = (id: string) => {
    showConfirm(
        'Xóa chương học?',
        'Tất cả bài giảng trong chương này sẽ bị xóa vĩnh viễn. Bạn có chắc không?',
        async () => {
            if (onDeleteMooc) {
                await onDeleteMooc(id);
            } else {
                onUpdateMoocs(moocs.filter(m => m.id !== id));
            }
            setConfirmState(prev => ({ ...prev, isOpen: false }));
        }
    );
  };

  const handleAddLesson = (moocId: string, type: Lesson['type']) => {
    // Open the editor modal directly for new lesson creation
    onLessonEdit({
        id: `temp-${Date.now()}`,
        type,
        title: '',
        isEditing: true,
        isNew: true
    }, moocId);
  };

  const [deletingLessonId, setDeletingLessonId] = React.useState<string | null>(null);

  const handleDeleteLesson = (moocId: string, lessonId: string, lessonType?: string) => {
    showConfirm(
        'Xóa bài giảng?',
        'Bạn có chắc chắn muốn xóa bài giảng này khỏi hệ thống không?',
        async () => {
            if (lessonType === 'video' && onDeleteVideo && !lessonId.startsWith('temp-')) {
                setDeletingLessonId(lessonId);
                try {
                    await onDeleteVideo(lessonId);
                } finally {
                    setDeletingLessonId(null);
                }
            } else if (lessonType === 'document' && onDeleteDocument && !lessonId.startsWith('temp-')) {
                setDeletingLessonId(lessonId);
                try {
                    await onDeleteDocument(lessonId);
                } finally {
                    setDeletingLessonId(null);
                }
            } else if (lessonType === 'quiz' && onDeleteQuiz && !lessonId.startsWith('temp-')) {
                setDeletingLessonId(lessonId);
                try {
                    await onDeleteQuiz(lessonId);
                } finally {
                    setDeletingLessonId(null);
                }
            } else {
                onUpdateMoocs(moocs.map(m => {
                    if (m.id === moocId) {
                        return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
                    }
                    return m;
                }));
            }
            setConfirmState(prev => ({ ...prev, isOpen: false }));
        }
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-card border border-border/40 p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <LayoutGrid size={24} />
            </div>
            <div>
                <h2 className="text-xl font-black tracking-tight">Cấu trúc nội dung học tập</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Quản lý chương và bài giảng</p>
            </div>
        </div>
        {!isAddingMooc && (
          <Button 
            onClick={() => setIsAddingMooc(true)} 
            className="rounded-lg h-12 px-8 font-bold gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all bg-primary"
          >
            <Plus size={20} /> Thêm chương mới
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isAddingMooc && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border-2 border-primary/20 rounded-xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Sparkles size={100} />
            </div>
            <div className="relative space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Tên chương học mới</Label>
                <div className="flex gap-4">
                  <Input 
                    autoFocus
                    value={newMoocTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMoocTitle(e.target.value)}
                    placeholder="VD: Tổng quan về thị trường Crypto..."
                    className="h-14 text-lg font-bold bg-muted/20 border-border/60 focus:border-primary/40 focus:ring-primary/20 rounded-xl"
                  />
                  <div className="flex gap-2">
                    <Button 
                        onClick={handleAddMooc} 
                        disabled={!newMoocTitle.trim() || isCreatingMooc}
                        className="h-14 px-8 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
                    >
                        {isCreatingMooc ? 'Đang lưu...' : 'Lưu chương'}
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={() => {
                            setIsAddingMooc(false);
                            setNewMoocTitle('');
                        }}
                        className="h-14 px-6 rounded-xl font-bold text-muted-foreground hover:bg-muted"
                    >
                        Hủy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {moocs.length === 0 && !isAddingMooc ? (
        <div className="py-24 text-center border-2 border-dashed border-border/40 bg-muted/5 rounded-xl flex flex-col items-center justify-center space-y-6">
          <div className="h-24 w-24 bg-background border-2 border-border/60 rounded-xl flex items-center justify-center shadow-2xl rotate-12 group hover:rotate-0 transition-transform duration-500">
            <BookPlus className="h-12 w-12 text-primary/40 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-foreground">Chưa có chương học nào</h3>
            <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">Click vào nút phía trên để bắt đầu xây dựng lộ trình học tập cho học viên của bạn.</p>
          </div>
          <Button variant="outline" onClick={() => setIsAddingMooc(true)} className="rounded-lg font-black border-2 h-12 px-10 hover:bg-muted/50 shadow-sm">
            Tạo ngay chương đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {moocs.map((mooc, index) => {
            const isExpanded = expandedMooc === mooc.id;

            return (
              <motion.div 
                layout
                key={mooc.id} 
                className={cn(
                    "group border-2 rounded-xl bg-card transition-all duration-500 overflow-hidden",
                    isExpanded ? "border-primary shadow-2xl shadow-primary/5 ring-8 ring-primary/[0.02]" : "border-border/40 hover:border-border shadow-sm"
                )}
              >
                {/* Mooc Header */}
                <div className={cn(
                  "p-6 flex items-center gap-5 transition-colors",
                  isExpanded ? "bg-primary/[0.02] border-b-2 border-primary/10" : "bg-muted/5"
                )}>
                  <div className="p-2 cursor-grab active:cursor-grabbing text-muted-foreground/20 hover:text-foreground transition-colors group-hover:scale-110">
                    <GripVertical size={20} />
                  </div>
                  <div className="font-black text-[10px] uppercase tracking-[0.25em] bg-background border-2 border-border/60 px-4 py-1.5 rounded-lg text-muted-foreground shadow-sm shrink-0">
                    Chương {index + 1}
                  </div>
                  {editingMoocId === mooc.id ? (
                     <Input 
                      autoFocus
                      value={editDraftTitle} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDraftTitle(e.target.value)}
                      onBlur={handleSaveEdit}
                      disabled={isUpdatingMooc}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          (e.target as HTMLInputElement).blur();
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      className="h-10 font-black bg-background border-2 border-primary rounded-lg focus-visible:ring-0 shadow-lg shadow-primary/10 text-lg placeholder:text-muted-foreground/30 py-0 flex-1 px-3" 
                      placeholder="Nhập tên chương học..." 
                    />
                  ) : (
                    <span 
                      className="flex-1 font-black text-xl px-1 truncate cursor-pointer hover:text-primary transition-colors" 
                      onDoubleClick={() => handleStartEdit(mooc.id, mooc.title)}
                    >
                      {mooc.title || 'Chưa có tên chương'}
                    </span>
                  )}
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    {editingMoocId === mooc.id ? (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={isUpdatingMooc}
                          onMouseDown={(e) => {
                            e.preventDefault(); // Ngăn ô input bị mất focus trước khi chạy hàm save
                            handleSaveEdit();
                          }}
                          className="h-10 w-10 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-600 rounded-lg transition-colors border border-emerald-500/20"
                        >
                          {isUpdatingMooc ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} strokeWidth={3} />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onMouseDown={(e) => {
                            e.preventDefault(); // Ngăn ô input bị mất focus trước khi chạy hàm cancel để khỏi lưu bậy
                            handleCancelEdit();
                          }}
                          title="Hủy (Phím Esc)"
                          className="h-10 w-10 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-600 rounded-lg transition-colors border border-rose-500/20"
                        >
                          <X size={20} strokeWidth={3} />
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleStartEdit(mooc.id, mooc.title)} 
                        className="h-10 w-10 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-500 rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      disabled={isDeletingMooc}
                      onClick={() => handleDeleteMooc(mooc.id)} 
                      className="h-10 w-10 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-colors text-muted-foreground/40"
                    >
                      <Trash2 size={20} />
                    </Button>
                    <div className="w-px h-6 bg-border/60 mx-1" />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setExpandedMooc(isExpanded ? null : mooc.id)} 
                      className={cn(
                        "h-10 w-10 rounded-lg transition-all shadow-md border-2",
                        isExpanded ? "bg-primary border-primary text-white" : "bg-card border-border/60 hover:border-primary/40 hover:text-primary text-muted-foreground"
                      )}
                    >
                      {isExpanded ? <ChevronUp size={18} strokeWidth={3} /> : <ChevronDown size={18} strokeWidth={3} />}
                    </Button>
                  </div>
                </div>

                {/* Lessons Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-background/50"
                    >
                      <div className="p-8 space-y-6">
                        {mooc.lessons.length === 0 ? (
                          <div className="py-16 text-center border-2 border-dashed border-border/20 rounded-xl bg-muted/5 space-y-3">
                             <div className="h-12 w-12 rounded-full bg-background border border-border/40 flex items-center justify-center mx-auto shadow-sm">
                                <Sparkles size={20} className="text-primary/30" />
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Chương này đang đợi nội dung từ bạn</p>
                          </div>
                        ) : (
                          <div className="grid gap-4">
                            {mooc.lessons.map((lesson) => {
                              const config = TYPE_CONFIG[lesson.type];
                              const Icon = config.icon;
                              
                              return (
                                <motion.div 
                                  layout
                                  key={lesson.id} 
                                  className="group/lesson flex flex-col p-6 border-2 border-border/40 bg-card hover:bg-background rounded-lg transition-all shadow-sm hover:shadow-xl hover:border-primary/20"
                                >
                                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className={cn(
                                      "w-12 h-12 shrink-0 flex items-center justify-center rounded-lg border-2 transition-all group-hover/lesson:scale-110 group-hover/lesson:rotate-6 shadow-md shadow-black/5",
                                      config.bg, config.color, config.border
                                    )}>
                                      <Icon size={24} />
                                    </div>
                                    
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3">
                                        <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border-2 whitespace-nowrap shrink-0", config.color, config.border)}>
                                          {config.label}
                                        </span>
                                        <span className="font-bold text-base truncate flex-1 block mt-0.5">
                                          {lesson.title || 'Chưa có tên bài học'}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 md:ml-auto">
                                        {lesson.type === 'quiz' && !lesson.id.startsWith('temp-') ? (
                                            <div className="flex items-center">
                                                <Button 
                                                  variant="outline" 
                                                  size="sm" 
                                                  onClick={() => onLessonEdit({...lesson, mode: 'questions'}, mooc.id)}
                                                  className="rounded-l-lg rounded-r-none font-black h-12 px-4 border-2 border-r bg-primary/5 gap-1.5 border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg shadow-primary/5 uppercase tracking-widest text-[10px]"
                                                >
                                                    <Plus size={16} strokeWidth={3} /> Câu hỏi
                                                </Button>
                                                <Button 
                                                  variant="outline" 
                                                  size="sm" 
                                                  onClick={() => onLessonEdit({...lesson, mode: 'info'}, mooc.id)}
                                                  className="rounded-r-lg rounded-l-none font-black h-12 px-4 border-2 border-l-0 bg-primary/5 gap-1.5 border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg shadow-primary/5 uppercase tracking-widest text-[10px]"
                                                >
                                                    <Settings2 size={16} /> Sửa
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button 
                                              variant="outline" 
                                              size="sm" 
                                              onClick={() => onLessonEdit(lesson, mooc.id)}
                                              className="rounded-lg font-black h-12 px-6 border-2 bg-primary/5 gap-2 border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg shadow-primary/5 uppercase tracking-widest text-[10px]"
                                            >
                                                <Settings2 size={16} /> Thiết lập nội dung
                                            </Button>
                                        )}
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          onClick={() => handleDeleteLesson(mooc.id, lesson.id, lesson.type)} 
                                          disabled={deletingLessonId === lesson.id || isDeletingVideo || isDeletingDocument || isDeletingQuiz}
                                          className="h-12 w-12 text-muted-foreground/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                        >
                                          {deletingLessonId === lesson.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                                        </Button>
                                    </div>
                                  </div>

                                  {lesson.type === 'video' && (
                                    <div className="mt-4 border-t border-border/40 pt-4">
                                      <VideoChartDemo videoId={lesson.id} />
                                    </div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        )}

                        {/* Quick Add Lessons */}
                        <div className="pt-8 border-t-2 border-border/20">
                           <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-muted/20 p-5 rounded-xl border-2 border-dashed border-border/40">
                             <div className="flex-1 flex flex-col justify-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1 ml-1">Nội dung tiếp theo:</span>
                                <p className="text-xs font-medium text-muted-foreground/40 italic ml-1">Thêm bài học để làm phong phú chương trình của bạn.</p>
                             </div>
                             <div className="flex flex-wrap items-center gap-3">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={() => handleAddLesson(mooc.id, 'video')} 
                                    className="rounded-lg h-12 px-6 text-[10px] font-black tracking-widest gap-2 bg-background border-2 border-primary/10 hover:border-primary/40 text-primary hover:bg-primary/5 transition-all shadow-sm uppercase shrink-0"
                                >
                                    <Video size={16} /> <span>+ Video</span>
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={() => handleAddLesson(mooc.id, 'document')} 
                                    className="rounded-lg h-12 px-6 text-[10px] font-black tracking-widest gap-2 bg-background border-2 border-primary/10 hover:border-primary/40 text-primary hover:bg-primary/5 transition-all shadow-sm uppercase shrink-0"
                                >
                                    <FileText size={16} /> <span>+ Tài liệu</span>
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={() => handleAddLesson(mooc.id, 'quiz')} 
                                    className="rounded-lg h-12 px-6 text-[10px] font-black tracking-widest gap-2 bg-background border-2 border-primary/10 hover:border-primary/40 text-primary hover:bg-primary/5 transition-all shadow-sm uppercase shrink-0"
                                >
                                    <ListChecks size={16} /> <span>+ Kiểm tra</span>
                                </Button>
                             </div>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Reusable Confirm Dialog */}
      <AlertDialog open={confirmState.isOpen} onOpenChange={(open) => !open && setConfirmState(prev => ({ ...prev, isOpen: false }))}>
        <AlertDialogContent className="max-w-[400px] border border-border/50 bg-background/95 backdrop-blur-md rounded-xl">
          <AlertDialogHeader className="space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-2 border border-rose-500/20">
              <AlertTriangle size={32} />
            </div>
            <AlertDialogTitle className="text-xl font-black uppercase tracking-tight italic text-center text-foreground">{confirmState.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed text-center">{confirmState.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3 flex flex-col sm:flex-row">
            <AlertDialogCancel disabled={isDeletingMooc || !!deletingLessonId} className="h-12 flex-1 font-bold text-[11px] uppercase tracking-widest rounded-xl border-border hover:bg-muted transition-all">Quay lại</AlertDialogCancel>
            <AlertDialogAction 
              onClick={async (e) => {
                e.preventDefault();
                await confirmState.onAction();
              }}
              disabled={isDeletingMooc || !!deletingLessonId}
              className="h-12 flex-1 font-black text-[11px] uppercase tracking-widest rounded-xl bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-500/20 text-white transition-all active:scale-95"
            >
              {(isDeletingMooc || !!deletingLessonId) ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              {(isDeletingMooc || !!deletingLessonId) ? 'Đang xóa...' : 'Tôi chắc chắn'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
