import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Video, AlertTriangle, UploadCloud } from 'lucide-react';
import { getEmbedUrl } from '@/lib/utils';
import { itemVariants, formatCurrency } from './constants';

interface CourseVideoPlayerProps {
  course: any;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
}

export const CourseVideoPlayer = ({ course, isPlaying, setIsPlaying }: CourseVideoPlayerProps) => {
  const thumbnail = course.thumbnailUrl || 'https://placehold.co/1280x720/1e1e2e/6366f1?text=VIC+Course';

  return (
    <div className="space-y-4">
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
              ) : (
                  <div className="flex flex-col items-center gap-4">
                      <div className="flex flex-col items-center gap-2 text-white/80 scale-100 group-hover:scale-110 transition-transform">
                          <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border-2 border-dashed border-white/20 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                              <UploadCloud className="h-8 w-8 text-white/40 group-hover:text-primary" />
                          </div>
                          <div className="text-center">
                              <p className="text-sm font-black uppercase tracking-[0.15em]">Tải lên Video Preview</p>
                              <p className="text-[10px] text-white/40 font-bold uppercase mt-1 italic tracking-widest">Định dạng MP4 • Tối đa 50MB</p>
                          </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full px-8 bg-white/10 text-white border-white/20 hover:bg-primary hover:border-primary hover:text-white transition-all font-black uppercase text-[10px] tracking-widest h-10 shadow-xl">
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

      {course.videoPreview && (
          <motion.div variants={itemVariants}>
             <Button variant="outline" className="w-full rounded-xl border-dashed border-primary/40 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.2em] h-12 shadow-sm flex items-center justify-center gap-3">
                <UploadCloud className="h-4 w-4" />
                <span>Thay đổi Video giới thiệu</span>
             </Button>
          </motion.div>
      )}
    </div>
  );
};
