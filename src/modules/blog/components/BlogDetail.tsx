'use client';

import { observer } from '@legendapp/state/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, BookOpen, Quote, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBlogDetail } from '../hooks/useBlogDetail';
import { useBlog } from '../hooks/useBlog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogCard } from './BlogCard';
import { CommentThread } from '@/components/uitripled/comment-thread';

interface BlogDetailProps {
  slug: string;
}

export const BlogDetail = observer(({ slug }: BlogDetailProps) => {
  const router = useRouter();
  const { post, isLoading, openToggle, handleToggle } = useBlogDetail(slug);
  const { posts } = useBlog();

  if (isLoading) {
    return (
      <div className="max-w-8xl mx-auto px-4 py-8 text-center">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border/50 bg-card/30 p-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground font-medium animate-pulse">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-8xl mx-auto px-4 py-8 text-center">
        <div className="rounded-xl border border-border/50 bg-card/30 p-20">
          <h1 className="mb-4 text-2xl font-bold text-foreground">
            Không tìm thấy bài viết
          </h1>
          <Button onClick={() => router.push('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // Get 3 related posts from the beginning of the list, excluding current post
  const relatedPosts = posts.filter(p => p.slugName !== slug).slice(0, 3);

  return (
    <div className="max-w-[1850px] mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="mx-auto max-w-[1850px] overflow-hidden rounded-xl border border-border/40 bg-card shadow-xl shadow-black/5"
      >
        {/* Cover Image Section */}
        <div className="relative h-64 w-full md:h-[400px]">
          <motion.div
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0"
          >
            <img
              src={post.image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onClick={() => router.push('/blog')}
            className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-background/90 hover:bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors border border-border/50 shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </motion.button>
        </div>

        <div className="space-y-12 px-6 py-10 md:px-12 md:py-16">
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge className="bg-primary/10 hover:bg-primary/20 text-primary border-none px-4 py-1.5 font-bold uppercase tracking-wider text-[10px]">
                {post.categoryName}
              </Badge>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground/70" />
                {post.readTime} phút đọc
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground/70" />
                {new Date(post.createdDate).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border/50 pb-8">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-border/50 shadow-sm">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userName}`} alt={post.userName} />
                  <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-foreground text-lg">{post.userName}</span>
                  <span className="text-sm text-muted-foreground leading-relaxed max-w-md">
                    Chuyên gia phân tích thị trường Crypto
                  </span>
                </div>
              </div>

              {/* Action Buttons moved to Header */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 rounded-full px-4 h-9">
                  <Share2 className="h-3.5 w-3.5" />
                  Chia sẻ
                </Button>
                <Button variant="outline" size="sm" className="gap-2 rounded-full px-4 h-9">
                  <Bookmark className="h-3.5 w-3.5" />
                  Lưu
                </Button>
              </div>
            </div>
          </motion.header>

          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <div
                className="whitespace-pre-wrap text-foreground leading-relaxed mb-12"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Hardcoded Notion-style Quote Block */}
              <div className="my-10 space-y-4 rounded-xl border-l-4 border-primary/60 bg-primary/5 p-8 text-muted-foreground">
                <div className="flex items-start gap-4">
                  <Quote className="mt-1 h-8 w-8 text-primary opacity-50" />
                  <div>
                    <p className="text-xl font-medium text-foreground italic leading-relaxed">
                      "Trong thế giới Crypto, kiến thức chính là tấm lá chắn mạnh mẽ nhất để bảo vệ tài sản của bạn."
                    </p>
                    <p className="mt-4 text-sm font-semibold text-primary/80 uppercase tracking-widest">
                      — VICT Academy Insights
                    </p>
                  </div>
                </div>
              </div>

              {/* Hardcoded Toggle Sections (Key Insights) */}
              <div className="space-y-4 mt-12">
                <h3 className="text-2xl font-bold mb-6">Thông tin quan trọng cần nắm vững</h3>
                {[
                  {
                    title: "Quy trình phân tích dự án (DYOR)",
                    summary: "Các bước cơ bản để đánh giá tính minh bạch của một dự án mới.",
                    content: "Kiểm tra Whitepaper, đánh giá đội ngũ phát triển (Team), phân tích Tokenomics và theo dõi cộng đồng trên Twitter/Discord."
                  },
                  {
                    title: "Công cụ hỗ trợ học tập & giao dịch",
                    summary: "Những nền tảng không thể thiếu cho người mới bắt đầu.",
                    content: "Bao gồm: CoinMarketCap để theo dõi giá, TradingView để phân tích kỹ thuật, và các ví lạnh/ví nóng an toàn như MetaMask, Ledger."
                  }
                ].map((section, index) => (
                  <div key={index} className="overflow-hidden rounded-xl border border-border/50 bg-card/50">
                    <button
                      type="button"
                      onClick={() => handleToggle(index)}
                      className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition-colors hover:bg-muted/40"
                    >
                      <div>
                        <p className="text-base font-bold text-foreground">{section.title}</p>
                        <p className="text-sm text-muted-foreground">{section.summary}</p>
                      </div>
                      <motion.span animate={{ rotate: openToggle === index ? 180 : 0 }}>
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {openToggle === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground border-t border-border/10 pt-4"
                        >
                          {section.content}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Reflection Prompts Footer Section */}
              <div className="mt-16 space-y-6 rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-sm text-muted-foreground">
                <h3 className="text-lg font-bold text-foreground">Bạn học được gì hôm nay?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Bạn đã áp dụng phương pháp phân tích nào trong bài viết vào danh mục đầu tư của mình chưa?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Theo bạn, xu hướng công nghệ nào sẽ dẫn dắt thị trường trong giai đoạn tới?
                  </li>
                </ul>
                <p className="italic pt-4 opacity-80 border-t border-border/20">
                  Hãy để lại bình luận để cùng thảo luận với cộng đồng VICT nhé!
                </p>
              </div>
            </motion.article>

            {/* Sidebar (Notion-style) */}
            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-8"
            >
              <div className="sticky top-24 space-y-8">
                {/* About Project Block */}
                <div className="rounded-xl border border-border/60 bg-primary/5 p-6">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary/80">
                    Về dự án VICT
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nền tảng giáo dục Crypto chuyên sâu, giúp bạn từ người mới trở thành nhà đầu tư thông thái thông qua các bài học thực tiễn.
                  </p>
                </div>


                {/* Newsletter Mockup */}
                <div className="rounded-xl border border-border/60 bg-muted/30 p-6 space-y-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">Bản tin học tập VICT</h3>
                  <p className="text-sm text-muted-foreground">
                    Nhận các phân tích thị trường và bài học Crypto mới nhất mỗi tuần.
                  </p>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Email của bạn..." 
                      className="w-full bg-background border border-border/60 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                    <Button size="sm" className="mt-3 w-full rounded-lg font-bold">
                      Đăng ký ngay
                    </Button>
                  </div>
                </div>

              </div>
            </motion.aside>
          </div>
        </div>

        {/* Comment Section */}
        {/* <div className="border-t border-border/50 px-6 py-12 md:px-12">
          <CommentThread />
        </div> */}

        {/* Footer / Related Posts - Moved to bottom */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-border/50 px-6 py-12 md:px-12">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground">
              Bài viết liên quan
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
});
