'use client';

import { FooterBlock } from '@/components/sections/footer-block';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <span className="font-semibold">Trang chủ</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <span>Giới thiệu</span>
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <span>Blog</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm hover:text-primary transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
      <FooterBlock />
    </div>
  );
}
