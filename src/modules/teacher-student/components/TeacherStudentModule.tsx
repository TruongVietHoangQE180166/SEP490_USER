'use client';

import React, { useMemo } from 'react';
import { useTeacherStudent } from '../hooks/useTeacherStudent';
import { 
  Users, Search, Filter, Mail, Shield, UserCog, User, RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThunderLoader } from '@/components/thunder-loader';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SideSheet, SideSheetContent, SideSheetHeader, SideSheetTitle, SideSheetTrigger, SideSheetClose 
} from '@/components/ui/side-sheet';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Trophy, Clock, ChevronRight, X, PlayCircle, Star } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TeacherStudent } from '../types';

export const TeacherStudentModule = () => {
  const {
    students,
    isLoading,
    error,
    searchQuery,
    filterStatus,
    setFilters,
    reload,
    fetchStudentCourses,
    selectedStudentCourses,
    isDetailLoading,
  } = useTeacherStudent();

  const [selectedStudent, setSelectedStudent] = React.useState<TeacherStudent | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleShowDetail = (student: TeacherStudent) => {
    setSelectedStudent(student);
    setIsSheetOpen(true);
    fetchStudentCourses(student.id);
  };

  // Áp dụng tìm kiếm và lọc trên frontend vì lấy hết 1000
  const filteredStudents = useMemo(() => {
    let result = [...(students || [])];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.username?.toLowerCase().includes(q) || 
        s.email?.toLowerCase().includes(q)
      );
    }

    if (filterStatus && filterStatus !== 'ALL') {
      result = result.filter(s => s.status === filterStatus);
    }

    return result;
  }, [students, searchQuery, filterStatus]);

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <Shield size={32} />
        </div>
        <h3 className="text-xl font-bold text-foreground">Không thể tải danh sách học viên</h3>
        <p className="text-sm text-muted-foreground max-w-md text-center">{error}</p>
        <Button onClick={reload} variant="outline" className="mt-4 gap-2 border-primary/20 hover:bg-primary/5">
          <RefreshCw size={16} /> Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Users size={20} />
            </div>
            Quản lý học viên
          </h1>
          <p className="mt-2 text-muted-foreground font-medium text-sm">
            Quản lý và theo dõi thông tin tài khoản của học viên trong hệ thống.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-muted/30 px-5 py-3 rounded-xl border border-border/40">
          <div className="flex items-center justify-center gap-2">
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Tổng số học viên:</p>
            <p className="text-xl font-black text-primary leading-none">{students?.length || 0}</p>
          </div>
        </div>
      </div>

      <Card className="border border-border/40 bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/40 bg-muted/10 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm Email hoặc Tên tài khoản..."
              value={searchQuery}
              onChange={(e) => setFilters({ query: e.target.value })}
              className="pl-9 bg-background border-border"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={reload} disabled={isLoading} className="shrink-0 group">
              <RefreshCw size={16} className={isLoading ? "animate-spin text-muted-foreground" : "text-muted-foreground group-hover:text-primary"} />
            </Button>
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <ThunderLoader size="lg" animate="thunder" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Đang tải dữ liệu...</p>
            </div>
          ) : (filteredStudents || []).length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
                <Search className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="font-bold text-lg">Không tìm thấy học viên nào</p>
              <p className="text-sm text-muted-foreground">Thử thay đổi từ khóa hoặc bộ lọc trạng thái để tìm kiếm lại.</p>
              {(searchQuery || filterStatus !== 'ALL') && (
                <Button variant="link" onClick={() => setFilters({ query: '', status: 'ALL' })} className="text-primary mt-2">
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-muted-foreground font-black uppercase tracking-widest bg-muted/30 border-b border-border/40">
                  <tr>
                    <th className="px-6 py-4">Tài khoản & Email</th>
                    <th className="px-6 py-4 text-center">Vai trò</th>
                    <th className="px-6 py-4 text-center">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Mã định danh</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredStudents.map((student, idx) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-card hover:bg-muted/10 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{student.username}</p>
                            <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground group-hover:text-primary/70 transition-colors">
                              <Mail size={12} />
                              <span className="text-xs">{student.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-border/60 bg-muted/20">
                          {student.role === 'TEACHER' ? (
                            <span className="flex items-center gap-1.5 text-amber-600"><UserCog size={12} /> Giảng viên</span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-blue-600"><GraduationCapIcon size={12} /> Học viên</span>
                          )}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {student.status === 'ACTIVE' ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none hover:bg-emerald-500/20 shadow-none font-bold uppercase text-[10px] tracking-widest">
                            Hoạt động
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-500/10 text-rose-500 border-none hover:bg-rose-500/20 shadow-none font-bold uppercase text-[10px] tracking-widest">
                            Đã khóa
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-2 py-1 rounded-md border border-border/40">
                          ...{student.id.split('-').pop()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleShowDetail(student)}
                          className="h-8 text-primary hover:text-primary hover:bg-primary/10 font-bold text-xs gap-1.5"
                        >
                          Chi tiết <ChevronRight size={14} />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <SideSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} width="500px">
        <SideSheetContent className="border-l border-border/40">
          <div className="h-full flex flex-col bg-background">
            <SideSheetHeader className="p-6 border-b border-border/40 bg-muted/5 flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <User size={20} />
                </div>
                <div>
                  <SideSheetTitle className="text-xl font-black">Chi tiết học viên</SideSheetTitle>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{selectedStudent?.username}</p>
                </div>
              </div>
              <SideSheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <X size={16} />
                </Button>
              </SideSheetClose>
            </SideSheetHeader>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                {/* User Info Premium Banner */}
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 overflow-hidden shadow-sm">
                  <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] text-primary pointer-events-none">
                    <User size={140} />
                  </div>
                  <div className="relative z-10 flex flex-col gap-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1.5 flex items-center gap-1.5">
                        <User size={12} /> Học viên
                      </p>
                      <h4 className="text-2xl font-black text-foreground">{selectedStudent?.username}</h4>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-primary/10">
                      <div className="flex items-center gap-2 text-muted-foreground bg-background/50 px-3 py-1.5 rounded-lg border border-border/40 backdrop-blur-sm">
                        <Mail size={14} className="text-primary/70" />
                        <span className="text-sm font-medium">{selectedStudent?.email}</span>
                      </div>
                      <Badge className={cn(
                        "px-3 py-1.5 shadow-none font-bold uppercase tracking-widest text-[10px]",
                        selectedStudent?.status === 'ACTIVE' 
                          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20"
                      )}>
                        {selectedStudent?.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tài khoản khóa'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 pb-2 border-b border-border/40">
                    <BookOpen size={16} className="text-primary" />
                    Khóa học đã đăng ký <span className="bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center rounded-full text-[10px]">{(selectedStudentCourses || []).length}</span>
                  </h4>

                  {isDetailLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-3">
                      <ThunderLoader size="md" animate="thunder" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Đang tải khóa học...</p>
                    </div>
                  ) : (selectedStudentCourses || []).length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border/40 rounded-2xl bg-muted/10">
                      <BookOpen size={32} className="text-muted-foreground/30 mb-3" />
                      <p className="font-bold text-muted-foreground">Chưa đăng ký khóa học nào</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">Học viên này hiện chưa tham gia bất kỳ khóa học nào trong hệ thống.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(selectedStudentCourses || []).map((item, idx) => (
                        <motion.div 
                          key={item.courseListResponse.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group relative p-4 rounded-2xl bg-card border border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                        >
                          <div className="flex gap-4">
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-border/40 shadow-sm group-hover:shadow-md transition-all">
                              <img 
                                src={item.courseListResponse.thumbnailUrl} 
                                alt={item.courseListResponse.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <PlayCircle size={24} className="text-white drop-shadow-md" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <h5 className="font-bold text-[15px] line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                {item.courseListResponse.title}
                              </h5>
                              <div className="flex flex-wrap items-center gap-3 mt-3">
                                <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest py-0.5 h-6 bg-primary/10 text-primary border-primary/20">
                                  {item.courseListResponse.courseLevel}
                                </Badge>
                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium bg-muted/40 px-2 py-1 rounded-md">
                                  <Clock size={12} />
                                  <span>{new Date(item.courseListResponse.createdDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 pt-4 border-t border-border/30">
                            <div className="flex items-center justify-between mb-2.5">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center">
                                  <Trophy size={14} className="text-amber-600" />
                                </div>
                                <span className="text-[12px] font-black uppercase tracking-tight text-foreground/80">Tiến độ học tập</span>
                              </div>
                              <span className="text-lg font-black text-primary leading-none">{Math.round(item.courseListResponse.progress)}%</span>
                            </div>
                            <Progress value={item.courseListResponse.progress} className="h-2.5 bg-muted shadow-inner" />
                            
                            <div className="mt-4 flex items-center justify-between bg-muted/20 p-2.5 rounded-lg border border-border/40">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={cn(
                                      "w-3.5 h-3.5", 
                                      i < Math.floor(item.courseListResponse.averageRate) 
                                        ? "text-amber-400 fill-amber-400" 
                                        : "text-muted-foreground/30"
                                    )}
                                  />
                                ))}
                                <span className="text-[10px] font-bold text-muted-foreground ml-1">({item.courseListResponse.averageRate})</span>
                              </div>
                              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {item.rateResponses?.length || 0} Đánh giá
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </SideSheetContent>
      </SideSheet>
    </div>
  );
};

const GraduationCapIcon = ({size}: {size: number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
);
