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
      <div className="h-[250px] md:h-auto md:col-span-4 md:row-span-2 relative group overflow-hidden rounded-3xl bg-neutral-900 border border-border/50 shadow-2xl shadow-primary/10">
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
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        </motion.div>

        {/* Floating background glow */}
        <div className="absolute top-0 right-0 h-64 w-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="absolute inset-0 p-5 md:p-14 flex flex-col justify-end pb-10 md:pb-24 space-y-3 md:space-y-8">
          <div className="space-y-1.5 md:space-y-5 max-w-2xl">
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               key={`badge-${currentIndex}`}
             >
               <Badge className="w-fit bg-primary/20 backdrop-blur-xl text-primary border border-primary/30 font-black uppercase tracking-[0.2em] text-[7px] md:text-[10px] px-2.5 md:px-4 py-0.5 md:py-1 rounded-full shadow-lg">
                  <Sparkles className="h-2 w-2 md:h-3 md:w-3 mr-1 md:mr-2 text-primary" />
                  Khóa học tiêu điểm
               </Badge>
             </motion.div>
             
             <motion.h2 
               key={`title-${currentIndex}`}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-lg md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-xl line-clamp-2"
             >
               {currentCourse.title}
             </motion.h2>
             
             <motion.p 
                key={`desc-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 font-bold max-w-xl text-[10px] md:text-xl leading-relaxed line-clamp-1 md:line-clamp-2"
             >
               {currentCourse.description}
             </motion.p>
          </div>
          
          <div key={currentCourse.id} className="pt-1">
            <Link href={`/course/${currentCourse.slug}`}>
              <Button size="sm" className="md:h-14 md:px-10 h-9 px-5 rounded-xl md:rounded-2xl font-black gap-2 shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-[11px] md:text-lg bg-primary hover:bg-primary/90 text-primary-foreground border-none">
                <PlayCircle className="h-3.5 w-3.5 md:h-6 md:w-6" /> Học ngay
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-20">
          {featuredCourses.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 md:h-2 rounded-full transition-all duration-500 hover:bg-white/50 ${i === currentIndex ? 'w-8 md:w-12 bg-primary' : 'w-2 md:w-3 bg-white/30'}`}
            />
          ))}
        </div>
      </div>

      {/* Side Promotion 1 - Top Right */}
      <div className="h-[220px] md:h-auto md:col-span-2 relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 md:p-8 flex flex-col justify-between group cursor-pointer shadow-xl transition-all hover:translate-y-[-4px] hover:border-primary/50">
        <div className="absolute -right-10 -top-10 bg-primary/10 rounded-full h-40 w-40 blur-[60px]" />
        
        <div className="relative z-10 space-y-3 md:space-y-4">
          <div className="bg-primary/10 backdrop-blur-xl w-fit p-2.5 md:p-3.5 rounded-xl border border-primary/20 shadow-inner">
            <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-primary" />
          </div>
          <h3 className="text-2xl md:text-4xl font-black text-foreground leading-tight tracking-tighter">
            Ưu đãi sinh viên <br /> <span className="text-3xl md:text-5xl text-primary drop-shadow-sm">-50% OFF</span>
          </h3>
          <p className="text-[9px] md:text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase bg-muted/50 w-fit px-2 py-0.5 rounded-md border border-border/50">Mã: SINHVIEN2024</p>
        </div>
        <div className="relative z-10">
          <Button className="h-10 md:h-14 rounded-xl md:rounded-2xl bg-primary text-primary-foreground border-none font-black px-6 md:px-8 hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all text-xs md:text-base flex items-center gap-2">
            Lấy mã ngay <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Row - Career & Gift (Single row on mobile, separate cells on desktop) */}
      <div className="grid grid-cols-2 gap-6 md:contents md:col-span-2">
        {/* Row 2 - Bottom Right 1 */}
        <div className="h-[140px] md:h-full md:col-span-1 relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 md:p-8 flex flex-col justify-between group cursor-pointer hover:border-primary/50 transition-all hover:bg-accent/5 shadow-lg">
          <div className="bg-primary/10 h-10 w-10 md:h-16 md:w-16 rounded-xl md:rounded-2xl flex items-center justify-center border border-primary/20 group-hover:bg-primary transition-all shadow-md">
            <Rocket className="h-5 w-5 md:h-8 md:w-8 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
          <div className="space-y-1 pt-2 md:pt-4">
            <h3 className="text-sm md:text-xl font-black leading-tight text-foreground">Lộ trình <br /> Sự nghiệp</h3>
            <p className="text-[7px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em]">Miễn phí 1-1</p>
          </div>
        </div>

        {/* Row 2 - Bottom Right 2 */}
        <div className="h-[140px] md:h-full md:col-span-1 relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 md:p-8 flex flex-col justify-between group cursor-pointer hover:border-primary/50 transition-all hover:bg-accent/5 shadow-lg">
          <div className="bg-primary/10 h-10 w-10 md:h-16 md:w-16 rounded-xl md:rounded-2xl flex items-center justify-center border border-primary/20 group-hover:bg-primary transition-all shadow-md">
            <Gift className="h-5 w-5 md:h-8 md:w-8 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
          <div className="space-y-1 pt-2 md:pt-4">
            <h3 className="text-sm md:text-xl font-black leading-tight text-foreground">Quà tặng <br /> Tân thủ</h3>
            <p className="text-[7px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em]">Nhận ngay 200k</p>
          </div>
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
