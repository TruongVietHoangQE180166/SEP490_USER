'use client';

import { Card, CardContent } from '@/components/ui/card';
import { HomeStats } from '../types';

interface StatsCardProps {
  stats: HomeStats;
}

export const StatsCard = ({ stats }: StatsCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.totalPosts}</div>
          <p className="text-xs text-muted-foreground">Tổng bài viết</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">Người dùng</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.todayViews}</div>
          <p className="text-xs text-muted-foreground">Lượt xem hôm nay</p>
        </CardContent>
      </Card>
    </div>
  );
};