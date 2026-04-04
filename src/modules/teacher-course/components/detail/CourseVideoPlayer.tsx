'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Video, AlertTriangle, UploadCloud, X, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { getEmbedUrl } from '@/lib/utils';
import { itemVariants, formatCurrency } from './constants';
import { useUploadVideoPreview } from '../../hooks/useUploadVideoPreview';
import { toast } from '@/components/ui/toast';

interface CourseVideoPlayerProps {
  course: any;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  onReload?: () => void;
}

/** Định dạng bytes thành chuỗi dễ đọc */
const formatBytes = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const CourseVideoPlayer = ({ course, isPlaying, setIsPlaying, onReload }: CourseVideoPlayerProps) => {
  const thumbnail = course.thumbnailUrl || 'https://placehold.co/1280x720/1e1e2e/6366f1?text=VIC+Course';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isUploading, progress, error: uploadError, uploadVideoPreview, cancelUpload } = useUploadVideoPreview();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra dung lượng video
    const MAX_VIDEO_MB = 300;
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      toast.error(`Video quá lớn. Vui lòng chọn video dưới ${MAX_VIDEO_MB}MB (hiện tại: ${(file.size / 1024 / 1024).toFixed(1)}MB).`);
      e.target.value = '';
      return;
    }

    // Reset input để có thể chọn lại cùng file
    e.target.value = '';

    const ok = await uploadVideoPreview(course.id, file);
    if (ok) {
      toast.success('Upload video preview thành công!');
      onReload?.();
    } else if (uploadError) {
      toast.error(uploadError);
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleCancel = () => {
    cancelUpload();
    toast.error('Đã hủy upload video.');
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur aspect-video shadow-2xl shadow-primary/5">
        {!isPlaying ? (
          <div className="relative h-full w-full bg-gradient-to-br from-primary/10 via-primary/5 to-background/50">
            <img
              src={thumbnail}
              alt={course.title}
              className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/1280x720/1e1e2e/6366f1?text=VIC+Course'; }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              {course.videoPreview ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(true)}
                  className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/50 bg-white/10 backdrop-blur-md transition-all hover:border-primary hover:bg-primary/20 hover:text-primary text-white"
                >
                  <Play className="h-8 w-8 ml-1" fill="currentColor" />
                </motion.button>
              ) : isUploading && progress ? (
                /* ── Đang upload: Progress UI ── */
                <div className="flex flex-col items-center gap-5 w-64 px-4">
                  {/* Vòng progress tròn */}
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                      <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                      <circle
                        cx="48" cy="48" r="40"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress.percent / 100)}`}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-black text-lg">{progress.percent}%</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-center space-y-1">
                    <p className="text-white font-black text-sm uppercase tracking-widest">
                      {progress.percent === 100 ? 'Đang xử lý trên server...' : 'Đang tải lên...'}
                    </p>
                    <p className="text-white/60 text-[11px] font-bold">
                      {formatBytes(progress.loaded)} / {formatBytes(progress.total)}
                    </p>
                    {progress.speedMBps > 0 && progress.percent < 100 && (
                      <p className="text-primary/90 text-[11px] font-black uppercase tracking-wider">
                        {progress.speedMBps < 1
                          ? `${(progress.speedMBps * 1024).toFixed(0)} KB/s`
                          : `${progress.speedMBps.toFixed(1)} MB/s`}
                      </p>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>

                  {/* Cancel */}
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/30 transition-colors cursor-pointer"
                  >
                    <X size={12} /> Hủy upload
                  </button>
                </div>
              ) : (
                /* ── Chưa có video ── */
                <div className="flex flex-col items-center gap-4">
                  <div className="flex flex-col items-center gap-2 text-white/80 scale-100 group-hover:scale-110 transition-transform">
                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border-2 border-dashed border-white/20 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                      <UploadCloud className="h-8 w-8 text-white/40 group-hover:text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black uppercase tracking-[0.15em]">Tải lên Video Preview</p>
                      <p className="text-[10px] text-white/40 font-bold uppercase mt-1 italic tracking-widest">Định dạng MP4 • Tối đa 300MB</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openFilePicker}
                    className="rounded-full px-8 bg-white/10 text-white border-white/20 hover:bg-primary hover:border-primary hover:text-white transition-all font-black uppercase text-[10px] tracking-widest h-10 shadow-xl cursor-pointer"
                  >
                    Chọn Video
                  </Button>
                </div>
              )}
            </div>

            {/* Price overlay */}
            <div className="absolute top-5 right-5">
              {course.isFree || course.price === 0 ? (
                <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-primary/90 text-primary-foreground backdrop-blur-sm">MIỄN PHÍ</span>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  {course.salePrice > 0 && course.salePrice < course.price && (
                    <span className="text-xs text-white/50 line-through">{formatCurrency(course.price)}</span>
                  )}
                  <span className="px-3 py-1.5 rounded-xl text-sm font-black bg-black/60 text-white backdrop-blur-sm">
                    {formatCurrency(course.salePrice > 0 ? course.salePrice : course.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom overlay */}
            <div className="absolute bottom-6 left-6 flex items-center gap-3 text-white pointer-events-none">
              <div className="h-10 w-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/60 uppercase tracking-widest">Preview khoá học</p>
                <p className="font-bold text-sm">{course.title}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-black relative flex items-center justify-center">
            {getEmbedUrl(course.videoPreview) ? (
              <iframe
                width="100%"
                height="100%"
                src={getEmbedUrl(course.videoPreview) || ''}
                title="Course Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-white/60">
                <AlertTriangle className="h-8 w-8 text-white/40" />
                <p className="text-sm font-bold uppercase tracking-widest text-white/80">Video không khả dụng</p>
                <Button variant="outline" size="sm" className="mt-2 rounded-full px-6 bg-white/5 text-white border-white/10 hover:bg-white/10 hover:text-white" onClick={() => setIsPlaying(false)}>
                  Đóng
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Nút thay đổi video (chỉ hiện khi đã có video và không đang upload) */}
      {course.videoPreview && !isUploading && (
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
          {/* Hiển thị Link Video */}
          <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
            <p className="text-[10px] font-black uppercase text-muted-foreground/70 tracking-widest mb-1.5 ml-1">Liên kết Video Giới thiệu</p>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={course.videoPreview !== '__uploaded__' ? course.videoPreview : 'Đang tiếp tục xử lý...'} 
                className="flex-1 bg-background border border-border/60 rounded-lg h-10 px-3 text-xs font-medium text-foreground focus:outline-none"
              />
              <Button 
                variant="outline" 
                className="h-10 px-4 shrink-0 rounded-lg hover:bg-primary hover:border-primary hover:text-white transition-colors border-border/60 cursor-pointer"
                onClick={() => {
                  if (course.videoPreview && course.videoPreview !== '__uploaded__') {
                    navigator.clipboard.writeText(course.videoPreview);
                    toast.success('Đã sao chép liên kết video!');
                  }
                }}
              >
                <Copy size={14} className="mr-1.5" />
                <span className="text-xs font-bold uppercase tracking-wider">Copy</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-10 w-10 p-0 shrink-0 rounded-lg hover:bg-primary hover:border-primary hover:text-white transition-colors border-border/60 cursor-pointer"
                onClick={() => {
                  if (course.videoPreview && course.videoPreview !== '__uploaded__') {
                    window.open(course.videoPreview, '_blank');
                  }
                }}
                title="Mở trong tab mới"
              >
                <ExternalLink size={16} />
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={openFilePicker}
            className="w-full rounded-xl border-dashed border-primary/40 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.2em] h-12 shadow-sm flex items-center justify-center gap-3 cursor-pointer"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Thay đổi Video giới thiệu</span>
          </Button>
        </motion.div>
      )}

      {/* Progress bar dưới player (khi đang thay video — đã có video cũ) */}
      {course.videoPreview && isUploading && progress && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/40 bg-card p-4 space-y-3"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-black text-foreground uppercase tracking-wider text-xs">
              {progress.percent === 100 ? 'Đang xử lý trên server...' : 'Đang upload video mới...'}
            </span>
            <div className="flex items-center gap-4">
              {progress.speedMBps > 0 && progress.percent < 100 && (
                <span className="text-primary font-black text-xs">
                  {progress.speedMBps < 1
                    ? `${(progress.speedMBps * 1024).toFixed(0)} KB/s`
                    : `${progress.speedMBps.toFixed(1)} MB/s`}
                </span>
              )}
              <span className="text-muted-foreground text-xs font-bold">{formatBytes(progress.loaded)} / {formatBytes(progress.total)}</span>
              <span className="font-black text-foreground text-xs">{progress.percent}%</span>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 text-rose-500 hover:text-rose-600 text-xs font-black uppercase cursor-pointer"
              >
                <X size={12} /> Hủy
              </button>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};
