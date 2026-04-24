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
    UploadCloud, Plus, Minus, Trash2, Settings2, GripVertical, AlertTriangle, Eye
} from 'lucide-react';
import { ThunderLoader } from '@/components/thunder-loader';
import { getEmbedUrl, cn } from '@/lib/utils';
import { teacherCourseService } from '../../services';
import { QuizQuestion } from '../../types';
import { useUploadMoocVideo } from '../../hooks/useUploadMoocVideo';
import { useUploadMoocDocument } from '../../hooks/useUploadMoocDocument';
import { toast } from '@/components/ui/toast';

// We must define formatting properties
export interface LessonPreviewModalProps {
    selectedLesson: any;
    setSelectedLesson: (lesson: any) => void;
    quizQuestions: QuizQuestion[];
    isQuizLoading?: boolean;
    onUpdateQuizQuestions?: (quizId: string, questions: any[]) => Promise<void>;
    isUpdatingQuestions?: boolean;
    onSuccess?: () => void;
}

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
    isQuizLoading,
    onUpdateQuizQuestions,
    isUpdatingQuestions,
    onSuccess
}: LessonPreviewModalProps) => {
    const [localQuestions, setLocalQuestions] = useState<QuizQuestion[]>(quizQuestions);
    const [fakeDocUploaded, setFakeDocUploaded] = useState(false);
    const [selectedDocFile, setSelectedDocFile] = useState<File | null>(null);
    const docInputRef = useRef<HTMLInputElement>(null);
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean,
        title: string,
        description: string,
        onAction: () => Promise<void> | void,
        variant?: 'danger' | 'primary'
    }>({
        isOpen: false,
        title: '',
        description: '',
        onAction: () => {},
        variant: 'primary'
    });

    const questionsEndRef = useRef<HTMLDivElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const { uploadVideo, updateVideo, isUploading: isUploadingVideo, progress: uploadProgress } = useUploadMoocVideo();
    const { uploadDocument, updateDocument, isUploading: isUploadingDoc, progress: docUploadProgress } = useUploadMoocDocument();
    const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
    const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleDocFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedDocFile(e.target.files[0]);
            setFakeDocUploaded(true);
        }
    };

    const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedVideoFile(file);
            setPreviewVideoUrl(URL.createObjectURL(file));
        }
    };

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
        const isExistingVideo = selectedLesson.type === 'video' && selectedLesson.id && !selectedLesson.id.startsWith('temp-');
        const isNewVideo = selectedLesson.type === 'video' && selectedLesson.targetMoocId;
        const isDocument = selectedLesson.type === 'document';

        showConfirm(
            'Lưu bài học?',
            'Sẽ tiến hành lưu dữ liệu bài học, quá trình có thể mất ít thời gian.',
            async () => {
                if (isDocument) {
                    const isExistingDoc = selectedLesson.id && !selectedLesson.id.startsWith('temp-');
                    if (isExistingDoc) {
                        // UPDATE existing document
                        try {
                            const data = await updateDocument(selectedLesson.id, selectedDocFile || null, selectedLesson.title || 'Tài liệu', selectedLesson.fileType);
                            setSelectedLesson({ ...selectedLesson, viewUrl: data.viewUrl, downloadUrl: data.downloadUrl, fileType: data.fileType });
                            setFakeDocUploaded(false);
                            setSelectedDocFile(null);
                            if (onSuccess) onSuccess();
                        } catch (err) { return Promise.reject(err); }
                    } else if (selectedDocFile) {
                        if (selectedLesson.targetMoocId) {
                            // CREATE new document
                            try {
                                const data = await uploadDocument(selectedLesson.targetMoocId, selectedDocFile, selectedLesson.title || 'Tài liệu');
                                setFakeDocUploaded(false);
                                setSelectedDocFile(null);
                                if (onSuccess) onSuccess();
                            } catch (err) { return Promise.reject(err); }
                        } else {
                            toast.error('Chưa xác định được chương học!');
                            return Promise.reject();
                        }
                    } else {
                        toast.error('Bạn chưa chọn file tài liệu!');
                        return Promise.reject();
                    }
                } else if (selectedLesson.type === 'video') {
                    if (isExistingVideo) {
                        try {
                            const data = await updateVideo(selectedLesson.id, selectedLesson.title || 'Video lesson', selectedVideoFile || undefined);
                            setSelectedLesson({ ...selectedLesson, videoUrl: data.videoUrl || selectedLesson.videoUrl });
                            setPreviewVideoUrl(null);
                            setSelectedVideoFile(null);
                            if (onSuccess) onSuccess();
                        } catch (err) { return Promise.reject(err); }
                    } else if (isNewVideo && selectedVideoFile) {
                        try {
                            const data = await uploadVideo(selectedLesson.targetMoocId, selectedVideoFile, selectedLesson.title || 'Video lesson');
                            setSelectedLesson({ ...selectedLesson, videoUrl: data.videoUrl });
                            setPreviewVideoUrl(null);
                            setSelectedVideoFile(null);
                            if (onSuccess) onSuccess();
                        } catch (err) { return Promise.reject(err); }
                    } else if (isNewVideo && !selectedVideoFile) {
                        toast.error('Bạn chưa chọn file video!');
                        return Promise.reject();
                    } else {
                        toast.error('Chưa xác định được chương học!');
                        return Promise.reject();
                    }
                } else if (selectedLesson.type === 'quiz') {
                    const isNewQuiz = selectedLesson.isNew || (selectedLesson.id && selectedLesson.id.startsWith('temp-'));
                    if (isNewQuiz) {
                        setIsSaving(true);
                        try {
                            if (!selectedLesson.targetMoocId) {
                                setIsSaving(false);
                                toast.error('Chưa xác định được chương học!');
                                return Promise.reject();
                            }
                            if (!selectedLesson.title) {
                                setIsSaving(false);
                                toast.error('Vui lòng nhập tên bài kiểm tra!');
                                return Promise.reject();
                            }
                            await teacherCourseService.createQuiz(selectedLesson.targetMoocId, {
                                title: selectedLesson.title,
                                timeLimit: (selectedLesson.timeLimit || 15) * 60,
                                passingScore: selectedLesson.passingScore || 80
                            });
                            if (onSuccess) onSuccess();
                        } catch (err: any) {
                            setIsSaving(false);
                            toast.error(err.message || 'Lỗi khi tạo bài kiểm tra');
                            return Promise.reject(err);
                        } finally {
                            setIsSaving(false);
                        }
                    } else {
                        setIsSaving(true);
                        try {
                            if (!selectedLesson.title) {
                                setIsSaving(false);
                                toast.error('Vui lòng nhập tên bài kiểm tra!');
                                return Promise.reject();
                            }
                            
                            if (selectedLesson.mode === 'questions') {
                                const invalidQuestionIndex = localQuestions.findIndex(q => !q.content.trim());
                                if (invalidQuestionIndex !== -1) {
                                    setIsSaving(false);
                                    toast.error(`Câu hỏi số ${invalidQuestionIndex + 1} chưa có nội dung!`);
                                    return Promise.reject(new Error('Validation failed'));
                                }
                                
                                for (let i = 0; i < localQuestions.length; i++) {
                                    const invalidAnswerIndex = localQuestions[i].answers.findIndex(a => !a.content.trim());
                                    if (invalidAnswerIndex !== -1) {
                                        setIsSaving(false);
                                        toast.error(`Câu hỏi số ${i + 1} có đáp án ${invalidAnswerIndex + 1} bị bỏ trống!`);
                                        return Promise.reject(new Error('Validation failed'));
                                    }
                                }
                            }
                            
                            await teacherCourseService.updateQuiz(selectedLesson.id, {
                                title: selectedLesson.title,
                                timeLimit: (selectedLesson.timeLimit || 15) * 60,
                                passingScore: selectedLesson.passingScore || 80
                            });
                            
                            // (If this was the question mode, questions should be saved here, but for now we update the info)
                            if (selectedLesson.mode === 'questions' && onUpdateQuizQuestions) {
                                const formattedQuestions = localQuestions.map((q, idx) => ({
                                    questionContent: q.content,
                                    orderIndex: idx + 1,
                                    answers: q.answers.map(a => ({
                                        answerContent: a.content,
                                        isCorrect: a.isCorrect
                                    }))
                                }));
                                await onUpdateQuizQuestions(selectedLesson.id, formattedQuestions);
                            }
                            
                            if (onSuccess) onSuccess();
                        } catch (err: any) {
                            setIsSaving(false);
                            toast.error(err.message || 'Lỗi khi cập nhật bài kiểm tra');
                            return Promise.reject(err);
                        } finally {
                            setIsSaving(false);
                        }
                    }
                } else {
                    toast.success('Đã cập nhật hệ thống!');
                }
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-[1400px] h-[90vh] bg-background rounded-lg border border-border shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-card shrink-0">
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

                    {selectedLesson.type === 'quiz' && !(selectedLesson.isNew || (selectedLesson.id && selectedLesson.id.startsWith('temp-'))) && (!selectedLesson.mode || selectedLesson.mode === 'questions') && (
                        <div className="flex items-center gap-3">
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
                <div className="p-8 overflow-y-auto flex-1 bg-muted/5 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
                        {selectedLesson.type === 'quiz' ? (() => {
                            const isNewQuiz = selectedLesson.isNew || (selectedLesson.id && selectedLesson.id.startsWith('temp-'));
                            const showInfo = isNewQuiz || !selectedLesson.mode || selectedLesson.mode === 'info';
                            const showQuestions = !isNewQuiz && (!selectedLesson.mode || selectedLesson.mode === 'questions');

                            return (
                            <div className="lg:col-span-12 space-y-10">
                                {showInfo && (
                                <div className="bg-primary/5 border border-primary/20 rounded-md p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5"><Target size={100} /></div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Tên bài kiểm tra</Label>
                                            <Input 
                                                value={selectedLesson.title || ''} 
                                                onChange={(e) => setSelectedLesson({ ...selectedLesson, title: e.target.value })}
                                                placeholder="Nhập tên bài kiểm tra..." 
                                                className="h-12 text-lg font-bold bg-background border border-border focus:border-primary rounded-sm px-6" 
                                            />
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 mt-6 md:mt-0">
                                            <div className="bg-background px-4 py-3 rounded-lg border-2 border-border flex items-center justify-between min-w-[220px] shadow-sm hover:border-amber-500/40 transition-all">
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Thời gian làm bài</p>
                                                    <div className="flex items-end gap-1.5">
                                                        <span className="text-2xl font-black text-foreground leading-none">{selectedLesson.timeLimit || 15}</span>
                                                        <span className="text-xs font-bold text-muted-foreground pb-0.5">Phút</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 bg-amber-500/10 rounded-md p-1 border border-amber-500/10 ml-4">
                                                    <button 
                                                        type="button"
                                                        className="w-8 h-8 rounded shrink-0 flex items-center justify-center bg-background border border-amber-500/20 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-colors shadow-sm disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-amber-600 disabled:hover:border-amber-500/20"
                                                        onClick={() => setSelectedLesson({ ...selectedLesson, timeLimit: Math.max(1, (selectedLesson.timeLimit || 15) - 1) })}
                                                        disabled={(selectedLesson.timeLimit || 15) <= 1}
                                                    >
                                                        <Minus size={16} strokeWidth={3} />
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        className="w-8 h-8 rounded shrink-0 flex items-center justify-center bg-background border border-amber-500/20 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-colors shadow-sm"
                                                        onClick={() => setSelectedLesson({ ...selectedLesson, timeLimit: (selectedLesson.timeLimit || 15) + 1 })}
                                                    >
                                                        <Plus size={16} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="bg-background px-4 py-3 rounded-lg border-2 border-border flex items-center justify-between min-w-[220px] shadow-sm hover:border-emerald-500/40 transition-all">
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Tiêu chuẩn đạt</p>
                                                    <div className="flex items-end gap-1.5">
                                                        <span className="text-2xl font-black text-foreground leading-none">{selectedLesson.passingScore || 80}</span>
                                                        <span className="text-xs font-bold text-muted-foreground pb-0.5">% tối thiểu</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 bg-emerald-500/10 rounded-md p-1 border border-emerald-500/10 ml-4">
                                                    <button 
                                                        type="button"
                                                        className="w-8 h-8 rounded shrink-0 flex items-center justify-center bg-background border border-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors shadow-sm disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-emerald-600 disabled:hover:border-emerald-500/20"
                                                        onClick={() => setSelectedLesson({ ...selectedLesson, passingScore: Math.max(5, (selectedLesson.passingScore || 80) - 5) })}
                                                        disabled={(selectedLesson.passingScore || 80) <= 5}
                                                    >
                                                        <Minus size={16} strokeWidth={3} />
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        className="w-8 h-8 rounded shrink-0 flex items-center justify-center bg-background border border-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors shadow-sm disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-emerald-600 disabled:hover:border-emerald-500/20"
                                                        onClick={() => setSelectedLesson({ ...selectedLesson, passingScore: Math.min(100, (selectedLesson.passingScore || 80) + 5) })}
                                                        disabled={(selectedLesson.passingScore || 80) >= 100}
                                                    >
                                                        <Plus size={16} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )}
                                
                                {showQuestions && (
                                <div className="space-y-6 relative pb-20">
                                    <div className="flex items-center justify-between border-b border-border pb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-sm bg-muted flex items-center justify-center text-muted-foreground/40 border border-border"><ClipboardList size={20} /></div>
                                            <h4 className="text-lg font-bold text-foreground uppercase">Ngân hàng câu hỏi ({localQuestions.length})</h4>
                                        </div>
                                    </div>
                                    {isQuizLoading ? (
                                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                                            <ThunderLoader size="lg" animate="thunder" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Đang tải...</p>
                                        </div>
                                    ) : (
                                        <div>
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
                                )}
                            </div>
                            );
                        })() : (
                            <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className={cn("space-y-8", selectedLesson.type === 'video' ? "lg:col-span-12 xl:col-span-7" : "lg:col-span-12")}>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Thông tin bài học</Label>
                                        <Input 
                                            value={selectedLesson.title || ''} 
                                            onChange={(e) => setSelectedLesson({ ...selectedLesson, title: e.target.value })}
                                            placeholder="Tên bài giảng..." 
                                            className="h-12 text-lg font-bold bg-background border border-border focus:border-primary rounded-sm px-6" 
                                        />
                                    </div>
                                    {selectedLesson.type === 'video' && (
                                        <div className="space-y-6">
                                            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Dữ liệu Video</Label>
                                            <div 
                                                className={cn(
                                                    "border border-dashed border-primary/30 rounded-md p-12 bg-primary/[0.01] hover:bg-primary/[0.03] transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-4 group",
                                                    isUploadingVideo && "opacity-50 cursor-not-allowed"
                                                )}
                                                onClick={() => !isUploadingVideo && videoInputRef.current?.click()}
                                            >
                                                <input 
                                                    type="file" 
                                                    ref={videoInputRef} 
                                                    className="hidden" 
                                                    accept="video/mp4,video/x-m4v,video/*" 
                                                    onChange={handleVideoFileSelect} 
                                                />
                                                <div className="h-14 w-14 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-all">
                                                    {isUploadingVideo ? <ThunderLoader size="sm" animate="thunder" /> : <UploadCloud size={32} />}
                                                </div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                                                    {isUploadingVideo ? 'Đang tải lên...' : selectedVideoFile ? selectedVideoFile.name : 'Click chọn hoặc kéo thả Video vào đây'}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground opacity-60">
                                                    {selectedVideoFile ? `${(selectedVideoFile.size / 1024 / 1024).toFixed(2)} MB` : 'Hỗ trợ MP4, WebM (Tối đa 1GB)'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedLesson.type === 'document' && (
                                        <div className="space-y-8 pt-2 border-t border-border/40">
                                            {/* Existing Document Preview */}
                                            {(selectedLesson.viewUrl || selectedLesson.downloadUrl || selectedLesson.documentUrl) && !selectedLesson.isNew && (
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Tài liệu hiện tại</Label>
                                                    <div className="border border-border/80 rounded-xl p-5 bg-muted/10 space-y-5 shadow-sm">
                                                        {/* File info */}
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 rounded-lg bg-foreground/5 border border-border/60 flex items-center justify-center text-foreground shrink-0 shadow-inner">
                                                                <FileText size={22} className="opacity-80" />
                                                            </div>
                                                            <div className="flex-1 overflow-hidden">
                                                                <p className="font-bold text-sm truncate text-foreground">{selectedLesson.title || 'Tài liệu'}</p>
                                                                <p className="text-[10px] text-muted-foreground uppercase mt-1 tracking-widest font-bold">
                                                                    {selectedLesson.fileType || 'Tài liệu'} • Dữ liệu gốc đang sử dụng
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* View URL row */}
                                                        {(selectedLesson.viewUrl || selectedLesson.documentUrl) && (
                                                            <div className="space-y-1.5">
                                                                <p className="text-[9px] font-black uppercase tracking-widest text-amber-600">Đường dẫn xem trực tiếp</p>
                                                                <div className="flex gap-2 items-center">
                                                                    <input
                                                                        readOnly
                                                                        value={selectedLesson.viewUrl || selectedLesson.documentUrl || ''}
                                                                        className="flex-1 h-9 text-[10px] font-mono bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 text-foreground/70 truncate focus:outline-none focus:border-amber-500/50 cursor-text select-all"
                                                                        onClick={(e) => (e.target as HTMLInputElement).select()}
                                                                    />
                                                                    <Button size="sm" className="h-9 px-4 rounded-lg font-black text-[10px] uppercase tracking-widest gap-2 bg-amber-500 hover:bg-amber-600 text-white border-none shadow-md shadow-amber-500/20 shrink-0" onClick={() => window.open(selectedLesson.viewUrl || selectedLesson.documentUrl, '_blank')}>
                                                                        <Eye size={14} /> Xem
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Download URL row */}
                                                        {(selectedLesson.downloadUrl || selectedLesson.documentUrl) && (
                                                            <div className="space-y-1.5">
                                                                <p className="text-[9px] font-black uppercase tracking-widest text-primary">Đường dẫn tải về</p>
                                                                <div className="flex gap-2 items-center">
                                                                    <input
                                                                        readOnly
                                                                        value={selectedLesson.downloadUrl || selectedLesson.documentUrl || ''}
                                                                        className="flex-1 h-9 text-[10px] font-mono bg-primary/5 border border-primary/20 rounded-lg px-3 text-foreground/70 truncate focus:outline-none focus:border-primary/40 cursor-text select-all"
                                                                        onClick={(e) => (e.target as HTMLInputElement).select()}
                                                                    />
                                                                    <Button size="sm" className="h-9 px-4 rounded-lg font-black text-[10px] uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90 text-white border-none shadow-md shadow-primary/20 shrink-0" onClick={() => window.open(selectedLesson.downloadUrl || selectedLesson.documentUrl, '_blank')}>
                                                                        <UploadCloud size={14} className="rotate-180" /> Tải về
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Upload / New Draft Preview */}
                                            <div className="space-y-5">
                                                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                                                    {(selectedLesson.documentUrl || (!selectedLesson.isNew && selectedLesson.type === 'document')) ? "Tải lên Tệp mới (Thay thế gốc)" : "Tải lên Tệp tài liệu"}
                                                </Label>
                                                {fakeDocUploaded ? (
                                                    <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
                                                        <div className="border-2 border-amber-500/40 rounded-xl p-6 bg-amber-500/5 flex items-center justify-between shadow-sm relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 p-4 opacity-5"><FileText size={80} /></div>
                                                            <div className="flex items-center gap-5 flex-1 relative z-10">
                                                                <div className="h-12 w-12 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                                                                    <FileText size={22} />
                                                                </div>
                                                                <div className="flex-1 overflow-hidden">
                                                                    <p className="font-bold text-sm truncate text-foreground">{selectedDocFile?.name || "tài_liệu_bản_nháp_mới.pdf"}</p>
                                                                    <p className="text-[10px] text-amber-600 uppercase mt-1 tracking-widest font-black">Chờ lưu lại • {selectedDocFile ? (selectedDocFile.size / 1024 / 1024).toFixed(2) : "2.4"} MB</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button variant="outline" onClick={() => { setFakeDocUploaded(false); setSelectedDocFile(null); if(docInputRef.current) docInputRef.current.value = ''; }} className="w-full h-12 rounded-xl border-dashed border-2 border-border text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 font-black text-xs uppercase tracking-widest transition-colors shadow-sm">
                                                            Xóa bản nháp / Chọn file khác
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div onClick={() => docInputRef.current?.click()} className="border-2 border-dashed border-amber-500/30 rounded-xl p-16 bg-amber-500/[0.02] hover:bg-amber-500/[0.05] hover:border-amber-500/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-5 group shadow-sm">
                                                        <input 
                                                            type="file" 
                                                            ref={docInputRef} 
                                                            className="hidden" 
                                                            accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                                                            onChange={handleDocFileSelect} 
                                                        />
                                                        <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform shadow-inner border border-amber-500/20"><FileText size={30} /></div>
                                                        <div className="space-y-1.5">
                                                            <p className="text-sm font-black uppercase tracking-widest text-foreground">Click để Chọn <span className="text-amber-500">PDF / Word / Excel</span></p>
                                                            <p className="text-[10px] font-medium text-muted-foreground opacity-60">Hỗ trợ .pdf, .doc, .docx, .xls, .xlsx — Tối đa 50MB</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {selectedLesson.type === 'video' && (
                                    <div className="lg:col-span-12 xl:col-span-5">
                                        <div className="sticky top-0 space-y-6">
                                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Xem trước</Label>
                                        <div className="aspect-video bg-black rounded-md overflow-hidden shadow-xl border border-border/40 flex items-center justify-center">
                                            {(previewVideoUrl || selectedLesson.videoUrl) ? (
                                                getEmbedUrl(previewVideoUrl || selectedLesson.videoUrl) ? (
                                                    <iframe width="100%" height="100%" src={getEmbedUrl(previewVideoUrl || selectedLesson.videoUrl) || ''} frameBorder="0" allowFullScreen />
                                                ) : (
                                                    <video controls className="w-full h-full object-contain" src={previewVideoUrl || selectedLesson.videoUrl} />
                                                )
                                            ) : (
                                                <div className="text-center"><PlayCircle className="h-10 w-10 text-white/10 mx-auto" /></div>
                                            )}
                                        </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-card border-t border-border flex items-center justify-end gap-3 px-8 shrink-0">
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
                                onClick={async (e) => {
                                    e.preventDefault();
                                    try {
                                        await confirmState.onAction();
                                        setConfirmState(prev => ({...prev, isOpen: false}));
                                    } catch (err) {
                                        setConfirmState(prev => ({...prev, isOpen: false}));
                                    }
                                }}
                                disabled={isUploadingVideo || isUploadingDoc || isSaving}
                                className={cn(
                                    "h-9 px-8 font-black text-[10px] uppercase rounded-sm shadow-xl",
                                    confirmState.variant === 'danger' ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20" : "bg-primary hover:bg-primary/90 shadow-primary/20",
                                    (isUploadingVideo || isUploadingDoc || isSaving || isUpdatingQuestions) && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {(isSaving || isUpdatingQuestions) ? (
                                    <>
                                        <ThunderLoader size="sm" animate="thunder" /> Đang lưu...
                                    </>
                                ) : (isUploadingVideo || isUploadingDoc) ? (() => {
                                    const prog = uploadProgress || docUploadProgress;
                                    return (
                                        <>
                                            <ThunderLoader size="sm" animate="thunder" />
                                            {!prog ? ' Đang tải...' : prog.percent === 100 ? ' Đang xử lý...' : ` ${prog.percent}% (${prog.speedMBps.toFixed(2)} MB/s)`}
                                        </>
                                    );
                                })() : 'Đồng ý'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};
