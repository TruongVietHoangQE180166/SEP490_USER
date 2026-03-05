import { useState, useEffect } from 'react';
import { Course } from '../types';

export const useCourseHero = (featuredCourses: Course[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredCourses.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredCourses.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredCourses.length]);

  const currentCourse = featuredCourses[currentIndex];

  return {
    currentIndex,
    setCurrentIndex,
    currentCourse
  };
};
