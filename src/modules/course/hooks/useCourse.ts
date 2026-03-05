import { useEffect, useState, useMemo } from 'react';
import { courseState$, courseActions } from '../store';
import { courseService } from '../services';
import { toast } from '@/components/ui/toast';

export const useCourses = () => {
  const courses = courseState$.courses.get();
  const isLoading = courseState$.isLoading.get();
  const error = courseState$.error.get();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    courseActions.setLoading(true);
    try {
      const data = await courseService.getAllCourses();
      courseActions.setCourses(data);
    } catch (err: any) {
      const message = err.message || 'Không thể tải danh sách khóa học';
      courseActions.setError(message);
      toast.error(message);
    } finally {
      courseActions.setLoading(false);
    }
  };

  return { courses, isLoading, error, refresh: loadCourses };
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
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [minRating, setMinRating] = useState(0);

  // Simulate a light loading state when search/filter/sort changes
  useEffect(() => {
    if (isLoading) return;
    setIsSearching(true);
    setCurrentPage(1); // Reset page when filters change
    const timer = setTimeout(() => setIsSearching(false), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, sortBy, activeAssets, priceRange, minRating]);

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

  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(query) || 
        c.author?.name.toLowerCase().includes(query) ||
        (c.assets ?? []).some(asset => asset.toLowerCase().includes(query))
      );
    }

    // Multiple Assets filter
    if (activeAssets.length > 0 && !activeAssets.includes('All')) {
      result = result.filter(c => 
        (c.assets ?? []).some(asset => activeAssets.includes(asset))
      );
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
  }, [courses, searchQuery, sortBy, activeAssets, priceRange, minRating]);

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
    setPriceRange([0, 10000000]);
    setMinRating(0);
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
        priceRange,
        setPriceRange,
        minRating,
        setMinRating,
        clearFilters
    }
  };
};

