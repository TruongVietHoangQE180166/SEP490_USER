'use client';

import { useState, useMemo } from 'react';
import { observer } from '@legendapp/state/react';
import { useMyCourse } from '../hooks/useMyCourse';
import { MyCourseCard } from './MyCourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, GraduationCap, Trophy, Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

type FilterType = 'all' | 'completed' | 'ongoing';

export const MyCourseList = observer(() => {
  const { enrolledCourses, isLoading, error } = useMyCourse();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterType>('all');

  const filteredCourses = useMemo(() => {
    return enrolledCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = 
        activeTab === 'all' ? true :
        activeTab === 'completed' ? course.progress === 100 :
        course.progress < 100;
      
      return matchesSearch && matchesFilter;
    });
  }, [enrolledCourses, searchQuery, activeTab]);

  const stats = useMemo(() => {
    const completed = enrolledCourses.filter(c => c.progress === 100).length;
    return {
      total: enrolledCourses.length,
      completed,
      ongoing: enrolledCourses.length - completed
    };
  }, [enrolledCourses]);

  if (isLoading && enrolledCourses.length === 0) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col md:flex-row h-full md:h-52 gap-8 bg-muted/20 rounded-3xl p-0 overflow-hidden">
            <Skeleton className="h-48 md:h-full w-full md:w-80" />
            <div className="p-8 flex-1 space-y-6">
              <Skeleton className="h-8 w-3/4 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/4 rounded-full" />
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 px-6 rounded-[40px] border border-dashed border-border/60 bg-muted/5 space-y-8"
      >
        <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center text-primary/30 border border-primary/10">
                <BookOpen className="h-12 w-12" />
            </div>
        </div>
        <div className="space-y-3">
            <h2 className="text-3xl font-black text-foreground">Bạn chưa đăng ký khóa học nào</h2>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed italic">
                Hãy khám phá hàng ngàn khóa học chất lượng cao để bắt đầu hành trình chinh phục kiến thức của bạn.
            </p>
        </div>
        <Button asChild size="lg" className="rounded-full px-8 h-14 font-black shadow-xl shadow-primary/20">
          <Link href="/course">Khám phá ngay</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="relative space-y-12">
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-1/2 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-[120px] -z-10 pointer-events-none" />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div 
           onClick={() => setActiveTab('all')}
           className={`p-6 rounded-3xl border transition-all cursor-pointer ${activeTab === 'all' ? 'bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.02]' : 'bg-primary/5 border-primary/10 hover:bg-primary/10'}`}
         >
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                <GraduationCap className="h-7 w-7" />
            </div>
            <div className="mt-4">
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeTab === 'all' ? 'text-white/70' : 'text-primary/60'}`}>Tổng khóa học</p>
                <p className={`text-3xl font-black leading-none ${activeTab === 'all' ? 'text-white' : 'text-foreground'}`}>{stats.total}</p>
            </div>
         </div>

         <div 
           onClick={() => setActiveTab('completed')}
           className={`p-6 rounded-3xl border transition-all cursor-pointer ${activeTab === 'completed' ? 'bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.02]' : 'bg-primary/5 border-primary/10 hover:bg-primary/10'}`}
         >
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${activeTab === 'completed' ? 'bg-white/20 text-white shadow-lg shadow-black/10' : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'}`}>
                <Trophy className="h-7 w-7" />
            </div>
            <div className="mt-4">
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeTab === 'completed' ? 'text-white/70' : 'text-primary/60'}`}>Đã hoàn thành</p>
                <p className={`text-3xl font-black leading-none ${activeTab === 'completed' ? 'text-white' : 'text-foreground'}`}>{stats.completed}</p>
            </div>
         </div>

         <div 
           onClick={() => setActiveTab('ongoing')}
           className={`p-6 rounded-3xl border transition-all cursor-pointer ${activeTab === 'ongoing' ? 'bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.02]' : 'bg-primary/5 border-primary/10 hover:bg-primary/10'}`}
         >
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${activeTab === 'ongoing' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                <BookOpen className="h-7 w-7" />
            </div>
            <div className="mt-4">
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeTab === 'ongoing' ? 'text-white/70' : 'text-primary/60'}`}>Đang học tập</p>
                <p className={`text-3xl font-black leading-none ${activeTab === 'ongoing' ? 'text-white' : 'text-foreground'}`}>{stats.ongoing}</p>
            </div>
         </div>
      </div>

      {/* Search and Filters Controller */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-background/40 backdrop-blur-md border border-border/40 p-4 rounded-[28px]">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Tìm kiếm khóa học của bạn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-background/50 border-border/20 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-muted/20 flex items-center justify-center hover:bg-muted/40 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-muted/20 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
          {(['all', 'completed', 'ongoing'] as FilterType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab 
                ? 'bg-background text-primary shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
              }`}
            >
              {tab === 'all' ? 'Tất cả' : tab === 'completed' ? 'Đã xong' : 'Đang học'}
            </button>
          ))}
        </div>
      </div>

      {/* List content */}
      <div className="space-y-8 min-h-[100px]">
        <AnimatePresence mode="popLayout">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, idx) => (
              <MyCourseCard key={course.id} course={course} index={idx} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground mb-6">
                <Search className="h-10 w-10 opacity-20" />
              </div>
              <p className="text-xl font-black text-foreground/40 uppercase tracking-widest">Không tìm thấy kết quả</p>
              <p className="text-muted-foreground/60 font-medium mt-2 italic">Thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

