'use client';

import { observer } from '@legendapp/state/react';
import { useHomeData } from '@/modules/home/hooks/useHomeData';
import { PostList } from '@/modules/home/components/PostList';
import { StatsCard } from '@/modules/home/components/StatsCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { FooterBlock } from '@/components/sections/footer-block';

const HomePageContent = observer(() => {
  const { posts, stats, isLoading, likePost, refresh } = useHomeData();

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bảng tin</h1>
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
        
        {stats && <StatsCard stats={stats} />}
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Bài viết gần đây</h2>
          <PostList posts={posts} onLike={likePost} />
        </div>
      </main>
      <FooterBlock />
    </div>
  );
});

export default HomePageContent;