'use client';

import React, { useMemo } from 'react';
import { useTeacherStudent } from '../hooks/useTeacherStudent';
import { 
  Users, Search, Filter, Mail, Shield, UserCog, User, RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThunderLoader } from '@/components/thunder-loader';
import { motion } from 'framer-motion';

export const TeacherStudentModule = () => {
  const {
    students,
    isLoading,
    error,
    searchQuery,
    filterStatus,
    setFilters,
    reload,
  } = useTeacherStudent();

  // Áp dụng tìm kiếm và lọc trên frontend vì lấy hết 1000
  const filteredStudents = useMemo(() => {
    let result = [...students];

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
            <p className="text-xl font-black text-primary leading-none">{students.length}</p>
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
          ) : filteredStudents.length === 0 ? (
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
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const GraduationCapIcon = ({size}: {size: number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
);
