'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { BlogPost } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useBlogCarousel } from '../hooks/useBlogCarousel';

interface BlogCarouselProps {
  posts: BlogPost[];
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 1.05
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 150, damping: 25 },
      opacity: { duration: 0.6 },
      scale: { duration: 0.8 }
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: 'spring' as const, stiffness: 150, damping: 25 },
      opacity: { duration: 0.6 }
    }
  }),
};

export const BlogCarousel = ({ posts }: BlogCarouselProps) => {
  const { 
    currentIndex, 
    direction, 
    nextSlide, 
    prevSlide, 
    setSlide, 
    currentPost 
  } = useBlogCarousel(posts);

  if (posts.length === 0) return null;

  return (
    <div className="group relative w-full overflow-hidden rounded-xl border border-border/50 bg-neutral-950 shadow-2xl h-[600px]">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <Link href={`/blog/${currentPost.slugName}`} className="block h-full w-full">
            <div className="relative h-full w-full overflow-hidden">
              <motion.img
                src={currentPost.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200'}
                alt={currentPost.title}
                className="h-full w-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2 }}
              />
              
              {/* Dynamic Gradient Overlay - Fixed black to ensure text readability in both modes */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent hidden md:block" />

              {/* Content Box */}
              <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="max-max-w-4xl"
                >
                  <Badge className="mb-6 bg-primary/90 hover:bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-2xl border-none">
                    {currentPost.categoryName}
                  </Badge>
                  
                  <h2 className="mb-6 text-4xl font-black tracking-tight text-white md:text-6xl lg:text-7xl drop-shadow-2xl leading-[1.1]">
                    {currentPost.title}
                  </h2>
                  
                  <p className="mb-8 line-clamp-2 text-lg font-medium text-white/80 drop-shadow-lg md:text-xl max-w-2xl leading-relaxed">
                    {currentPost.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-white/90 drop-shadow-md">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <Avatar className="h-8 w-8 border border-white/20">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentPost.userName}`} alt={currentPost.userName} />
                        <AvatarFallback>{currentPost.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{currentPost.userName}</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 font-medium">
                      <span>{new Date(currentPost.createdDate).toLocaleDateString('vi-VN')}</span>
                      <span>•</span>
                      <span>{currentPost.readTime} phút đọc</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {posts.length > 1 && (
        <>
          {/* Left Arrow */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 overflow-hidden py-4 px-2">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="group-hover:translate-x-0 transition-transform duration-700 ease-out"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.preventDefault(); prevSlide(); }}
                className="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl border border-white/10 transition-all duration-300 transform group-hover:scale-105 opacity-0 group-hover:opacity-100 shadow-2xl"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </motion.div>
          </div>

          {/* Right Arrow */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 overflow-hidden py-4 px-2">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="group-hover:translate-x-0 transition-transform duration-700 ease-out"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.preventDefault(); nextSlide(); }}
                className="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl border border-white/10 transition-all duration-300 transform group-hover:scale-105 opacity-0 group-hover:opacity-100 shadow-2xl"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 py-2 px-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/5">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.preventDefault(); setSlide(index); }}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-700',
                  index === currentIndex
                    ? 'w-10 bg-primary shadow-lg'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
