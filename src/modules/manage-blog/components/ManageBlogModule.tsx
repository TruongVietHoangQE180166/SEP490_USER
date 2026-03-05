'use client';

import React, { useEffect, useState } from 'react';
import { useManageBlog } from '../hooks/useManageBlog';
import { BlogCard } from './BlogCard';
import { BlogForm } from './BlogForm';
import { BlogDetail } from './BlogDetail';
import { Button } from '@/components/ui/button';
import { Plus, Search, RefreshCw, FileText, Tag, ChevronDown, Check, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThunderLoader } from '@/components/thunder-loader';

export const ManageBlogModule = () => {
  const [isDetailView, setIsDetailView] = useState(false);
  const [viewingBlog, setViewingBlog] = useState<any>(null);
  
  const {
    blogs,
    categories,
    isLoading,
    isModalOpen,
    modalMode,
    selectedBlog,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    blogToToggleStatus,
    currentPage,
    totalPages,
    totalElements,
    filterCategory,
    searchQuery,
    fetchBlogs,
    fetchCategories,
    handleSave,
    handleDeleteConfirm,
    deleteBlog,
    toggleBlogStatus,
    handleStatusConfirm,
    openModal,
    closeModal,
    handlePageChange,
    handleFilterChange,
    handleSearchChange,
  } = useManageBlog();

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [fetchBlogs, fetchCategories]);

  const handleRefresh = () => {
    fetchBlogs();
    fetchCategories();
    toast.info('Đã làm mới danh sách bài viết');
  };

  const handleViewBlog = (blog: any) => {
    setViewingBlog(blog);
    setIsDetailView(true);
  };

  const handleBackFromDetail = () => {
    setIsDetailView(false);
    setViewingBlog(null);
  };

  const handleEditFromDetail = () => {
    if (viewingBlog) {
      openModal('edit', viewingBlog);
      setIsDetailView(false);
      setViewingBlog(null);
    }
  };

  const currentCategoryLabel = filterCategory === 'ALL' ? 'Tất cả danh mục' : filterCategory;

  // Detail View Mode
  if (isDetailView && viewingBlog) {
    return (
      <BlogDetail 
        blog={viewingBlog}
        onBack={handleBackFromDetail}
        onEdit={handleEditFromDetail}
        showActions={true}
      />
    );
  }

  // Modal logic is repurposed for Form view
  if (isModalOpen) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
        <BlogForm 
          onClose={closeModal}
          blog={selectedBlog}
          categories={categories}
          mode={modalMode}
          onSave={handleSave}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-secondary/5 p-10 border border-primary/10 shadow-sm">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <FileText className="h-8 w-8" />
               </div>
               <div>
                  <h1 className="text-5xl font-[1000] tracking-tight text-foreground leading-none">
                     Tin tức <span className="text-primary">VIC</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="h-1 w-8 bg-primary rounded-full"></span>
                    <p className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">Quản trị nội dung</p>
                  </div>
               </div>
            </div>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-xl">
               Sáng tạo và quản lý kiến thức. Hiện đang có <span className="text-foreground font-bold">{totalElements}</span> bài viết được lưu trữ trong hệ thống VIC Teach.
            </p>
          </div>
          
          <Button 
            onClick={() => openModal('create')}
            className="h-20 px-10 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-[1.05] active:scale-95 gap-4 group"
          >
            <div className="p-2 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform duration-500">
               <Plus size={24} /> 
            </div>
            Soạn thảo bài viết
          </Button>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 px-2">
        {/* Search Bar */}
        <div className="relative flex-1 group min-w-0">
          <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center">
            <Search className="absolute left-6 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" size={24} />
            <input 
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm kiếm tiêu đề, nội dung hoặc tác giả..." 
              className="h-16 w-full pl-16 pr-8 bg-card border-none rounded-[2rem] shadow-xl shadow-black/5 focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-lg placeholder:font-medium transition-all outline-none"
            />
          </div>
        </div>
        
        {/* Actions Area */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 flex-1 sm:flex-none">
            {/* Category Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-14 px-5 rounded-2xl bg-muted/40 hover:bg-muted/60 border-none flex items-center gap-3 transition-all shrink-0 min-w-[200px] justify-start shadow-sm active:scale-95">
                  <Tag className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex flex-col items-start gap-0 overflow-hidden text-left">
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none truncate w-full">Chuyên mục</span>
                      <span className="text-sm font-bold text-foreground leading-tight truncate w-full">{currentCategoryLabel}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DropdownMenuItem 
                  onClick={() => handleFilterChange({ category: 'ALL' })}
                  className="rounded-xl h-11 px-4 cursor-pointer flex items-center justify-between gap-2 focus:bg-primary/10 focus:text-primary"
                >
                  <span className={`font-bold text-sm ${filterCategory === 'ALL' ? 'text-primary' : 'text-foreground'}`}>Tất cả danh mục</span>
                  {filterCategory === 'ALL' && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                {categories.map((cat) => (
                  <DropdownMenuItem 
                    key={cat.id}
                    onClick={() => handleFilterChange({ category: cat.name })}
                    className="rounded-xl h-11 px-4 cursor-pointer flex items-center justify-between gap-2 focus:bg-primary/10 focus:text-primary"
                  >
                    <span className={`font-bold text-sm ${filterCategory === cat.name ? 'text-primary' : 'text-foreground'}`}>{cat.name}</span>
                    {filterCategory === cat.name && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className={`h-14 w-14 p-0 rounded-2xl border-border/40 bg-background hover:bg-muted transition-all active:scale-95 shadow-sm border-none bg-muted/40 shrink-0 ${isLoading ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={20} />
            </Button>

            <div className="hidden sm:flex flex-col items-end border-l border-border/40 pl-4 h-10 justify-center shrink-0">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">Cơ sở dữ liệu</span>
              <p className="text-sm font-bold text-foreground whitespace-nowrap">
                  <b>{blogs.length}</b> / {totalElements} tin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Grid Layout */}
      <div className="relative min-h-[400px]">
         {isLoading ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/30 backdrop-blur-sm rounded-[2.5rem] border border-border/40 z-10 animate-in fade-in duration-500">
             <ThunderLoader size="xl" variant="default" animate="thunder" showGlow showFill />
             <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.4em] animate-pulse">Đang đồng bộ dữ liệu...</p>
           </div>
         ) : blogs.length > 0 ? (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-1"
           >
             <AnimatePresence mode="popLayout">
               {blogs.map((blog) => (
                 <motion.div
                   key={blog.id}
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ duration: 0.4 }}
                 >
                   <BlogCard 
                     blog={blog} 
                     onToggleStatus={toggleBlogStatus}
                     onEdit={(blog) => openModal('edit', blog)}
                     onView={handleViewBlog}
                     onDelete={deleteBlog}
                   />
                 </motion.div>
               ))}
             </AnimatePresence>
           </motion.div>
         ) : (
           <div className="flex flex-col items-center justify-center py-32 bg-muted/20 border-2 border-dashed border-border/40 rounded-[2.5rem] gap-4">
              <div className="p-6 bg-background rounded-[2rem] shadow-xl text-muted-foreground">
                 <FileText size={48} strokeWidth={1} />
              </div>
              <p className="text-xl font-bold text-muted-foreground">Không tìm thấy bài viết nào phù hợp.</p>
              <Button onClick={() => openModal('create')} variant="outline" className="rounded-xl font-bold">Viết bài ngay</Button>
           </div>
         )}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination>
            <PaginationContent className="bg-muted/40 p-1.5 rounded-2xl border-none shadow-inner">
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              <PaginationItem>
                <PaginationLink
                  isActive={true}
                  className="cursor-default pointer-events-none"
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2rem] border-border/40 shadow-2xl backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tight">Xác nhận xóa bài viết?</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-muted-foreground text-base leading-relaxed">
              Bạn đang yêu cầu xóa vĩnh viễn nội dung này. Hành động này không thể hoàn tác và bài viết sẽ biến mất khỏi toàn bộ hệ thống VIC Teach.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="h-12 rounded-xl font-bold px-6 border-none bg-muted hover:bg-muted/80">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl font-black uppercase tracking-widest px-8 shadow-xl shadow-destructive/20"
            >
              Xác nhận xóa ngay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Toggle Confirmation Dialog */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent className="rounded-[2rem] border-border/40 shadow-2xl backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tight">
              {blogToToggleStatus?.currentStatus ? 'Xác nhận tạm ẩn?' : 'Xác nhận hiển thị?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-muted-foreground text-base leading-relaxed">
              {blogToToggleStatus?.currentStatus 
                ? 'Bài viết sẽ được thu hồi khỏi giao diện người dùng nhưng vẫn lưu trữ trong quản trị.' 
                : 'Bài viết sẽ ngay lập tức được hiển thị công khai trên cổng tin tức VIC.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="h-12 rounded-xl font-bold px-6 border-none bg-muted hover:bg-muted/80">Quay lại</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleStatusConfirm}
              className={`h-12 ${!blogToToggleStatus?.currentStatus ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'} text-white rounded-xl font-black uppercase tracking-widest px-8 shadow-xl`}
            >
              Cập nhật trạng thái
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
