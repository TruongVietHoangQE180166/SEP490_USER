'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ExpandableDock from './expandable-dock';
import { Search, X, TrendingUp, Clock, Hash, SearchX, BookOpen, ChevronRight } from 'lucide-react';
import { AUTH_ROUTES } from '@/constants/routes';
import { courseService } from '@/modules/course/services';
import { Course } from '@/modules/course/types';

export const SearchDock = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Don't show on auth pages
  const isAuthPage = AUTH_ROUTES.some((route) => pathname?.startsWith(route));
  const isLearnPage = pathname?.startsWith('/learn');
  const isAdminPage = pathname?.startsWith('/admin');
  const isTeacherPage = pathname?.startsWith('/teacher');
  const isTradingPage = pathname?.startsWith('/trading');

  // Fetch all courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const courses = await courseService.getAllCourses(1, 100); // Get top 100
        setAllCourses(courses);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch courses for search:', error);
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter courses based on query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    return allCourses.filter(course => 
      course.title.toLowerCase().includes(query) || 
      course.description.toLowerCase().includes(query)
    ).slice(0, 5); // Limit to 5 results
  }, [searchQuery, allCourses]);

  const handleCourseClick = (slug: string) => {
    router.push(`/course/${slug}`);
    setSearchQuery('');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (isAuthPage || isLearnPage || isAdminPage || isTeacherPage || isTradingPage) return null;
  
  return (
    <ExpandableDock
      headerContent={
        <div className="flex items-center gap-3 w-full">
          <Search className="w-5 h-5 text-foreground" />
          <span className="text-base font-medium text-foreground">
            Tìm kiếm nội dung...
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-6 h-full text-foreground px-1">
        {/* Search Input */}
        <div className="relative p-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filteredCourses.length > 0) {
                handleCourseClick(filteredCourses[0].slug);
              }
            }}
            placeholder="Bạn muốn học gì hôm nay?"
            className="w-full pl-12 pr-14 py-4 bg-muted/50 border border-border/50 rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto space-y-6 px-2 custom-scrollbar">
          {searchQuery ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Khóa học liên quan
                </h3>
                {filteredCourses.length > 0 && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">
                    {filteredCourses.length} Kết quả
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-muted/40 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : filteredCourses.length > 0 ? (
                <div className="space-y-2">
                  {filteredCourses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleCourseClick(course.slug)}
                      className="w-full flex items-center gap-4 p-3 bg-muted/30 hover:bg-muted rounded-2xl border border-transparent hover:border-border transition-all duration-200 group text-left"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border bg-muted/50">
                        <img 
                          src={course.thumbnailUrl || course.thumbnail} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center text-[10px] font-bold text-primary">
                            <span>Xem khóa học</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <SearchX className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Không tìm thấy kết quả nào</p>
                  <p className="text-xs text-muted-foreground mt-1">Vui lòng thử từ khóa khác</p>
                </div>
              )}
            </div>
          ) : null}
          {!searchQuery && (
             <div className="space-y-8 py-4">
               {/* Trending searches */}
               <div className="space-y-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">
                  Gợi ý từ khóa
                </h3>
                <div className="flex flex-wrap gap-2 px-1">
                  {['React', 'Trading', 'Finance', 'Web Design', 'Market Analysis'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-4 py-2 bg-muted/50 hover:bg-primary/10 border border-border rounded-full text-xs font-medium text-foreground hover:text-primary hover:border-primary/20 transition-all active:scale-95"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Courses (show when empty) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Khóa học nổi bật
                  </h3>
                </div>
                
                {isLoading ? (
                  <div className="flex flex-col gap-3">
                    {[1, 2].map(i => (
                      <div key={i} className="h-20 bg-muted/40 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {allCourses.slice(0, 3).map((course) => (
                      <button
                        key={course.id}
                        onClick={() => handleCourseClick(course.slug)}
                        className="w-full flex items-center gap-4 p-3 bg-muted/30 hover:bg-muted rounded-2xl border border-transparent hover:border-border transition-all duration-200 group text-left"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border bg-muted/50">
                          <img 
                            src={course.thumbnailUrl || course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {course.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {course.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2 text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-foreground">Bạn đã sẵn sàng?</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tìm kiếm khóa học phù hợp và nâng cao kỹ năng ngay hôm nay.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ExpandableDock>
  );
};