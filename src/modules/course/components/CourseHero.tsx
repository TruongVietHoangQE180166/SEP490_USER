'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, Sparkles, Rocket, Gift } from 'lucide-react';
import { useCourseHero } from '../hooks/useCourseHero';
import { Course } from '../types';
import Link from 'next/link';

import { Skeleton } from '@/components/ui/skeleton';

export const CourseHero = ({ featuredCourses }: { featuredCourses: Course[] }) => {
  const { currentIndex, setCurrentIndex, currentCourse } = useCourseHero(featuredCourses);

  if (!currentCourse) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 h-auto md:h-[650px]">
        <Skeleton className="md:col-span-4 md:row-span-2 rounded-2xl" />
        <Skeleton className="md:col-span-2 rounded-2xl" />
        <Skeleton className="md:col-span-1 rounded-2xl" />
        <Skeleton className="md:col-span-1 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 h-auto md:h-[650px]">
      {/* Main Carousel - Bento Item 1 - Larger span */}
      <div className="md:col-span-4 md:row-span-2 relative group overflow-hidden rounded-3xl bg-neutral-900 border border-border/50 shadow-2xl shadow-primary/10">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0"
        >
          <img
            src={currentCourse.thumbnailUrl || currentCourse.thumbnail}
            alt={currentCourse.title}
            className="w-full h-full object-cover opacity-100"
          />
          {/* Dark scrim for white text contrast */}
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
        </motion.div>

        {/* Floating background glow */}
        <div className="absolute top-0 right-0 h-96 w-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="absolute inset-0 p-8 md:p-14 flex flex-col justify-end pb-24 space-y-8">
          <div className="space-y-5 max-w-2xl">
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               key={`badge-${currentIndex}`}
             >
               <Badge className="w-fit bg-primary/20 backdrop-blur-xl text-primary border border-primary/30 font-black uppercase tracking-[0.2em] text-[10px] px-4 py-1.5 rounded-full shadow-lg">
                  <Sparkles className="h-3 w-3 mr-2 text-primary" />
                  Khóa học tiêu điểm
               </Badge>
             </motion.div>
             
             <motion.h2 
               key={`title-${currentIndex}`}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-3xl md:text-6xl font-black text-white leading-[1.05] tracking-tight drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]"
             >
               {currentCourse.title}
             </motion.h2>
             
             <motion.p 
                key={`desc-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/90 font-bold max-w-xl text-base md:text-xl leading-relaxed line-clamp-2 drop-shadow-lg"
             >
               {currentCourse.description}
             </motion.p>
          </div>
          
          <div key={currentCourse.id} className="flex flex-wrap items-center gap-6 pt-4">
            <Link href={`/course/${currentCourse.slug}`}>
              <Button size="lg" className="h-14 px-10 rounded-2xl font-black gap-3 shadow-[0_20px_40px_-10px_rgba(var(--primary),0.5)] hover:scale-105 active:scale-95 transition-all text-lg bg-primary hover:bg-primary/90 text-primary-foreground border-none">
                <PlayCircle className="h-6 w-6" /> Bắt đầu học ngay
              </Button>
            </Link>
            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl px-6 py-3">
                <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 w-10 rounded-full border-2 border-white/30 overflow-hidden ring-2 ring-primary/30">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 888}`} className="h-full w-full object-cover" alt="" />
                        </div>
                    ))}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-black text-white tracking-wide">12,000+ Học viên</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">Đang tham gia học</span>
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {featuredCourses.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-500 hover:bg-white/50 ${i === currentIndex ? 'w-12 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.8)]' : 'w-3 bg-white/30'}`}
            />
          ))}
        </div>
      </div>

      {/* Side Promotion 1 - Top Right */}
      <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 flex flex-col justify-between group cursor-pointer shadow-xl transition-all hover:translate-y-[-4px] hover:border-primary/50">
        <div className="absolute -right-10 -top-10 bg-primary/10 rounded-full h-48 w-48 blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
        <div className="absolute -left-10 -bottom-10 bg-primary/5 rounded-full h-48 w-48 blur-[80px]" />
        
        <div className="relative z-10 space-y-4">
          <div className="bg-primary/10 backdrop-blur-xl w-fit p-3.5 rounded-2xl border border-primary/20 shadow-inner">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight tracking-tighter">
            Ưu đãi sinh viên <br /> <span className="text-4xl md:text-5xl text-primary drop-shadow-sm">-50% OFF</span>
          </h3>
          <p className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase bg-muted/50 w-fit px-3 py-1 rounded-lg border border-border/50">Mã: SINHVIEN2024</p>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <Button className="h-14 rounded-2xl bg-primary text-primary-foreground border-none font-black px-8 hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all flex items-center gap-2">
            Lấy mã ngay <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Row 2 - Bottom Right 1 */}
      <div className="md:col-span-1 relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 flex flex-col justify-between group cursor-pointer hover:border-primary/50 transition-all hover:bg-accent/5 shadow-lg">
        <div className="bg-primary/10 h-16 w-16 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:scale-110 transition-all duration-500 shadow-md shadow-primary/10">
          <Rocket className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
        </div>
        <div className="space-y-1.5 pt-4">
          <h3 className="text-xl font-black leading-tight text-foreground">Lộ trình <br /> Sự nghiệp</h3>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Miễn phí 1-1</p>
        </div>
      </div>

      {/* Row 2 - Bottom Right 2 */}
      <div className="md:col-span-1 relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 flex flex-col justify-between group cursor-pointer hover:border-primary/50 transition-all hover:bg-accent/5 shadow-lg">
        <div className="bg-primary/10 h-16 w-16 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:scale-110 transition-all duration-500 shadow-md shadow-primary/10">
          <Gift className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
        </div>
        <div className="space-y-1.5 pt-4">
          <h3 className="text-xl font-black leading-tight text-foreground">Quà tặng <br /> Tân thủ</h3>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Nhận ngay 200k</p>
        </div>
      </div>
    </div>
  );
};

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
