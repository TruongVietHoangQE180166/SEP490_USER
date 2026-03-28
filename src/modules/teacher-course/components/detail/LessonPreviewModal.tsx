import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { 
    PlayCircle, Timer, FileText, CheckCircle2, ClipboardList, Target, 
    UploadCloud, Plus, Trash2, Settings2, GripVertical, AlertTriangle 
} from 'lucide-react';
import { ThunderLoader } from '@/components/thunder-loader';
import { getEmbedUrl, cn } from '@/lib/utils';
import { QuizQuestion } from '../../types';

// Separate Question Item Component for stability
const QuizQuestionItem = ({ q, idx, onReorder, onDelete, onQuestionChange, onAnswerChange, onToggleCorrect }: any) => {
    return (
        <Reorder.Item 
            key={q.id} 
            value={q}
            className="group bg-card rounded-md border border-border hover:border-primary/20 transition-all shadow-sm overflow-hidden list-none mb-8"
        >
            <div className="bg-muted/30 px-8 py-4 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-muted-foreground/30 cursor-grab active:cursor-grabbing hover:text-primary transition-colors" />
                    <div className="h-8 w-8 rounded-sm bg-primary flex items-center justify-center text-white text-xs font-bold">
                        {idx + 1}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CÂU HỎI LỰA CHỌN</span>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(q.id);
                    }}
                    className="h-8 px-3 rounded-sm text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 flex items-center gap-2 text-[10px] font-bold uppercase"
                >
                    <Trash2 size={14} /> Xóa câu hỏi
                </Button>
            </div>
            
            <div className="p-8 space-y-8">
                <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Nội dung câu hỏi</Label>
                    <Textarea 
                        value={q.content}
                        onChange={(e) => onQuestionChange(q.id, e.target.value)}
                        placeholder="Nhập nội dung câu hỏi tại đây..." 
                        className="min-h-[100px] text-lg font-bold bg-muted/20 border-border focus:border-primary rounded-sm p-4 resize-none shadow-none text-foreground leading-relaxed"
                    />
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Danh sách đáp án</Label>
                        <span className="text-[8px] font-bold text-muted-foreground italic uppercase">Click icon chọn đáp án đúng</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.answers.map((ans: any, aIdx: number) => (
                            <div key={`${q.id}-${ans.id}`} className={cn(
                                "flex items-center gap-4 p-4 rounded-sm border-2 transition-all relative",
                                ans.isCorrect ? "bg-emerald-500/5 border-emerald-500/30" : "bg-background border-border hover:border-primary/20"
                            )}>
                                <div 
                                    onClick={() => onToggleCorrect(q.id, ans.id)}
                                    className={cn(
                                        "h-8 w-8 rounded-sm border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all",
                                        ans.isCorrect ? "bg-emerald-500 border-emerald-500 text-white" : "border-border bg-muted/20 hover:border-primary/40"
                                    )}
                                >
                                    <CheckCircle2 size={16} strokeWidth={3} />
                                </div>
                                <div className="flex-1">
                                    <Input 
                                        value={ans.content}
                                        onChange={(e) => onAnswerChange(q.id, ans.id, e.target.value)}
                                        placeholder={`Đáp án ${aIdx + 1}...`}
                                        className="h-10 border-none bg-transparent font-bold text-sm focus:ring-0 p-0 shadow-none text-foreground"
                                    />
                                </div>
                                {ans.isCorrect && (
                                    <Badge className="absolute -top-3 right-4 bg-emerald-500 text-white border-none text-[8px] font-bold uppercase tracking-widest px-3 h-5 rounded-sm shadow-sm">ĐÚNG</Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Reorder.Item>
    );
};

export const LessonPreviewModal = ({ 
    selectedLesson, 
    setSelectedLesson, 
    quizQuestions, 
    isQuizLoading 
}: LessonPreviewModalProps) => {
    if (!selectedLesson) return null;

    const [localQuestions, setLocalQuestions] = useState<QuizQuestion[]>(quizQuestions);
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean,
        title: string,
        description: string,
        onAction: () => void,
        variant?: 'danger' | 'primary'
    }>({
        isOpen: false,
        title: '',
        description: '',
        onAction: () => {},
        variant: 'primary'
    });

    const questionsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocalQuestions(quizQuestions);
    }, [quizQuestions]);

    const showConfirm = (title: string, description: string, onAction: () => void, variant: 'danger' | 'primary' = 'primary') => {
        setConfirmState({
            isOpen: true,
            title,
            description,
            onAction,
            variant
        });
    };

    const handleSave = () => {
        showConfirm(
            'Lưu thay đổi?',
            'Bạn có chắc chắn muốn lưu lại toàn bộ các chỉnh sửa này không?',
            () => {
                alert('Đã cập nhật hệ thống!');
            }
        );
    };

    const handleToggleCorrect = (qId: string, aId: string) => {
        setLocalQuestions(prev => prev.map(q => {
            if (q.id !== qId) return q;
            return {
                ...q,
                answers: q.answers.map(ans => ({
                    ...ans,
                    isCorrect: ans.id === aId
                }))
            };
        }));
    };

    const handleQuestionChange = (qId: string, content: string) => {
        setLocalQuestions(prev => prev.map(q => q.id === qId ? { ...q, content } : q));
    };

    const handleAnswerChange = (qId: string, aId: string, content: string) => {
        setLocalQuestions(prev => prev.map(q => {
            if (q.id !== qId) return q;
            return {
                ...q,
                answers: q.answers.map(ans => ans.id === aId ? { ...ans, content } : ans)
            };
        }));
    };

    const handleAddQuestion = () => {
        const newQuestion: QuizQuestion = {
            id: `new-${Date.now()}`,
            content: '',
            orderIndex: localQuestions.length + 1,
            quizId: selectedLesson.id || '',
            answers: [
                { id: `ans-${Date.now()}-1`, content: '', isCorrect: true, questionId: '' },
                { id: `ans-${Date.now()}-2`, content: '', isCorrect: false, questionId: '' },
                { id: `ans-${Date.now()}-3`, content: '', isCorrect: false, questionId: '' },
                { id: `ans-${Date.now()}-4`, content: '', isCorrect: false, questionId: '' },
            ]
        };
        setLocalQuestions([...localQuestions, newQuestion]);
        setTimeout(() => {
            questionsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleDeleteQuestion = (qId: string) => {
        showConfirm(
            'Xóa câu hỏi?',
            'Bạn có chắc chắn muốn xóa câu hỏi này khỏi danh sách?',
            () => {
                setLocalQuestions(prev => prev.filter(q => q.id !== qId));
            },
            'danger'
        );
    };

    const handleDeleteAll = () => {
        showConfirm(
            'Xóa tất cả câu hỏi?',
            'Hành động này sẽ giải phóng toàn bộ câu hỏi hiện có. Bạn có chắc không?',
            () => {
                setLocalQuestions([]);
            },
            'danger'
        );
    };

    const onClose = () => {
        showConfirm(
            'Đóng trình chỉnh sửa?',
            'Mọi thay đổi chưa lưu sẽ bị mất hoàn toàn.',
            () => setSelectedLesson(null)
        );
    };

    return (
        <div key="lp-modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div key="lp-modal-body" className="relative w-full max-w-[1400px] h-[90vh] bg-background rounded-lg border border-border shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div key="lp-header" className="px-8 py-6 border-b border-border flex items-center justify-between bg-card shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                            {selectedLesson.type === 'video' ? <PlayCircle size={28} /> : 
                             selectedLesson.type === 'document' ? <FileText size={28} /> : 
                             <Target size={28} />}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-primary/30 text-primary rounded-sm h-6">
                                    {selectedLesson.type === 'video' ? 'Video học tập' : 
                                     selectedLesson.type === 'document' ? 'Tài liệu hướng dẫn' : 
                                     'Bài kiểm tra Quiz'}
                                </Badge>
                                <span className="text-muted-foreground/30 text-xl font-light">/</span>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter opacity-50">#ID-{selectedLesson.id?.slice(-6) || 'NEW'}</span>
                            </div>
                            <h2 className="text-xl font-bold text-foreground tracking-tight line-clamp-1 italic">
                                {selectedLesson.title || "Tạo bài giảng mới..."}
                            </h2>
                        </div>
                    </div>

                    {selectedLesson.type === 'quiz' && (
                        <div key="lp-actions" className="flex items-center gap-3">
                            <Button 
                                variant="ghost"
                                onClick={handleDeleteAll}
                                className="rounded-sm font-bold gap-2 text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 h-12 px-6 text-[10px] uppercase tracking-widest border border-rose-500/20"
                            >
                                <Trash2 size={16} />
                                Xóa hết
                            </Button>
                            <Button 
                                onClick={handleAddQuestion}
                                className="rounded-sm font-bold gap-3 bg-primary hover:bg-primary/90 h-12 px-8 text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 border-2 border-white/10 group transition-all"
                            >
                                <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                                Thêm câu hỏi
                            </Button>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div key="lp-main" className="p-8 overflow-y-auto flex-1 bg-muted/5 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
                        {selectedLesson.type === 'quiz' ? (
                            <div key="lp-quiz-grid" className="lg:col-span-12 space-y-10">
                                <div className="bg-primary/5 border border-primary/20 rounded-md p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5"><Target size={100} /></div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-sm bg-primary flex items-center justify-center text-white"><Settings2 size={18} /></div>
                                                <h4 className="text-lg font-bold text-foreground tracking-tight uppercase">Cấu hình bài tập</h4>
                                            </div>
                                            <p className="text-xs font-medium text-muted-foreground/60">Thiết lập giới hạn thời gian và chỉ tiêu bài tập.</p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="bg-background p-3 rounded-sm border border-border flex items-center gap-4 px-5">
                                                <div className="h-8 w-8 rounded-sm bg-amber-500/10 flex items-center justify-center text-amber-600"><Timer size={16} /></div>
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Thời gian</p>
                                                    <div className="flex items-center gap-2">
                                                        <Input type="number" defaultValue={selectedLesson.timeLimit || 15} className="h-7 w-12 bg-transparent border-none p-0 font-bold text-sm focus-visible:ring-0 shadow-none text-primary" />
                                                        <span className="text-[10px] font-bold text-muted-foreground">PHÚT</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-background p-3 rounded-sm border border-border flex items-center gap-4 px-5">
                                                <div className="h-8 w-8 rounded-sm bg-emerald-500/10 flex items-center justify-center text-emerald-600"><Target size={16} /></div>
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Điểm đạt</p>
                                                    <div className="flex items-center gap-2">
                                                        <Input type="number" defaultValue={selectedLesson.passingScore || 80} className="h-7 w-12 bg-transparent border-none p-0 font-bold text-sm focus-visible:ring-0 shadow-none text-primary" />
                                                        <span className="text-[10px] font-bold text-muted-foreground">% MIN</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div key="lp-question-bank" className="space-y-6 relative pb-20">
                                    <div className="flex items-center justify-between border-b border-border pb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-sm bg-muted flex items-center justify-center text-muted-foreground/40 border border-border"><ClipboardList size={20} /></div>
                                            <h4 className="text-lg font-bold text-foreground uppercase">Ngân hàng câu hỏi ({localQuestions.length})</h4>
                                        </div>
                                    </div>
                                    {isQuizLoading ? (
                                        <div key="lp-loading" className="py-20 flex flex-col items-center justify-center gap-4">
                                            <ThunderLoader size="lg" animate="thunder" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Đang tải...</p>
                                        </div>
                                    ) : (
                                        <div key="lp-reorder-container">
                                            <Reorder.Group axis="y" values={localQuestions} onReorder={setLocalQuestions} className="space-y-8">
                                                {localQuestions.map((q, idx) => (
                                                    <QuizQuestionItem 
                                                        key={`q-${q.id}`} 
                                                        q={q} 
                                                        idx={idx} 
                                                        onDelete={handleDeleteQuestion}
                                                        onQuestionChange={handleQuestionChange}
                                                        onAnswerChange={handleAnswerChange}
                                                        onToggleCorrect={handleToggleCorrect}
                                                    />
                                                ))}
                                            </Reorder.Group>
                                            <div ref={questionsEndRef} className="h-4" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div key="lp-standard-grid" className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Thông tin bài học</Label>
                                        <Input defaultValue={selectedLesson.title} placeholder="Tên bài giảng..." className="h-12 text-lg font-bold bg-background border border-border focus:border-primary rounded-sm px-6" />
                                    </div>
                                    {selectedLesson.type === 'video' && (
                                        <div key="lp-video" className="space-y-6">
                                            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Dữ liệu Video</Label>
                                            <div className="border border-dashed border-primary/30 rounded-md p-12 bg-primary/[0.01] hover:bg-primary/[0.03] transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-4 group">
                                                <div className="h-14 w-14 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-all"><UploadCloud size={32} /></div>
                                                <p className="text-xs font-bold uppercase tracking-widest">Kéo thả Video vào đây</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedLesson.type === 'document' && (
                                        <div key="lp-doc" className="space-y-6">
                                            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Tệp tài liệu</Label>
                                            <div className="border border-dashed border-amber-500/30 rounded-md p-16 bg-amber-500/[0.01] hover:bg-amber-500/[0.03] transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-4 group">
                                                <div className="h-14 w-14 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-all"><FileText size={32} /></div>
                                                <p className="text-xs font-bold uppercase tracking-widest">Tải PDF / Word</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="lg:col-span-12 xl:col-span-5">
                                    <div className="sticky top-0 space-y-6">
                                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Xem trước</Label>
                                        <div className="aspect-video bg-black rounded-md overflow-hidden shadow-xl border border-border/40 flex items-center justify-center">
                                            {selectedLesson.videoUrl ? (
                                                getEmbedUrl(selectedLesson.videoUrl) ? (
                                                    <iframe width="100%" height="100%" src={getEmbedUrl(selectedLesson.videoUrl) || ''} frameBorder="0" allowFullScreen />
                                                ) : (
                                                    <video controls className="w-full h-full object-contain" src={selectedLesson.videoUrl} />
                                                )
                                            ) : (
                                                <div className="text-center"><PlayCircle className="h-10 w-10 text-white/10 mx-auto" /></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div key="lp-footer" className="p-6 bg-card border-t border-border flex items-center justify-end gap-3 px-8 shrink-0">
                    <Button variant="ghost" onClick={onClose} className="rounded-sm h-10 px-8 font-bold text-[11px] uppercase tracking-widest">Hủy bỏ</Button>
                    <Button onClick={handleSave} className="h-10 px-10 rounded-sm font-bold text-[11px] uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">Lưu bài học</Button>
                </div>

                {/* Confirm Dialog */}
                <AlertDialog open={confirmState.isOpen} onOpenChange={(open) => !open && setConfirmState(prev => ({...prev, isOpen: false}))}>
                    <AlertDialogContent className="max-w-[400px] border border-border/50 bg-background/95 backdrop-blur-md rounded-md">
                        <AlertDialogHeader className="space-y-3">
                            <div className={cn(
                                "h-12 w-12 rounded-md flex items-center justify-center mb-2",
                                confirmState.variant === 'danger' ? "bg-rose-500/10 text-rose-500" : "bg-primary/10 text-primary"
                            )}>
                                {confirmState.variant === 'danger' ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
                            </div>
                            <AlertDialogTitle className="text-lg font-bold uppercase tracking-tight italic">{confirmState.title}</AlertDialogTitle>
                            <AlertDialogDescription className="text-xs font-medium text-muted-foreground leading-relaxed">{confirmState.description}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4 gap-2">
                            <AlertDialogCancel className="h-9 px-6 font-bold text-[10px] uppercase rounded-sm border-border bg-muted/20">Hủy</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={() => {
                                    confirmState.onAction();
                                    setConfirmState(prev => ({...prev, isOpen: false}));
                                }}
                                className={cn(
                                    "h-9 px-8 font-black text-[10px] uppercase rounded-sm shadow-xl",
                                    confirmState.variant === 'danger' ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20" : "bg-primary hover:bg-primary/90 shadow-primary/20"
                                )}
                            >
                                Đồng ý
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};
