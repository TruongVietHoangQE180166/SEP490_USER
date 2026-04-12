import { useEffect, useState, useMemo } from 'react';
import { courseState$, courseActions } from '../store';
import { courseService } from '../services';
import { toast } from '@/components/ui/toast';

/**
 * Module-level guard: only ONE getAllCourses request is ever in-flight at a time.
 * All hook instances that mount simultaneously will share this promise.
 */
let courseListInflight: Promise<void> | null = null;

export const useCourses = () => {
  const courses = courseState$.courses.get();
  const isLoading = courseState$.isLoading.get();
  const error = courseState$.error.get();

  useEffect(() => {
    // Only load if the list is not yet populated
    if (courses.length === 0) {
      loadCourses();
    }
  }, []);

  const loadCourses = async (forceRefresh = false) => {
    // Already have data and no force-refresh → skip
    if (courses.length > 0 && !forceRefresh) return;

    // A request is already in-flight → wait for it instead of firing a new one
    if (!forceRefresh && courseListInflight) {
      return courseListInflight;
    }

    // Start a new request and share it via the module-level guard
    courseListInflight = (async () => {
      courseActions.setLoading(true);
      try {
        const data = await courseService.getAllCourses();
        const publishedCourses = data.filter(c => c.status === 'PUBLISHED');
        courseActions.setCourses(publishedCourses);
        courseActions.setError(null);
      } catch (err: any) {
        const message = err.message || 'Không thể tải danh sách khóa học';
        courseActions.setError(message);
        toast.error(message);
      } finally {
        courseActions.setLoading(false);
        courseListInflight = null; // Reset so future force-refreshes work
      }
    })();

    return courseListInflight;
  };

  return { courses, isLoading, error, refresh: () => loadCourses(true) };
};

export const useCourseList = () => {
  const { courses, isLoading, error } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isSearching, setIsSearching] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Filter States
  const [activeAssets, setActiveAssets] = useState<string[]>(['All']);
  const [activeLevels, setActiveLevels] = useState<string[]>(['All']);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [minRating, setMinRating] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | 'free' | 'enrolled' | 'not-enrolled'>('all');

  // Simulate a light loading state when search/filter/sort changes
  useEffect(() => {
    if (isLoading) return;
    setIsSearching(true);
    setCurrentPage(1); // Reset page when filters change
    const timer = setTimeout(() => setIsSearching(false), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, sortBy, activeAssets, activeLevels, priceRange, minRating, statusFilter]);

  const toggleAsset = (asset: string) => {
    setActiveAssets(prev => {
      if (asset === 'All') return ['All'];
      
      const newAssets = prev.filter(a => a !== 'All');
      if (newAssets.includes(asset)) {
        const filtered = newAssets.filter(a => a !== asset);
        return filtered.length === 0 ? ['All'] : filtered;
      } else {
        return [...newAssets, asset];
      }
    });
  };

  const toggleLevel = (level: string) => {
    setActiveLevels(prev => {
      if (level === 'All') return ['All'];
      
      const newLevels = prev.filter(l => l !== 'All');
      if (newLevels.includes(level)) {
        const filtered = newLevels.filter(l => l !== level);
        return filtered.length === 0 ? ['All'] : filtered;
      } else {
        return [...newLevels, level];
      }
    });
  };

  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(query) || 
        c.author?.name?.toLowerCase().includes(query) ||
        (c.assets ?? []).some(asset => asset.toLowerCase().includes(query))
      );
    }

    // Status filter (Free, Enrolled, Not Enrolled)
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'free':
          result = result.filter(c => c.isFree === true || c.price === 0);
          break;
        case 'enrolled':
          result = result.filter(c => c.isEnrolled === true);
          break;
        case 'not-enrolled':
          result = result.filter(c => c.isEnrolled !== true);
          break;
      }
    }

    // Multiple Assets filter
    if (activeAssets.length > 0 && !activeAssets.includes('All')) {
      result = result.filter(c => 
        (c.assets ?? []).some(asset => activeAssets.includes(asset))
      );
    }

    // Level filter
    if (activeLevels.length > 0 && !activeLevels.includes('All')) {
      result = result.filter(c => {
        const norm = c.courseLevel?.toLowerCase() || '';
        return activeLevels.some(level => {
          if (level === 'Level 1' && (norm.includes('1') || norm.includes('nhập') || norm.includes('nhap'))) return true;
          if (level === 'Level 2' && (norm.includes('2') || norm.includes('nền') || norm.includes('nen'))) return true;
          if (level === 'Level 3' && (norm.includes('3') || norm.includes('trung') || norm.includes('trung'))) return true;
          if (level === 'Level 4' && (norm.includes('4') || norm.includes('thực') || norm.includes('thuc'))) return true;
          if (level === 'Level 5' && (norm.includes('5') || norm.includes('nâng') || norm.includes('nang'))) return true;
          return false;
        });
      });
    }

    // Price range filter
    result = result.filter(c => c.price >= priceRange[0] && c.price <= priceRange[1]);

    // Rating filter
    if (minRating > 0) {
      result = result.filter(c => (c.averageRate || c.rating || 0) >= minRating);
    }

    // Sort logic
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.averageRate || b.rating || 0) - (a.averageRate || a.rating || 0));
        break;
      default:
        break;
    }

    return result;
  }, [courses, searchQuery, sortBy, activeAssets, activeLevels, priceRange, minRating, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedCourses, currentPage]);

  const featuredCourses = useMemo(() => courses.slice(0, 3), [courses]);

  const sortOptions = [
    { label: 'Mới nhất', value: 'latest' },
    { label: 'Giá: Thấp đến Cao', value: 'price-asc' },
    { label: 'Giá: Cao đến Thấp', value: 'price-desc' },
    { label: 'Đánh giá cao nhất', value: 'rating' },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Mới nhất';

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('latest');
    setActiveAssets(['All']);
    setActiveLevels(['All']);
    setPriceRange([0, 10000000]);
    setMinRating(0);
    setStatusFilter('all');
    setCurrentPage(1);
  };

  return {
    courses: paginatedCourses,
    allFilteredCount: filteredAndSortedCourses.length,
    allCourses: courses,
    isLoading,
    isSearching,
    currentPage,
    setCurrentPage,
    totalPages,
    error,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    featuredCourses,
    sortOptions,
    currentSortLabel,
    filters: {
        activeAssets,
        toggleAsset,
        activeLevels,
        toggleLevel,
        priceRange,
        setPriceRange,
        minRating,
        setMinRating,
        statusFilter,
        setStatusFilter,
        clearFilters
    }
  };
};

