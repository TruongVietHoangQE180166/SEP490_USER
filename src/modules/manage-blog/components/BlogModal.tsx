import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Type, 
  FileText, 
  Image as ImageIcon, 
  Tag, 
  Eye, 
  EyeOff,
  Sparkles,
  ArrowRight,
  Upload,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import { BlogPost, BlogCategory } from '../../blog/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog?: BlogPost | null;
  categories: BlogCategory[];
  mode: 'create' | 'edit' | 'view';
  onSave: (formData: FormData) => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ 
  isOpen, 
  onClose, 
  blog, 
  categories,
  mode, 
  onSave 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [view, setView] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (blog && (mode === 'edit' || mode === 'view')) {
        setTitle(blog.title);
        setContent(blog.content);
        // Find category ID by name if needed, assuming categories list has names
        const category = categories.find(c => c.name === blog.categoryName);
        setCategoryId(category?.id || '');
        setView(blog.view);
        setImagePreview(blog.image);
        setImageFile(null);
      } else {
        setTitle('');
        setContent('');
        setCategoryId(categories.length > 0 ? categories[0].id : '');
        setView(true);
        setImagePreview(null);
        setImageFile(null);
      }
    }
  }, [blog, isOpen, mode, categories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categoryId', categoryId);
    formData.append('view', String(view));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    onSave(formData);
  };

  const isView = mode === 'view';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/40 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] max-h-[90vh] flex flex-col"
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-[110]">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="rounded-full bg-background/50 hover:bg-background text-foreground backdrop-blur-md transition-all border border-border/40 shadow-sm"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Header */}
            <div className="relative h-28 shrink-0 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-background flex items-center px-8 border-b border-border/10">
              <div className="z-10 space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-primary/10 rounded-lg backdrop-blur-md border border-primary/20 shadow-sm">
                    <Sparkles className="text-primary h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Nội dung hệ thống</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  {mode === 'create' ? 'Tạo bài viết mới' : mode === 'edit' ? 'Chỉnh sửa bài viết' : 'Chi tiết bài viết'}
                </h2>
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="overflow-y-auto p-8 flex-1">
              <form id="blog-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Section: Inputs */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="group space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <Type size={12} className="text-primary" /> Tiêu đề bài viết
                      </Label>
                      <Input
                        disabled={isView}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-14 rounded-xl border-none bg-muted/40 focus:ring-2 focus:ring-primary/20 font-bold text-lg transition-all"
                        placeholder="Nhập tiêu đề ấn tượng..."
                        required
                      />
                    </div>

                    <div className="group space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <FileText size={12} className="text-primary" /> Nội dung bài viết
                      </Label>
                      <Textarea
                        disabled={isView}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[300px] rounded-xl border-none bg-muted/40 focus:ring-2 focus:ring-primary/20 font-medium text-base transition-all resize-none p-4"
                        placeholder="Kể câu chuyện của bạn hoặc chia sẻ kiến thức..."
                        required
                      />
                    </div>
                  </div>

                  {/* Right Section: Image & Meta */}
                  <div className="space-y-6">
                    <div className="group space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <ImageIcon size={12} className="text-primary" /> Ảnh bìa (Cover Image)
                      </Label>
                      <div 
                        className={`relative aspect-video rounded-2xl border-2 border-dashed border-border/40 bg-muted/20 overflow-hidden group/img transition-all ${!isView && 'cursor-pointer hover:border-primary/40'}`}
                        onClick={() => !isView && fileInputRef.current?.click()}
                      >
                        {imagePreview ? (
                          <>
                            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                            {!isView && (
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <Button type="button" variant="secondary" size="sm" className="rounded-full gap-2 font-bold">
                                  <Upload size={14} /> Thay đổi ảnh
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Upload size={32} strokeWidth={1.5} />
                            <span className="text-xs font-bold uppercase tracking-widest">Tải ảnh lên</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          disabled={isView}
                        />
                      </div>
                    </div>

                    <div className="group space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <Tag size={12} className="text-primary" /> Danh mục
                      </Label>
                      <div className="grid grid-cols-1 gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            disabled={isView}
                            onClick={() => setCategoryId(cat.id)}
                            className={`h-11 px-4 rounded-xl flex items-center justify-between border transition-all ${categoryId === cat.id ? 'bg-primary border-primary text-primary-foreground shadow-lg' : 'bg-muted/40 border-transparent hover:bg-muted/60 text-foreground font-bold'}`}
                          >
                            <span className="text-sm font-bold">{cat.name}</span>
                            {categoryId === cat.id && <Sparkles size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="group space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <Eye size={12} className="text-primary" /> Hiển thị công khai
                      </Label>
                      <div className="flex gap-2 p-1 bg-muted/40 rounded-xl h-12">
                        <button
                          type="button"
                          disabled={isView}
                          onClick={() => setView(true)}
                          className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all ${view ? 'bg-emerald-500 text-white shadow-md' : 'hover:bg-muted text-muted-foreground font-bold text-[10px]'}`}
                        >
                          <Eye size={14} /> <span className="text-[10px] font-bold uppercase">Hiển thị</span>
                        </button>
                        <button
                          type="button"
                          disabled={isView}
                          onClick={() => setView(false)}
                          className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all ${!view ? 'bg-amber-500 text-white shadow-md' : 'hover:bg-muted text-muted-foreground font-bold text-[10px]'}`}
                        >
                          <EyeOff size={14} /> <span className="text-[10px] font-bold uppercase">Ẩn</span>
                        </button>
                      </div>
                    </div>

                    {isView && blog && (
                      <div className="p-4 rounded-xl bg-muted/20 space-y-3">
                         <div className="flex items-center gap-3">
                            <Calendar size={14} className="text-primary" />
                            <div className="flex flex-col">
                               <span className="text-[10px] uppercase font-black text-muted-foreground">Ngày đăng</span>
                               <span className="text-xs font-bold">{new Date(blog.createdDate).toLocaleString('vi-VN')}</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <UserIcon size={14} className="text-primary" />
                            <div className="flex flex-col">
                               <span className="text-[10px] uppercase font-black text-muted-foreground">Người viết</span>
                               <span className="text-xs font-bold">{blog.fullname || blog.userName}</span>
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="p-8 shrink-0 border-t border-border/10">
              {isView ? (
                <Button 
                  onClick={onClose}
                  className="w-full h-14 rounded-xl font-black uppercase tracking-widest bg-muted hover:bg-muted/80 text-foreground transition-all"
                >
                  Đóng chi tiết
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={onClose}
                    className="flex-1 h-14 rounded-xl font-black uppercase tracking-widest hover:bg-muted text-muted-foreground border border-transparent hover:border-border/40 transition-all"
                  >
                    Hủy bỏ
                  </Button>
                  <Button 
                    form="blog-form"
                    type="submit" 
                    className="flex-[2] h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex gap-3 group"
                  >
                    {mode === 'create' ? 'Xuất bản bài viết' : 'Cập nhật bài viết'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
