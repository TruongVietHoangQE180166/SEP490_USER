'use client';

import { observer } from '@legendapp/state/react';
import { CourseList } from './CourseList';
import { CourseHero } from './CourseHero';
import { CourseFilters } from './CourseFilters';
import { useCourseList } from '../hooks/useCourse';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const CourseListing = observer(() => {
  const { 
    courses, 
    allFilteredCount,
    searchQuery, 
    setSearchQuery, 
    sortBy, 
    setSortBy,
    isLoading,
    isSearching,
    currentPage,
    setCurrentPage,
    totalPages,
    filters,
    featuredCourses,
    sortOptions,
    currentSortLabel
  } = useCourseList();

  const renderToolbar = (className?: string) => (
    <div className={cn("flex flex-col md:flex-row items-center justify-between gap-6 py-0", className)}>
      <div className="relative w-full md:max-w-xl group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input 
          placeholder="Tìm tên khóa học, kỹ năng hoặc giáo viên..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-14 pl-14 pr-4 bg-muted/40 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background transition-all font-medium text-base shadow-inner"
        />
      </div>
      
      <div className="flex items-center gap-4 w-full md:w-auto">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-14 px-6 rounded-2xl bg-muted/40 hover:bg-muted/60 border-none flex items-center gap-3 transition-all">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <div className="flex flex-col items-start gap-0">
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">Sắp xếp theo</span>
                    <span className="text-sm font-bold text-foreground leading-tight">{currentSortLabel}</span>
                </div>
                <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border/50 bg-background/95 backdrop-blur-xl">
              {sortOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className="rounded-xl h-11 px-4 cursor-pointer flex items-center justify-between gap-2 focus:bg-primary/5 focus:text-primary"
                >
                  <span className="font-bold text-sm">{option.label}</span>
                  {sortBy === option.value && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
         </DropdownMenu>

         <div className="hidden lg:flex flex-col items-end border-l border-border/50 pl-6 ml-2">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Kết quả</span>
            <p className="text-sm font-bold text-foreground">
                <b>{allFilteredCount}</b> khóa học
            </p>
         </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1850px] mx-auto px-6 space-y-8">
      {/* Bento Grid Hero Carousel & Ads */}
      <CourseHero featuredCourses={featuredCourses} />

      {/* Desktop Toolbar (Hidden on Mobile) */}
      {renderToolbar("hidden lg:flex")}

      {/* Main Content: Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-0">
        {/* Sidebar Filters (L) */}
        <aside className="lg:col-span-4 xl:col-span-3">
           <CourseFilters {...filters} />
        </aside>

        {/* Course Grid (R) */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-8">
           {/* Mobile Toolbar (Hidden on Desktop) */}
           {renderToolbar("flex lg:hidden")}
           <div className="relative min-h-[400px]">
              <div className="space-y-4">
                <CourseList courses={courses} isLoading={isLoading || isSearching} />

                 {allFilteredCount > 0 && !(isLoading || isSearching) && (
                   <Pagination>
                     <PaginationContent>
                       <PaginationItem>
                         <PaginationPrevious 
                           onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                           className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                         />
                       </PaginationItem>
                       
                       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                         <PaginationItem key={page}>
                           <PaginationLink 
                             isActive={currentPage === page}
                             onClick={() => setCurrentPage(page)}
                             className="cursor-pointer"
                           >
                             {page}
                           </PaginationLink>
                         </PaginationItem>
                       ))}

                       <PaginationItem>
                         <PaginationNext 
                           onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                           className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                         />
                       </PaginationItem>
                     </PaginationContent>
                   </Pagination>
                 )}
               </div>
           </div>
        </main>
      </div>
    </div>
  );
});
