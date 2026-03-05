'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  User as UserIcon,
  ArrowLeft,
  CheckCircle2,
  Circle,
  AlignLeft,
  Hash,
  Clock,
  Globe,
  Lock,
  ImageOff,
  Star,
  Zap,
} from 'lucide-react';
import { BlogPost, BlogCategory } from '../../blog/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface BlogFormProps {
  onClose: () => void;
  blog?: BlogPost | null;
  categories: BlogCategory[];
  mode: 'create' | 'edit' | 'view';
  onSave: (formData: FormData) => void;
}

function estimateReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return { words, minutes };
}

export const BlogForm: React.FC<BlogFormProps> = ({
  onClose,
  blog,
  categories,
  mode,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [view, setView] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blog && (mode === 'edit' || mode === 'view')) {
      setTitle(blog.title);
      setContent(blog.content);
      const category = categories.find((c) => c.name === blog.categoryName);
      setCategoryId(category?.id || (categories.length > 0 ? categories[0].id : ''));
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
  }, [blog, mode, categories]);

  const applyImage = useCallback((file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyImage(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) applyImage(file);
    },
    [applyImage]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categoryId', categoryId);
    formData.append('view', String(view));
    if (imageFile) formData.append('image', imageFile);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === 'view';
  const { words, minutes } = estimateReadTime(content);

  // Completion progress
  const steps = [
    { label: 'Tiêu đề', done: title.trim().length > 0 },
    { label: 'Nội dung', done: content.trim().length > 50 },
    { label: 'Ảnh bìa', done: !!imagePreview },
    { label: 'Danh mục', done: !!categoryId },
  ];
  const completedCount = steps.filter((s) => s.done).length;
  const progressPercent = (completedCount / steps.length) * 100;

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card rounded-2xl border border-border/40 shadow-2xl overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="relative h-44 shrink-0 overflow-hidden flex items-end px-10 pb-8 border-b border-border/10">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/8 to-background" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-end justify-between w-full">
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-primary/70 hover:text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:translate-x-[-2px] transition-all duration-200 group"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
              Quay lại danh sách
            </button>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary text-primary-foreground rounded-xl shadow-2xl shadow-primary/30 rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-3xl font-[900] tracking-tight text-foreground leading-none">
                  {mode === 'create'
                    ? 'Tạo bài viết mới'
                    : mode === 'edit'
                    ? 'Chỉnh sửa bài viết'
                    : 'Chi tiết bài viết'}
                </h2>
                <p className="text-sm text-muted-foreground font-medium mt-1 leading-none">
                  {mode === 'create'
                    ? 'Chia sẻ tri thức, truyền cảm hứng học tập'
                    : mode === 'edit'
                    ? 'Cập nhật và hoàn thiện nội dung'
                    : 'Xem chi tiết nội dung bài viết'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress badge */}
            {!isView && (
              <div className="hidden md:flex flex-col items-end gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                  Hoàn thiện
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted/60 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-sm font-black text-primary tabular-nums">
                    {completedCount}/{steps.length}
                  </span>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full bg-background/60 hover:bg-background text-foreground backdrop-blur-md transition-all border border-border/40 h-12 w-12 shadow-sm ml-2"
            >
              <X size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Progress Steps (mobile / compact) ── */}
      {!isView && (
        <div className="px-10 pt-6">
          <div className="flex items-center gap-2 flex-wrap">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <motion.div
                  animate={{ scale: step.done ? 1 : 0.95 }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                    step.done
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-muted/40 text-muted-foreground border border-transparent'
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 size={11} className="fill-primary text-primary-foreground" />
                  ) : (
                    <Circle size={11} />
                  )}
                  {step.label}
                </motion.div>
                {i < steps.length - 1 && (
                  <div className={`h-px w-4 ${step.done ? 'bg-primary/30' : 'bg-border/40'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main form ── */}
      <div className="p-10 pt-8">
        <form id="blog-form" onSubmit={handleSubmit} className="space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* ────── LEFT: Title + Content ────── */}
            <div className="lg:col-span-3 space-y-8">
              {/* Title */}
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Type size={13} className="text-primary" />
                  Tiêu đề bài viết
                  {!isView && (
                    <span className="ml-auto text-[10px] font-bold text-muted-foreground/60 normal-case tracking-normal">
                      {title.length} ký tự
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    disabled={isView}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-16 rounded-xl border-none bg-muted/40 focus:ring-4 focus:ring-primary/15 font-bold text-xl transition-all placeholder:text-muted-foreground/35 px-6 shadow-inner disabled:opacity-70 disabled:cursor-default"
                    placeholder="Tiêu đề gợi cảm hứng, ngắn gọn và súc tích..."
                    required
                  />
                  <AnimatePresence>
                    {title.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute right-5 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircle2 size={18} className="text-primary fill-primary/10" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <AlignLeft size={13} className="text-primary" />
                  Nội dung bài viết
                  {!isView && (
                    <div className="ml-auto flex items-center gap-3 normal-case tracking-normal">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60">
                        <Hash size={10} />
                        {words} từ
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60">
                        <Clock size={10} />
                        ~{minutes} phút đọc
                      </span>
                    </div>
                  )}
                </Label>
                <div className="relative">
                  <Textarea
                    disabled={isView}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[420px] rounded-xl border-none bg-muted/40 focus:ring-4 focus:ring-primary/15 font-medium text-[15px] leading-[1.8] transition-all resize-none p-6 shadow-inner disabled:opacity-70 disabled:cursor-default"
                    placeholder="Bắt đầu câu chuyện của bạn — chia sẻ kiến thức, kinh nghiệm, và nguồn cảm hứng..."
                    required
                  />
                  {/* Word count bottom bar */}
                  {!isView && content.length > 0 && (
                    <div className="absolute bottom-4 right-5 flex items-center gap-2">
                      <div
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                          words >= 300
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : words >= 100
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-muted/60 text-muted-foreground'
                        }`}
                      >
                        {words >= 300 ? '✓ Đủ dài' : words >= 100 ? '~ Trung bình' : '· Quá ngắn'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* View mode: metadata */}
              {isView && blog && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-5 rounded-xl bg-muted/30 border border-border/40">
                    <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground block leading-none mb-1">
                        Ngày xuất bản
                      </span>
                      <span className="text-sm font-bold">
                        {new Date(blog.createdDate).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 rounded-xl bg-muted/30 border border-border/40">
                    <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                      <UserIcon size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground block leading-none mb-1">
                        Tác giả
                      </span>
                      <span className="text-sm font-bold">{blog.fullname || blog.userName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ────── RIGHT: Sidebar ────── */}
            <div className="lg:col-span-2 space-y-7">
              {/* Cover Image */}
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <ImageIcon size={13} className="text-primary" />
                  Ảnh bìa bài viết
                </Label>

                <div
                  ref={dropRef}
                  onDragOver={(e) => {
                    if (isView) return;
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => !isView && fileInputRef.current?.click()}
                  className={`relative aspect-[16/10] rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                    isView
                      ? 'border-transparent'
                      : isDragging
                      ? 'border-primary bg-primary/5 scale-[1.01] shadow-xl shadow-primary/10'
                      : imagePreview
                      ? 'border-transparent cursor-pointer hover:shadow-xl hover:shadow-black/10'
                      : 'border-dashed border-border/50 bg-muted/20 cursor-pointer hover:border-primary/50 hover:bg-primary/5 active:scale-[0.99]'
                  }`}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      {!isView && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end pb-6 gap-2">
                          <div className="p-3 bg-white/15 rounded-lg border border-white/25 text-white backdrop-blur-md">
                            <Upload size={20} />
                          </div>
                          <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                            Thay đổi ảnh bìa
                          </span>
                        </div>
                      )}
                      {!isView && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                          className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                          style={{ opacity: 1 }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-muted-foreground/50 transition-colors">
                      <AnimatePresence mode="wait">
                        {isDragging ? (
                          <motion.div
                            key="drag"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col items-center gap-3 text-primary"
                          >
                            <div className="p-5 bg-primary/10 rounded-xl border-2 border-primary/30">
                              <ImageIcon size={36} strokeWidth={1.5} />
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest">
                              Thả ảnh vào đây!
                            </span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="idle"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col items-center gap-3"
                          >
                            <div className="p-5 bg-muted/50 rounded-xl border border-border/20 transition-transform group-hover:scale-110">
                              <Upload size={32} strokeWidth={1.5} />
                            </div>
                            <div className="text-center">
                              <span className="text-[11px] font-black uppercase tracking-[0.2em] block">
                                {isView ? 'Không có ảnh bìa' : 'Tải ảnh lên'}
                              </span>
                              {!isView && (
                                <span className="text-[10px] font-medium tracking-wide mt-0.5 block">
                                  Kéo thả hoặc click để chọn
                                </span>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                {imagePreview && !isView && (
                  <p className="text-[10px] text-center text-muted-foreground/50 font-bold uppercase tracking-widest">
                    Click vào ảnh để thay đổi
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Tag size={13} className="text-primary" />
                  Danh mục bài viết
                </Label>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                  {categories.map((cat) => {
                    const isSelected = categoryId === cat.id;
                    return (
                      <motion.button
                        key={cat.id}
                        type="button"
                        disabled={isView}
                        onClick={() => setCategoryId(cat.id)}
                        whileTap={{ scale: isView ? 1 : 0.97 }}
                        className={`w-full h-[52px] px-5 rounded-xl flex items-center justify-between border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20'
                            : 'bg-muted/30 border-transparent hover:bg-muted/60 hover:border-border/30 text-foreground disabled:opacity-60 disabled:cursor-default'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              isSelected ? 'bg-primary-foreground' : 'bg-muted-foreground/30'
                            }`}
                          />
                          <span className="text-sm font-bold">{cat.name}</span>
                        </div>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, rotate: -20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 20 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            >
                              <Star size={15} className="fill-primary-foreground text-primary-foreground" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Visibility toggle — chỉ hiện khi create hoặc view, KHÔNG hiện khi edit */}
              {mode !== 'edit' && (
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Eye size={13} className="text-primary" />
                    Chế độ hiển thị
                  </Label>
                  <div className="relative flex gap-2 p-2 bg-muted/40 rounded-xl h-[60px] shadow-inner">
                    <motion.div
                      className="absolute top-2 bottom-2 rounded-lg z-0"
                      animate={{
                        left: view ? '8px' : 'calc(50% + 4px)',
                        width: 'calc(50% - 12px)',
                        backgroundColor: view ? 'rgb(16 185 129)' : 'rgb(245 158 11)',
                        boxShadow: view
                          ? '0 8px 24px -4px rgba(16,185,129,0.35)'
                          : '0 8px 24px -4px rgba(245,158,11,0.35)',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                    <button
                      type="button"
                      disabled={isView}
                      onClick={() => setView(true)}
                      className={`relative z-10 flex-1 flex items-center justify-center gap-2.5 rounded-lg transition-colors duration-200 ${
                        view ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Globe size={15} />
                      <span className="text-[11px] font-black uppercase tracking-widest">Công khai</span>
                    </button>
                    <button
                      type="button"
                      disabled={isView}
                      onClick={() => setView(false)}
                      className={`relative z-10 flex-1 flex items-center justify-center gap-2.5 rounded-lg transition-colors duration-200 ${
                        !view ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Lock size={15} />
                      <span className="text-[11px] font-black uppercase tracking-widest">Tạm ẩn</span>
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={String(view)}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className={`text-[11px] font-semibold px-1 ${
                        view ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {view
                        ? '✓ Bài viết sẽ được hiển thị công khai trên trang tin tức'
                        : '· Bài viết sẽ bị ẩn khỏi giao diện người dùng'}
                    </motion.p>
                  </AnimatePresence>
                </div>
              )}

              {/* View mode info card */}
              {isView && blog && (
                <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Zap size={15} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground block">
                        Số lượt reacts
                      </span>
                      <span className="text-sm font-bold">{blog.emojis} lượt</span>
                    </div>
                  </div>
                  {blog.readTime && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Clock size={15} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground block">
                          Thời gian đọc
                        </span>
                        <span className="text-sm font-bold">{blog.readTime} phút</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Footer Actions ── */}
          <div className="pt-10 mt-10 border-t border-border/30">
            {isView ? (
              <Button
                onClick={onClose}
                className="w-full h-14 rounded-xl font-black uppercase tracking-[0.2em] bg-muted hover:bg-muted/80 text-foreground transition-all active:scale-[0.98]"
              >
                Đóng xem chi tiết
              </Button>
            ) : (
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1 h-14 rounded-xl font-black uppercase tracking-[0.15em] hover:bg-muted text-muted-foreground border-2 border-transparent hover:border-border/40 transition-all active:scale-[0.97]"
                >
                  Hủy bỏ
                </Button>
                <Button
                  form="blog-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2.5] h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.15em] shadow-2xl shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Zap size={18} className="fill-primary-foreground" />
                      {mode === 'create' ? 'Xuất bản bài viết' : 'Cập nhật bài viết'}
                      <div className="ml-1 p-1 border-l border-white/20 pl-3 group-hover:pl-4 transition-all duration-300">
                        <ArrowRight size={18} />
                      </div>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};
