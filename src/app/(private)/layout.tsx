'use client';

import { FooterBlock } from '@/components/sections/footer-block';
import { GlobalUIWrapper } from '@/components/GlobalUIWrapper';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main>
        {children}
      </main>
      <GlobalUIWrapper>
        <FooterBlock />
      </GlobalUIWrapper>
    </div>
  );
}