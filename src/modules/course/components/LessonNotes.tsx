'use client';

import { useState } from 'react';
import { useLessonNotes } from '../hooks/useLessonNotes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Plus, Trash2, Edit2, Check, X, Loader2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatDate = (dateString: string) => {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch (e) {
    return dateString;
  }
};

export const LessonNotes = ({ lessonId, hideHeader = false }: { lessonId: string, hideHeader?: boolean }) => {
  const { notes, isLoading, addNote, deleteNote, updateNote } = useLessonNotes(lessonId);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;
    setIsSubmitting(true);
    const result = await addNote(newNoteContent);
    if (result) {
      setNewNoteContent('');
      setIsAdding(false);
    }
    setIsSubmitting(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editContent.trim()) return;
    setIsSubmitting(true);
    const result = await updateNote(id, editContent);
    if (result) {
      setEditingId(null);
    }
    setIsSubmitting(false);
  };

  return (
    <div className={`${hideHeader ? 'mt-4' : 'mt-12'} space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700`}>
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <StickyNote className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Ghi chú bài học</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full gap-2 font-bold hover:bg-primary/5 hover:text-primary transition-all"
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? 'Hủy bỏ' : 'Thêm ghi chú'}
          </Button>
        </div>
      )}

      {hideHeader && !isAdding && (
         <Button 
            onClick={() => setIsAdding(true)}
            className="w-full rounded-xl h-12 font-bold gap-2 shadow-lg shadow-primary/10"
         >
            <Plus className="w-4 h-4" /> Thêm ghi chú mới
         </Button>
      )}

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
              <Textarea
                placeholder="Nhập ghi chú của bạn tại đây..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="min-h-[100px] bg-background border-primary/10 focus-visible:ring-primary/20"
              />
              <div className="flex justify-end gap-2">
                {hideHeader && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsAdding(false)}
                    className="rounded-full px-4 font-bold"
                  >
                    Hủy
                  </Button>
                )}
                <Button 
                  disabled={isSubmitting || !newNoteContent.trim()}
                  onClick={handleAddNote}
                  className="rounded-full px-6 font-bold shadow-lg shadow-primary/10"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Lưu ghi chú
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {isLoading && notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
             <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
             <p className="font-medium">Đang tải ghi chú...</p>
          </div>
        ) : notes.length > 0 ? (
          notes.map((note) => (
            <div 
              key={note.id} 
              className="group p-5 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  {editingId === note.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdate(note.id)}
                          disabled={isSubmitting}
                          className="rounded-full gap-1"
                        >
                          {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          Lưu
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setEditingId(null)}
                          className="rounded-full gap-1"
                        >
                          <X className="w-3 h-3" />
                          Hủy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-foreground whitespace-pre-wrap break-all leading-relaxed font-medium">
                        {note.content}
                      </p>
                      <div className="flex items-center gap-2 mt-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {formatDate(note.createdDate)}
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full"
                    onClick={() => {
                        setEditingId(note.id);
                        setEditContent(note.content);
                    }}
                   >
                     <Edit2 className="w-3.5 h-3.5" />
                   </Button>
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-full"
                    onClick={() => deleteNote(note.id)}
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border-2 border-dashed border-border/50 bg-muted/5">
             <div className="p-4 rounded-full bg-muted/20 mb-4">
                <StickyNote className="w-8 h-8 text-muted-foreground/40" />
             </div>
             <h3 className="text-lg font-bold text-muted-foreground mb-1">Chưa có ghi chú nào</h3>
             <p className="text-sm text-muted-foreground/70 text-center max-w-xs">Ghi lại những kiến thức quan trọng từ bài học này để dễ dàng ôn tập sau này.</p>
          </div>
        )}
      </div>
    </div>
  );
};
