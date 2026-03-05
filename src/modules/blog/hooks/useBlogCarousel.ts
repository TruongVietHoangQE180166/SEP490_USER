'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BlogPost } from '../types';

export const useBlogCarousel = (posts: BlogPost[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    if (posts.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  }, [posts.length]);

  const prevSlide = useCallback(() => {
    if (posts.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  }, [posts.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (posts.length > 1) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
  }, [nextSlide, posts.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer, currentIndex]);

  const setSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [posts.length]);

  const safeIndex = currentIndex >= posts.length ? 0 : currentIndex;

  return {
    currentIndex: safeIndex,
    direction,
    nextSlide,
    prevSlide,
    setSlide,
    currentPost: posts[safeIndex],
  };
};
