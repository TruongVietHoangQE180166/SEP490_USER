import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star } from 'lucide-react';
import { itemVariants, LEVEL_MAP, formatCurrency, formatDate } from './constants';

interface CourseSidebarProps {
  course: any;
}

export const CourseSidebar = ({ course }: CourseSidebarProps) => {
  const authorName = course.author?.name ?? course.createdBy ?? 'Không rõ';
  const authorAvatar = course.author?.avatar
    ? course.author.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=6366f1&color=fff&size=128`;

  return (
    <div className="space-y-4 sticky top-6">
      {/* Author */}
      <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="relative space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">Giảng viên</h3>
            {course.author && (
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Xác minh
              </Badge>
            )}
          </div>
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-border/60 bg-background">
              <img
                src={authorAvatar}
                alt={authorName}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=6366f1&color=fff&size=128`; }}
              />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-lg font-semibold text-foreground">{authorName}</h4>
              {course.author?.email && (
                <p className="text-sm text-foreground/60">{course.author.email}</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pricing */}
      <motion.div variants={itemVariants} className="rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">Thông tin giá</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/60">Giá gốc</span>
            <span className="font-black text-foreground">
              {course.isFree || course.price === 0 ? 'Miễn phí' : formatCurrency(course.price)}
            </span>
          </div>
          {course.salePrice > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">Giá KM</span>
              <span className="font-black text-primary">{formatCurrency(course.salePrice)}</span>
            </div>
          )}
          {course.discountPercent > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">Giảm giá</span>
              <span className="font-black text-rose-500">-{course.discountPercent}%</span>
            </div>
          )}
          <div className="h-px bg-border/30" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Giá cuối</span>
            <span className="text-2xl font-black text-primary">
              {course.isFree || course.price === 0
                ? 'Miễn phí'
                : formatCurrency(course.salePrice > 0 ? course.salePrice : course.price)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Meta */}
      <motion.div variants={itemVariants} className="rounded-2xl border border-border/40 bg-background/60 p-5 backdrop-blur space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">Thông tin</h3>
        {[
          { label: 'Tạo ngày', value: formatDate(course.createdDate) },
          { label: 'Slug', value: course.slug, mono: true },
          { label: 'ID', value: course.id, mono: true, truncate: true },
          ...(course.level ? [{ label: 'Cấp độ', value: LEVEL_MAP[course.level] ?? course.level }] : []),
          ...(course.categoryName ? [{ label: 'Danh mục', value: course.categoryName }] : []),
        ].map((item: any) => (
          <div key={item.label} className="flex items-start justify-between gap-2">
            <span className="text-xs text-muted-foreground/60 font-bold uppercase tracking-wider shrink-0">{item.label}</span>
            <span
              className={`text-xs font-medium text-right ${item.mono ? 'font-mono' : ''} ${item.truncate ? 'truncate max-w-[120px]' : ''}`}
              title={item.truncate ? item.value : undefined}
            >
              {item.value}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Rating summary */}
      <motion.div variants={itemVariants} className="rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground mb-4">Đánh giá</h3>
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl font-black text-foreground tabular-nums">
              {(course.averageRate ?? 0).toFixed(1)}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-5 w-5 ${s <= Math.round(course.averageRate ?? 0) ? 'fill-amber-500 text-amber-500' : 'text-border'}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{course.totalRate ?? 0} đánh giá</p>
          </div>
        </motion.div>
    </div>
  );
};
