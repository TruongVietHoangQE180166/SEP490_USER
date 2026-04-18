"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Course } from "@/modules/course/types";
import { CourseCard } from "@/modules/course/components/CourseCard";
import { CourseSkeleton } from "@/modules/course/components/CourseSkeleton";

interface CardsSliderProps {
  courses: Course[];
  title?: string;
  isLoading?: boolean;
}

export function CardsSlider({ courses, title, isLoading }: CardsSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const calculateWidth = () => {
      if (innerRef.current && containerRef.current) {
        const totalWidth = innerRef.current.scrollWidth;
        const visibleWidth = containerRef.current.offsetWidth;
        setWidth(Math.max(0, totalWidth - visibleWidth));
      }
    };

    calculateWidth();
    const timer = setTimeout(calculateWidth, 100);
    window.addEventListener('resize', calculateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateWidth);
    };
  }, [courses, isLoading]);

  const scrollTo = (direction: "left" | "right") => {
    const currentX = x.get();
    const containerWidth = containerRef.current?.offsetWidth || 0;
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    // On mobile: 300px card + 16px gap = 316px. Desktop: 320px card + 24px gap = 344px.
    const scrollAmount = isMobile ? 316 : 344; 

    let newX =
      direction === "left" ? currentX + scrollAmount : currentX - scrollAmount;

    newX = Math.max(Math.min(newX, 0), -width);

    animate(x, newX, {
      type: "spring",
      stiffness: isMobile ? 400 : 300,
      damping: 40,
    });
  };

  if (courses.length === 0 && !isLoading) return null;

  return (
    <div className="w-full max-w-8xl mx-auto px-6 py-2 relative group/slider overflow-hidden">
      {(title || isLoading) && (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase italic px-1">
                {title || (isLoading && <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary animate-pulse" /><span className="text-muted-foreground/40 italic lowercase text-sm font-medium tracking-widest">đang tải dữ liệu...</span></div>)}
            </h2>
            {!isLoading && (
              <div className="flex gap-2">
                  <button
                      onClick={() => scrollTo("left")}
                      className="h-10 w-10 rounded-full bg-secondary/50 backdrop-blur-md border border-border/50 shadow-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all active:scale-95 disabled:opacity-30"
                      aria-label="Scroll left"
                  >
                      <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                      onClick={() => scrollTo("right")}
                      className="h-10 w-10 rounded-full bg-secondary/50 backdrop-blur-md border border-border/50 shadow-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all active:scale-95 disabled:opacity-30"
                      aria-label="Scroll right"
                  >
                      <ChevronRight className="w-5 h-5" />
                  </button>
              </div>
            )}
        </div>
      )}

      <motion.div
        ref={containerRef}
        className="cursor-grab active:cursor-grabbing pb-8"
        whileTap={{ cursor: "grabbing" }}
      >
        <motion.div
          ref={innerRef}
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          dragElastic={0.1}
          style={{ x }}
          className="flex gap-4 md:gap-6"
        >
          {isLoading 
            ? Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="min-w-[300px] max-w-[300px] md:min-w-[320px] md:max-w-[320px] shrink-0">
                  <CourseSkeleton />
                </div>
              ))
            : courses.map((course) => (
                <motion.div
                  key={course.id}
                  className="min-w-[300px] max-w-[300px] md:min-w-[320px] md:max-w-[320px] shrink-0"
                >
                  <CourseCard course={course} />
                </motion.div>
              ))
          }
        </motion.div>
      </motion.div>
    </div>
  );
}
