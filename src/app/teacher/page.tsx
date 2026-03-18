'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Star, GraduationCap, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TeacherDashboardPage() {
  const stats = [
    { label: 'Số học viên', value: '1,234', icon: Users, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { label: 'Số bài giảng', value: '56', icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Đánh giá chung', value: '4.8', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Chứng chỉ đã cấp', value: '432', icon: GraduationCap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tight text-foreground">Xin chào, Mentor!</h1>
            <p className="text-muted-foreground font-medium">Bắt đầu tạo những bài học đầy cảm hứng cho học viên của bạn ngay hôm nay.</p>
        </div>
        <Button className="font-black gap-2 h-14 px-8 rounded-2xl shadow-lg ring-offset-background hover:scale-105 transition-all">
            <PlusCircle className="h-5 w-5" /> Tạo khóa học mới
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tabular-nums">{stat.value}</div>
              <p className="text-xs text-muted-foreground font-bold mt-2">
                <span className="text-emerald-500">+8%</span> so với tuần trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
         <Card className="lg:col-span-2 min-h-[400px] border-border/40 bg-background flex flex-col p-6">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Khóa học đang diễn ra</h3>
                <Button variant="outline" className="text-xs font-bold">Xem tất cả</Button>
             </div>
             <div className="flex-1 flex items-center justify-center text-center space-y-3">
                 <div className="p-4 bg-muted/20 border-border/40 border-2 border-dashed rounded-full inline-block">
                    <BookOpen className="text-muted-foreground h-10 w-10" />
                 </div>
                 <p className="font-bold text-muted-foreground">Danh sách các khóa học của bạn sẽ được hiển thị ở đây.</p>
             </div>
         </Card>
         <Card className="min-h-[400px] border-border/40 bg-background flex flex-col p-6">
             <h3 className="text-xl font-bold mb-8">Đánh giá mới</h3>
             <div className="flex-1 flex items-center justify-center text-center space-y-3">
                 <div className="p-4 bg-muted/20 border-border/40 border-2 border-dashed rounded-full inline-block">
                    <Star className="text-muted-foreground h-10 w-10" />
                 </div>
                 <p className="font-bold text-muted-foreground">Phản hồi mới nhất từ học viên sẽ ở đây.</p>
             </div>
         </Card>
      </div>
    </div>
  );
}
