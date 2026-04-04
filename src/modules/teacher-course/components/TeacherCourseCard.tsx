'use client';

import React from 'react';
import { TeacherCourse } from '../types';
import {
  Eye,
  Clock,
  Star,
  Users,
  Edit,
  Trash2,
} from 'lucide-react';

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string; dot: string }> = {
  PUBLISHED: {
    label: 'Đã duyệt',
    className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/25',
    dot: 'bg-emerald-500',
  },
  DRAFT: {
    label: 'Chờ duyệt',
    className: 'bg-amber-500/15 text-amber-600 border-amber-500/25',
    dot: 'bg-amber-500',
  },
  REJECT: {
    label: 'Từ chối',
    className: 'bg-rose-500/15 text-rose-600 border-rose-500/25',
    dot: 'bg-rose-500',
  },
};

// Asset tag style — single uniform color
const ASSET_TAG_CLASS = 'bg-secondary/80 text-secondary-foreground border-border/40 backdrop-blur-sm';

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface TeacherCourseCardProps {
  course: TeacherCourse;
  onView: (course: TeacherCourse) => void;
  onEdit: (course: TeacherCourse) => void;
  onDelete: (id: string, title: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const TeacherCourseCard = ({
  course,
  onView,
  onEdit,
  onDelete,
}: TeacherCourseCardProps) => {
  const statusCfg = STATUS_CONFIG[course.status] ?? STATUS_CONFIG['DRAFT'];

  const thumbnail =
    course.thumbnailUrl ||
    'https://placehold.co/400x225/1e1e2e/6366f1?text=VIC+Course';

  // All assets shown with uniform style
  const tierAssets = course.assets ?? [];

  const authorName = course.author?.name ?? course.createdBy ?? 'Không rõ';
  const authorAvatar = course.author?.avatar
    ? course.author.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=6366f1&color=fff&size=64`;

  return (
    <div className="group relative flex flex-col bg-card rounded-xl border border-border/40 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-primary/8 transition-all duration-300 hover:-translate-y-0.5">

      {/* ── Thumbnail ── */}
      <div
        className="relative aspect-video overflow-hidden bg-muted cursor-pointer"
        onClick={() => onView(course)}
      >
        <img
          src={thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/400x225/1e1e2e/6366f1?text=VIC+Course';
          }}
        />

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Status badge — top left */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-sm ${statusCfg.className}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot} animate-pulse shrink-0`} />
            {statusCfg.label}
          </span>
        </div>

        {/* Price badge — top right */}
        <div className="absolute top-2.5 right-2.5">
          {course.isFree || course.price === 0 ? (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-primary/90 text-primary-foreground backdrop-blur-sm">
              MIỄN PHÍ
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-black/60 text-white backdrop-blur-sm">
              {formatCurrency(course.salePrice > 0 ? course.salePrice : course.price)}
            </span>
          )}
        </div>

        {/* Asset tiers — bottom left (on thumbnail) */}
        {tierAssets.length > 0 && (
          <div className="absolute bottom-2.5 left-2.5 flex gap-1.5 flex-wrap">
            {tierAssets.map((asset) => (
              <span
                key={asset}
                className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${ASSET_TAG_CLASS}`}
              >
                {asset.charAt(0).toUpperCase() + asset.slice(1).toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Title */}
        <h3
          className="text-sm font-bold text-foreground leading-snug line-clamp-2 min-h-[2.5rem] overflow-hidden text-ellipsis cursor-pointer hover:text-primary transition-colors"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          onClick={() => onView(course)}
        >
          {course.title}
        </h3>

        {/* Author row */}
        <div className="flex items-center gap-2">
          <img
            src={authorAvatar}
            alt={authorName}
            className="h-6 w-6 rounded-full object-cover border border-border/50 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=6366f1&color=fff&size=64`;
            }}
          />
          <span className="text-xs text-muted-foreground font-medium truncate">{authorName}</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/40" />

        {/* Stats row: Rating + Asset count */}
        <div className="flex items-center justify-between gap-2">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  className={
                    star <= Math.round(course.averageRate ?? 0)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-muted-foreground/30 fill-muted-foreground/20'
                  }
                />
              ))}
            </div>
            <span className="text-xs font-black text-foreground">
              {course.averageRate > 0 ? course.averageRate.toFixed(1) : '—'}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              ({course.totalRate ?? 0} lượt)
            </span>
          </div>

          {/* Students count & Level */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users size={11} />
              <span className="text-xs font-bold">
                {course.countEnrolledStudents != null ? course.countEnrolledStudents : (course.totalStudents ?? course.totalRate ?? 'Chưa có')}
              </span>
            </div>
            <div className="h-3 w-px bg-border/40" />
            <div className={`flex items-center gap-1 ${
              (course.level as string) === 'LEVEL_5' || course.courseLevel === 'Nâng cao' ? 'text-rose-500' :
              (course.level as string) === 'LEVEL_4' || course.courseLevel === 'Thực hành' ? 'text-orange-500' :
              (course.level as string) === 'LEVEL_3' || course.level === 'INTERMEDIATE' || course.courseLevel === 'Trung cấp' ? 'text-amber-500' :
              (course.level as string) === 'LEVEL_2' || course.courseLevel === 'Nền tảng' ? 'text-blue-500' :
              'text-emerald-500'
            }`}>
              <span className="text-xs font-bold bg-current/10 px-1.5 py-0.5 rounded-md">
                {course.courseLevel || 'Nhập môn'}
              </span>
            </div>
          </div>
        </div>

        {/* Date + discount */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock size={10} />
            {formatDate(course.createdDate)}
          </span>
          {course.discountPercent > 0 && (
            <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-md">
              -{course.discountPercent}%
            </span>
          )}
        </div>
      </div>

      {/* ── Action bar — 3 buttons ── */}
      <div className="border-t border-border/40 grid grid-cols-2 divide-x divide-border/40">
        {/* View */}
        <button
          onClick={() => onView(course)}
          title="Xem chi tiết"
          className="flex flex-col items-center justify-center py-3 gap-1 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
        >
          <Eye size={15} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Xem</span>
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(course)}
          title="Sửa khoá học"
          className="flex flex-col items-center justify-center py-3 gap-1 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/5 transition-all duration-200 cursor-pointer"
        >
          <Edit size={15} />
          <span className="text-[9px] font-bold uppercase tracking-wide">Sửa</span>
        </button>
      </div>

    </div>
  );
};
