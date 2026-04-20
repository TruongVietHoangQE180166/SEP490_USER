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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
    <div className="space-y-8 pb-10">
      {/* ── Hero Header ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-background to-secondary/5 p-8 border border-primary/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 mt-2">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-12 right-64 w-12 h-12 bg-primary/8 rounded-xl blur-sm rotate-12 hidden xl:block" />
        <div className="absolute bottom-12 right-48 w-8 h-8 bg-secondary/10 rounded-lg blur-sm -rotate-6 hidden xl:block" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="p-5 bg-primary text-primary-foreground rounded-xl shadow-2xl shadow-primary/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0 w-fit">
            <Users size={32} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1 w-6 bg-primary rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary opacity-80">
                VIC Management
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-[1000] tracking-tighter text-foreground leading-none">
              Quản lý <span className="text-primary italic">Học viên</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm md:text-base mt-4 max-w-md leading-relaxed">
              Theo dõi lộ trình học tập, quản lý tài khoản và hỗ trợ trực tiếp cho <span className="text-foreground font-black underline decoration-primary/30 decoration-2">{students?.length || 0} học viên</span> của bạn.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 bg-background/60 backdrop-blur-md p-4 rounded-xl border border-border/40 shadow-sm min-w-[180px]"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <User size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">
                Tổng cộng
              </p>
              <p className="text-2xl font-black tracking-tight text-foreground leading-none">
                {students?.length || 0}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4 bg-background/60 backdrop-blur-md p-4 rounded-xl border border-border/40 shadow-sm min-w-[180px]"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">
                Hoạt động
              </p>
              <p className="text-2xl font-black tracking-tight text-emerald-500 leading-none">
                {students?.filter(s => s.status === 'ACTIVE').length || 0}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Table Content */}
      <Card className="border-none bg-transparent shadow-none overflow-visible">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            </div>
            <Input
              placeholder="Tìm kiếm Email, Tên hoặc ID..."
              value={searchQuery}
              onChange={(e) => setFilters({ query: e.target.value })}
              className="pl-11 bg-card/50 backdrop-blur-sm border-border/40 focus:bg-card focus:ring-4 focus:ring-primary/5 h-12 rounded-xl transition-all shadow-sm"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={reload} 
            disabled={isLoading} 
            className="h-12 w-12 rounded-xl bg-card/50 border-border/40 hover:bg-card hover:text-primary transition-all group shrink-0"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
          </Button>
        </div>

        <div className="relative rounded-xl border border-border/40 bg-card/30 backdrop-blur-md overflow-hidden shadow-xl shadow-black/[0.02]">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center space-y-6">
              <ThunderLoader size="lg" animate="thunder" />
              <div className="text-center space-y-1">
                 <p className="text-sm font-black text-foreground uppercase tracking-widest">Đang khởi tạo lịch dữ liệu</p>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] animate-pulse">Vui lòng chờ trong giây lát...</p>
              </div>
            </div>
          ) : (filteredStudents || []).length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center px-6">
              <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center mb-6 relative">
                <Search className="h-10 w-10 text-muted-foreground/30" />
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/20 animate-[spin_10s_linear_infinite]" />
              </div>
              <h3 className="text-2xl font-black text-foreground tracking-tight">Không tìm thấy kết quả</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                Chúng tôi không tìm thấy học viên nào khớp với từ khóa "{searchQuery}"
              </p>
              {(searchQuery || filterStatus !== 'ALL') && (
                <Button 
                  onClick={() => setFilters({ query: '', status: 'ALL' })} 
                  variant="ghost"
                  className="mt-6 font-black text-xs uppercase tracking-widest text-primary hover:bg-primary/10"
                >
                  Thiết lập lại bộ lọc
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/40">
                    <th className="px-8 py-5 text-left">
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Học Viên & Định Danh</span>
                    </th>
                    <th className="px-6 py-5 text-center">
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Vai Trò</span>
                    </th>
                    <th className="px-6 py-5 text-center">
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Level</span>
                    </th>
                    <th className="px-6 py-5 text-center">
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Trạng Thái</span>
                    </th>
                    <th className="px-8 py-5 text-right">
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Hành Động</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  <AnimatePresence mode="popLayout">
                    {filteredStudents.map((student, idx) => (
                      <motion.tr 
                        key={student.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                        className="group hover:bg-muted/10 transition-all duration-300 relative"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative shrink-0">
                               <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-sm relative z-10 transition-transform group-hover:scale-110 duration-500">
                                 <User size={20} strokeWidth={2.5} />
                               </div>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-black text-foreground text-[15px] tracking-tight group-hover:text-primary transition-colors truncate">
                                {student.username}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] font-bold text-muted-foreground/60 tracking-tight flex items-center gap-1.5 leading-none">
                                  <Mail size={12} className="opacity-40" />
                                  {student.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-widest shadow-none",
                            student.role === 'TEACHER' 
                              ? "bg-amber-500/5 text-amber-600 border-amber-500/10" 
                              : "bg-blue-500/5 text-blue-600 border-blue-500/10"
                          )}>
                            {student.role === 'TEACHER' ? (
                              <><UserCog size={11} strokeWidth={2.5} /> GV</>
                            ) : (
                              <><GraduationCapIcon size={11} /> HV</>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <Badge variant="outline" className="rounded-md h-6 px-2 text-[9px] font-black uppercase tracking-widest bg-violet-500/5 text-violet-600 border-violet-500/10 shadow-none whitespace-nowrap">
                            {student.level === 'NEN_TANG' ? 'Nền tảng' : student.level === 'NHAP_MON' ? 'Nhập môn' : student.level || 'Khách'}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.1em] border animate-in fade-in zoom-in duration-500",
                            student.status === 'ACTIVE' 
                              ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" 
                              : "bg-rose-500/5 text-rose-500 border-rose-500/10"
                          )}>
                            <span className={cn(
                              "size-1 rounded-full",
                              student.status === 'ACTIVE' ? "bg-emerald-500" : "bg-rose-500"
                            )} />
                            {student.status === 'ACTIVE' ? 'Hoạt động' : 'Khóa'}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleShowDetail(student)}
                            className="h-10 rounded-lg px-4 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/5 transition-all group/btn border border-transparent hover:border-primary/20"
                          >
                            Chi tiết
                            <ChevronRight size={14} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* SideSheet Detail Section */}
      <SideSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} width="550px">
        <SideSheetContent className="border-l border-border/40 p-0 overflow-hidden bg-background">
          <div className="h-full flex flex-col relative">
            {/* Header with decorative background */}
            <div className="relative pt-12 pb-8 px-8 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent -z-10" />
               <div className="absolute top-0 right-0 p-8 text-primary opacity-[0.03] rotate-12">
                  <Users size={200} strokeWidth={1} />
               </div>
               
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary shadow-xl shadow-primary/5 border border-primary/20">
                        <User size={32} />
                     </div>
                     <div>
                        <h2 className="text-2xl font-black tracking-tight text-foreground">{selectedStudent?.username}</h2>
                        <div className="flex items-center gap-2 mt-1">
                           <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary px-2 rounded-md">
                              {selectedStudent?.role}
                           </Badge>
                           <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                              #{selectedStudent?.id.split('-').pop()}
                           </span>
                        </div>
                     </div>
                  </div>
                  <SideSheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-transparent hover:border-rose-500/20">
                      <X size={20} />
                    </Button>
                  </SideSheetClose>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card/60 backdrop-blur-sm p-4 rounded-xl border border-border/40 shadow-sm">
                     <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Trạng thái tài khoản</p>
                     <div className="flex items-center gap-2">
                        <div className={cn("size-2 rounded-full", selectedStudent?.status === 'ACTIVE' ? "bg-emerald-500" : "bg-rose-500")} />
                        <span className="text-sm font-black text-foreground lowercase first-letter:uppercase">
                           {selectedStudent?.status === 'ACTIVE' ? 'Đang hoạt động' : 'Bị khóa'}
                        </span>
                     </div>
                  </div>
                  <div className="bg-card/60 backdrop-blur-sm p-4 rounded-xl border border-border/40 shadow-sm">
                     <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Trình độ kỹ năng</p>
                     <div className="flex items-center gap-2">
                        <Trophy size={14} className="text-amber-500" />
                        <span className="text-sm font-black text-foreground">
                           {selectedStudent?.level || 'Mới tham gia'}
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            <ScrollArea className="flex-1 px-8 pb-12">
               <div className="space-y-8">
                  {/* Detailed Stats Cards */}
                  <div className="bg-muted/30 p-5 rounded-xl border border-border/40 space-y-4">
                     <div className="flex items-center gap-3">
                        <Mail size={18} className="text-primary/60" />
                        <div className="flex flex-col">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">Email liên lạc</p>
                           <p className="text-sm font-bold text-foreground truncate">{selectedStudent?.email || 'N/A'}</p>
                        </div>
                     </div>
                  </div>

                  {/* Course List Section */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                       <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/80 flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                           <BookOpen size={16} />
                         </div>
                         Khóa học tập trung
                       </h4>
                       <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-md border border-primary/20 shadow-sm">
                         {(selectedStudentCourses || []).length} Khóa học
                       </span>
                    </div>

                    {isDetailLoading ? (
                      <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <ThunderLoader size="md" animate="thunder" />
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Phân tích tiến độ học tập...</p>
                      </div>
                    ) : (selectedStudentCourses || []).length === 0 ? (
                      <div className="py-16 text-center border-2 border-dashed border-border/40 rounded-xl bg-muted/5 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                           <BookOpen size={28} className="text-muted-foreground/20" />
                        </div>
                        <p className="text-sm font-black text-muted-foreground uppercase tracking-tight">Chưa có khóa học nào</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1 max-w-[200px] mx-auto">
                           Học viên này hiện chưa thực hiện đăng ký bất kỳ khóa học nào.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {(selectedStudentCourses || []).map((item, idx) => (
                          <motion.div 
                            key={item.courseListResponse.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-4 rounded-xl bg-card border border-border/40 hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/[0.05]"
                          >
                            <div className="flex gap-4">
                              <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-border/20 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                <img 
                                  src={item.courseListResponse.thumbnailUrl} 
                                  alt={item.courseListResponse.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 flex flex-col justify-center min-w-0">
                                <h5 className="font-black text-[14px] leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                  {item.courseListResponse.title}
                                </h5>
                                <div className="flex items-center gap-3 mt-3">
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10">
                                     <Star size={11} className="text-amber-400 fill-amber-400" />
                                     <span className="text-[10px] font-black text-primary">{item.courseListResponse.averageRate.toFixed(1)}</span>
                                  </div>
                                  <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest bg-muted border-none text-muted-foreground/70 rounded-md">
                                    {item.courseListResponse.courseLevel}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-border/40">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Tiến độ hoàn thành</span>
                                <span className="text-[15px] font-black text-primary">{Math.round(item.courseListResponse.progress)}%</span>
                              </div>
                              <div className="relative h-2 bg-muted rounded-full overflow-hidden shadow-inner flex-1">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.courseListResponse.progress}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/60 to-primary rounded-full"
                                 />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
               </div>
            </ScrollArea>
            
            {/* Action Footer */}
            <div className="p-6 pt-4 border-t border-border/40 bg-card/50 backdrop-blur-md">
               <Button className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 gap-2">
                  <Mail size={16} /> Gửi thông báo trực tiếp
               </Button>
            </div>
          </div>
        </SideSheetContent>
      </SideSheet>
    </div>
  );
};

const GraduationCapIcon = ({size}: {size: number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
);
