'use client';

import { useSearchParams } from 'next/navigation';
import { Monitor, Smartphone, ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';

function DesktopOnlyContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const section = from.startsWith('/admin') ? 'Admin' : 'Teacher';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-[120px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">
        {/* Icon cluster */}
        <div className="relative mb-10">
          {/* Desktop icon (main) */}
          <div className="w-24 h-24 rounded-[2rem] bg-card/80 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
            <Monitor className="w-12 h-12 text-primary" strokeWidth={1.5} />
          </div>
          {/* Mobile icon (blocked) */}
          <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-lg">
            <Smartphone className="w-6 h-6 text-rose-400" strokeWidth={1.5} />
            {/* X mark */}
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shadow">
              <span className="text-white text-[10px] font-black leading-none">✕</span>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Giao diện {section}
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-black tracking-tight text-foreground mb-4 leading-tight">
          Yêu cầu{' '}
          <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]">
            Máy tính
          </span>{' '}
          Desktop
        </h1>

        {/* Description */}
        <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-8 max-w-sm">
          Giao diện quản lý <strong className="text-foreground">{section}</strong> được thiết kế
          dành riêng cho màn hình lớn. Vui lòng sử dụng{' '}
          <span className="text-foreground font-bold">máy tính hoặc laptop</span> để có trải
          nghiệm tốt nhất.
        </p>

        {/* Features list */}
        <div className="w-full space-y-2 mb-8">
          {[
            'Bảng điều khiển đa cột phức tạp',
            'Quản lý dữ liệu với bảng chi tiết',
            'Biểu đồ và phân tích thống kê',
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/30 text-left"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
              <span className="text-xs font-medium text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>

        {/* Back button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary font-black text-xs uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Về trang chủ
        </a>
      </div>
    </div>
  );
}

export default function DesktopOnlyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DesktopOnlyContent />
    </Suspense>
  );
}
