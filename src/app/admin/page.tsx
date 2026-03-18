'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart3, Users, ShieldCheck, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Tổng người dùng', value: '12,345', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Doanh thu tháng', value: '45,000,000 đ', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Khóa học hoạt động', value: '156', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Báo cáo mới', value: '12', icon: ShieldCheck, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground">Chào mừng, Quản trị viên!</h1>
        <p className="text-muted-foreground font-medium">Đây là cái nhìn tổng quan về hệ thống của bạn hôm nay.</p>
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
                <span className="text-emerald-500">+12%</span> so với tháng trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
         <Card className="min-h-[400px] border-border/40 bg-background flex items-center justify-center">
             <div className="text-center space-y-3">
                 <div className="p-4 bg-muted/20 border-border/40 border-2 border-dashed rounded-full inline-block">
                    <BarChart3 className="text-muted-foreground h-10 w-10" />
                 </div>
                 <p className="font-bold text-muted-foreground">Dữ liệu biểu đồ thống kê hệ thống sẽ ở đây.</p>
             </div>
         </Card>
         <Card className="min-h-[400px] border-border/40 bg-background flex items-center justify-center">
             <div className="text-center space-y-3">
                 <div className="p-4 bg-muted/20 border-border/40 border-2 border-dashed rounded-full inline-block">
                    <Users className="text-muted-foreground h-10 w-10" />
                 </div>
                 <p className="font-bold text-muted-foreground">Danh sách người dùng mới đăng ký sẽ ở đây.</p>
             </div>
         </Card>
      </div>
    </div>
  );
}
