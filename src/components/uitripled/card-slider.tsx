"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { animate, motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Star, Users } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { Course } from "@/modules/course/types";

interface CardsSliderProps {
  courses: Course[];
  title?: string;
}

export function CardsSlider({ courses, title = "Khóa học liên quan" }: CardsSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
        // Recalculate width after a short delay to ensure layout is settled
        const timer = setTimeout(() => {
            if (containerRef.current) {
                setWidth(
                    Math.max(0, containerRef.current.scrollWidth - containerRef.current.offsetWidth)
                );
            }
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [courses]);

  if (!courses || courses.length === 0) {
      console.log("CardsSlider: No courses to display");
      return null;
  }

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="w-full mx-auto py-12 relative group/slider">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase tracking-[0.2em] text-sm opacity-70">
          {title}
        </h2>
        <div className="flex gap-2">
            <button
              onClick={() => scrollTo("left")}
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 disabled:opacity-50"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollTo("right")}
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 disabled:opacity-50"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      </div>

      <motion.div
        ref={containerRef}
        className="cursor-grab active:cursor-grabbing overflow-hidden px-4 py-8 -mx-4 -my-8"
        whileTap={{ cursor: "grabbing" }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          dragElastic={0.1}
          style={{ x }}
          className="flex gap-6"
        >
          {courses.map((course) => {
            const discountPercent = course.discountPercent || (course.price > course.salePrice 
                ? Math.round(((course.price - course.salePrice) / course.price) * 100)
                : 0);

            // Generate a consistent random number for social proof
            const seed = (course.id || course.title || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const studentCount = course.totalStudents || Math.floor((Math.abs(Math.sin(seed) * 10000) % 5000) + 500);

            return (
                <motion.div
                  key={course.id}
                  className="min-w-[320px] max-w-[320px] h-[450px]"
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <Link href={`/course/${course.slug}`}>
                    <Card className="group relative h-full overflow-hidden rounded-3xl border-border/40 bg-background/40 backdrop-blur-md transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={course.thumbnailUrl || course.thumbnail}
                          alt={course.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60" />
    
                        {discountPercent > 0 && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 px-3 py-1 text-[10px] font-bold">
                              -{discountPercent}%
                            </Badge>
                          </div>
                        )}
    
                        {/* Hover Overlay Action */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-black shadow-lg">
                            Xem chi tiết
                          </div>
                        </div>
                      </div>
    
                      {/* Content Section */}
                      <div className="p-6 flex flex-col h-[calc(100%-12rem)] justify-between">
                        <div className="space-y-3">
                          <h3 className="text-lg font-bold leading-tight tracking-tight text-foreground line-clamp-2 transition-colors group-hover:text-primary">
                            {course.title}
                          </h3>
                          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                            {course.description}
                          </p>
                          
                          <div className="flex items-center gap-4 pt-1">
                             <div className="flex items-center gap-1 text-xs">
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                <span className="font-bold">{course.averageRate || course.rating || 4.8}</span>
                             </div>
                             <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="h-3 w-3" />
                                <span>{studentCount.toLocaleString()} học viên</span>
                             </div>
                          </div>
                        </div>
    
                        <div className="pt-4 mt-auto border-t border-border/40 flex flex-col gap-2">
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6 border border-border/50 ring-2 ring-background">
                                  <AvatarImage
                                    src={course.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.author?.name || 'Hoang'}`}
                                    alt={course.author?.name}
                                  />
                                  <AvatarFallback>{course.author?.name?.[0] || 'A'}</AvatarFallback>
                                </Avatar>
                                <span className="text-[10px] font-medium text-foreground/70">
                                  {course.author?.name || "Quản trị viên"}
                                </span>
                             </div>
                             <div className="flex flex-col items-end">
                                {discountPercent > 0 && (
                                    <span className="text-[10px] text-muted-foreground line-through decoration-red-500/50">
                                        {formatPrice(course.price)}
                                    </span>
                                )}
                                <span className="text-sm font-bold text-primary">
                                    {formatPrice(course.salePrice || course.price)}
                                </span>
                             </div>
                           </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
