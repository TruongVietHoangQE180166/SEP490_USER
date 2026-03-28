'use client';

import { observer } from '@legendapp/state/react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState } from 'react';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useBlog } from '../hooks/useBlog';
import { useBlogCategories } from '../hooks/useBlogCategories';
import { BlogCard } from './BlogCard';
import { BlogCarousel } from './BlogCarousel';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Skeleton cho từng BlogCard ───────────────────────────────────────────────
const BlogCardSkeleton = () => (
  <div className="rounded-lg border border-border/50 bg-card overflow-hidden flex flex-col animate-pulse">
    {/* Thumbnail skeleton */}
    <div className="aspect-[16/9] bg-muted relative">
      {/* Badge skeleton */}
      <div className="absolute top-3 right-3 h-6 w-20 rounded-full bg-muted-foreground/20" />
    </div>

    {/* Content skeleton */}
    <div className="flex flex-col gap-3 p-4 flex-grow">
      {/* Title */}
      <div className="space-y-2 flex-grow">
        <div className="h-5 w-full rounded-md bg-muted" />
        <div className="h-5 w-4/5 rounded-md bg-muted" />
      </div>

      {/* Excerpt */}
      <div className="space-y-1.5 mt-1">
        <div className="h-3.5 w-full rounded bg-muted" />
        <div className="h-3.5 w-full rounded bg-muted" />
        <div className="h-3.5 w-2/3 rounded bg-muted" />
      </div>

      {/* Footer: avatar + read time */}
      <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div className="space-y-1">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-3 w-14 rounded bg-muted" />
          </div>
        </div>
        <div className="h-3 w-14 rounded bg-muted" />
      </div>
    </div>
  </div>
);

export const BlogList = observer(() => {
  const { 
    posts, 
    featuredPosts,
    isLoading, 
    searchQuery, 
    selectedCategory, 
    handleSearch, 
    handleCategoryFilter,
    refresh
  } = useBlog();
  const { categories, isLoading: isCategoriesLoading } = useBlogCategories();

  return (
    <div className="max-w-8xl mx-auto px-4 py-8">
      {/* Featured Carousel */}
      {featuredPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <BlogCarousel posts={featuredPosts} />
        </motion.div>
      )}

      {/* Toolbar: Search & Filter */}
      <div className="mb-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              {searchQuery
                ? `Kết quả cho "${searchQuery}"`
                : selectedCategory
                ? categories.find((c) => c.name === selectedCategory || c.id === selectedCategory)?.name || selectedCategory
                : 'Khám phá bài viết'}
            </h2>
            <p className="text-muted-foreground">
              {posts.length} bài viết được tìm thấy
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-primary" />
              <Input
                type="text"
                placeholder="Tìm kiếm nội dung bài viết..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-12 pl-11 pr-11 bg-card border-border/50 rounded-xl transition-all focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary peer"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={refresh}
              disabled={isLoading}
              className="h-12 w-12 rounded-xl border-border/50 bg-card hover:bg-muted transition-all active:scale-95"
              title="Làm mới bài viết"
            >
              <RotateCcw className={cn("h-5 w-5 text-muted-foreground", isLoading && "animate-spin text-primary")} />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 py-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 mr-2 text-muted-foreground whitespace-nowrap">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm font-medium">Lọc theo:</span>
          </div>
          
          <button
            onClick={() => handleCategoryFilter(null)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border',
              selectedCategory === null
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105'
                : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/50'
            )}
          >
            Tất cả
          </button>
          
          {!isCategoriesLoading && categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.name)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border',
                selectedCategory === category.name
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105'
                  : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/50'
              )}
            >
              {category.name}
            </button>
          ))}

          {isCategoriesLoading && [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-muted animate-pulse" />
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </motion.div>
        ) : posts.length > 0 ? (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
                <BlogCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border/50 bg-card/30 p-20 text-center"
          >
            <div className="max-w-xs mx-auto space-y-3">
              <div className="p-4 rounded-full bg-muted w-max mx-auto">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">Không có kết quả</h3>
              <p className="text-muted-foreground">
                Chúng tôi không tìm thấy bài viết nào phù hợp với yêu cầu của bạn. Thử tìm kiếm với từ khóa khác nhé!
              </p>
              <button 
                onClick={() => {handleSearch(''); handleCategoryFilter(null);}}
                className="text-primary font-semibold hover:underline pt-2"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
