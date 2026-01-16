'use client';

import { FooterBlock } from '@/components/sections/footer-block';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <FooterBlock />
    </div>
  );
}