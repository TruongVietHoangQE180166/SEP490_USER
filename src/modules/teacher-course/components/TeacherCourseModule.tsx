'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTeacherCourse } from '../hooks/useTeacherCourse';
import { TeacherCourseCard } from './TeacherCourseCard';
import { TeacherCourse } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  RefreshCw,
  BookOpen,
  ChevronDown,
  Check,
  PlusCircle,
  GraduationCap,
  Target,
} from 'lucide-react';
import { ThunderLoader } from '@/components/thunder-loader';

// ── Status filter options ─────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { label: 'Tất cả trạng thái', value: 'ALL' },
  { label: 'Đã duyệt', value: 'PUBLISHED' },
  { label: 'Chờ duyệt', value: 'DRAFT' },
  { label: 'Từ chối', value: 'REJECT' },
];

const CourseLoader = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/30 backdrop-blur-sm rounded-[2.5rem] border border-border/40 z-10 animate-in fade-in duration-500">
    <ThunderLoader size="xl" variant="default" animate="thunder" showGlow showFill />
    <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.4em] animate-pulse">Đang đồng bộ dữ liệu...</p>
  </div>
);

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 gap-6">
    <div className="relative">
      <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
      <div className="relative p-8 bg-muted/40 rounded-3xl border border-dashed border-border/50">
        <BookOpen size={56} className="text-muted-foreground/40" />
      </div>
    </div>
    <div className="text-center space-y-2">
      <h3 className="text-xl font-black text-foreground">Bạn chưa có khoá học nào</h3>
      <p className="text-muted-foreground font-medium">
        Không tìm thấy khoá học phù hợp với bộ lọc hiện tại hoặc bạn chưa tạo khoá học nào.
      </p>
    </div>
  </div>
);

export const TeacherCourseModule = () => {
  const {
    displayCourses,
    filteredCourses,
    isLoading,
    currentPage,
    totalPages,
    totalElements,
    filterStatus,
    searchQuery,
    loadCourses,
    setFilterStatus,
    setSearchQuery,
    handleDeleteCourse,
    setCurrentPage,
  } = useTeacherCourse();

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const router = useRouter();
  const openDetail = (course: TeacherCourse) => router.push(`/teacher/courses/${course.id}`);
  const openAdd = () => router.push('/teacher/courses/add');
  // For now let's reuse add for edit, or maybe you have an edit route
  const openEdit = (course: TeacherCourse) => router.push(`/teacher/courses/${course.id}/edit`);

  const handleRefresh = () => {
    loadCourses();
    toast.info('Đã làm mới danh sách khoá học');
  };

  const currentStatusLabel =
    STATUS_OPTIONS.find((o) => o.value === filterStatus)?.label ?? 'Tất cả trạng thái';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">

      {/* ── Hero Header ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/5 p-8 border border-primary/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-8 right-48 w-12 h-12 bg-primary/8 rounded-2xl blur-sm rotate-12 hidden xl:block" />
        <div className="absolute bottom-8 right-32 w-8 h-8 bg-secondary/10 rounded-xl blur-sm -rotate-6 hidden xl:block" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-[1000] tracking-tight text-foreground leading-none">
                Khoá học <span className="text-primary">của tôi</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="h-1 w-8 bg-primary rounded-full" />
                <p className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
                  Giảng viên VIC
                </p>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground font-medium text-base md:text-lg leading-relaxed max-w-xl">
            Danh sách <span className="text-foreground font-bold">{totalElements}</span> khoá học bạn đã tạo hoặc đang chờ duyệt.
          </p>
        </div>
        
        <div className="relative z-10 shrink-0">
          <Button
            onClick={openAdd}
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl font-bold px-8 h-14 bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto transition-transform hover:-translate-y-1"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Tạo khoá học mới
          </Button>
        </div>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 px-2">
        {/* Search */}
        <div className="relative flex-1 group min-w-0">
          <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center">
            <Search
              className="absolute left-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300"
              size={20}
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm khoá học, mô tả..."
              className="h-14 pl-14 pr-6 bg-card border-none rounded-xl shadow-lg shadow-black/5 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-base placeholder:font-medium transition-all"
            />
          </div>
        </div>

        {/* Filters + Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-12 px-4 rounded-xl bg-muted/40 hover:bg-muted/60 border-none flex items-center gap-3 transition-all shrink-0 min-w-[150px] justify-start"
              >
                <Target className="h-4 w-4 text-primary shrink-0" />
                <div className="flex flex-col items-start gap-0 overflow-hidden text-left">
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">
                    Trạng thái
                  </span>
                  <span className="text-sm font-bold text-foreground leading-tight truncate w-full">
                    {currentStatusLabel}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-2xl p-2 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl"
            >
              {STATUS_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setFilterStatus(option.value)}
                  className="rounded-xl h-11 px-4 cursor-pointer flex items-center justify-between gap-2 focus:bg-primary/10 focus:text-primary"
                >
                  <span
                    className={`font-bold text-sm ${
                      filterStatus === option.value ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {option.label}
                  </span>
                  {filterStatus === option.value && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh + Counter */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className={`h-12 w-12 p-0 rounded-xl border-none bg-muted/40 hover:bg-muted/60 transition-all active:scale-95 shrink-0 ${
                isLoading ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw size={20} />
            </Button>

            <div className="hidden sm:flex flex-col items-end border-l border-border/40 pl-4 h-10 justify-center shrink-0">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                Tổng số
              </span>
              <p className="text-sm font-bold text-foreground whitespace-nowrap">
                <b>{totalElements}</b> khoá học
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Card Grid ────────────────────────────────────────────────────────── */}
      <div className="relative min-h-[400px]">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 rounded-[3rem] blur-2xl opacity-30 pointer-events-none" />

        {isLoading ? (
          <CourseLoader />
        ) : (
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayCourses.length === 0 ? (
            <EmptyState />
          ) : (
            displayCourses.map((course) => (
              <TeacherCourseCard
                key={course.id}
                course={course}
                onView={openDetail}
                onEdit={openEdit}
                onDelete={(id) => handleDeleteCourse(id)}
              />
            ))
          )}
        </div>
        )}
      </div>

      {/* ── Pagination ───────────────────────────────────────────────────────── */}
      {totalPages > 1 && !isLoading && (
        <div className="flex justify-center pt-4">
          <Pagination>
            <PaginationContent className="bg-muted/40 p-1.5 rounded-xl border-none shadow-inner">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      className="cursor-pointer rounded-xl"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
