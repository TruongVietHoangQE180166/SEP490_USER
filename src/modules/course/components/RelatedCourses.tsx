"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Course } from "@/modules/course/types";
import { CourseCard } from "@/modules/course/components/CourseCard";
import { cn } from "@/lib/utils";
import { useCourses } from "../hooks/useCourse";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedCoursesProps {
  currentCourseId: string;
  title?: string;
  className?: string;
}

export function RelatedCourses({ currentCourseId, title = "Khóa học liên quan", className }: RelatedCoursesProps) {
  const { courses: allCourses, isLoading } = useCourses();
  
  const courses = allCourses.filter(c => c.id !== currentCourseId);

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
        const updateWidth = () => {
            if (containerRef.current) {
                setWidth(
                    Math.max(0, containerRef.current.scrollWidth - containerRef.current.offsetWidth)
                );
            }
        };

        // Update initially and after a slight delay for images/layout
        updateWidth();
        setTimeout(updateWidth, 500);

        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }
  }, [courses]);

  const scrollTo = (direction: "left" | "right") => {
    const currentX = x.get();
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const scrollAmount = containerWidth * 0.8; 

    let newX =
      direction === "left" ? currentX + scrollAmount : currentX - scrollAmount;

    // Clamp values
    newX = Math.max(Math.min(newX, 0), -width);

    animate(x, newX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 1,
    });
  };

  if (isLoading) {
    return (
      <div className={cn("w-full py-10", className)}>
        <Skeleton className="h-8 w-48 mb-8 rounded-full" />
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="min-w-[300px] h-[380px] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) return null;

  return (
    <div className={cn("w-full relative group/slider", className)}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground/90 uppercase tracking-[0.1em]">
          {title}
        </h2>
        <div className="flex gap-2">
            <button
              onClick={() => scrollTo("left")}
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 disabled:opacity-50 z-10"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollTo("right")}
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 disabled:opacity-50 z-10"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      </div>

      <motion.div
        ref={containerRef}
        className="cursor-grab active:cursor-grabbing overflow-hidden px-1 py-4 -mx-1 -my-4"
        whileTap={{ cursor: "grabbing" }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          dragElastic={0.1}
          style={{ x }}
          className="flex gap-6"
        >
          {courses.map((course, idx) => (
            <motion.div
              key={course.id || idx}
              className="min-w-[300px] max-w-[320px]"
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
                {/* Reuse the existing CourseCard component but wrapped in the slider structure */}
                <div className="h-full">
                     <CourseCard course={course} />
                </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
