import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RouteGuard } from '@/guards/routeGuard';
import { PageLoadingIndicator } from '@/components/PageLoadingIndicator';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { SearchDock } from '@/components/SearchDock';
import { ChatBubble } from '@/components/ChatBubble';
import { AttendanceBubble } from '@/components/AttendanceBubble';
import { HeroHeader } from '@/components/header1';
import { MainWrapper } from '@/components/MainWrapper';
import { ToastContainer } from '@/components/ui/toast';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js App with Legend-App',
  description: 'A Next.js application with Legend-App state management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Theme detection script to prevent FLASH of unstyled content */}
        <Script
          id="theme-detection"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('theme-storage');
                let theme = 'light';
                
                if (stored) {
                  const data = JSON.parse(stored);
                  const mode = data.mode || 'system';
                  
                  if (mode === 'system') {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  } else if (mode === 'dark' || mode === 'light') {
                    theme = mode;
                  }
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  theme = 'dark';
                }
                
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme);
              } catch (_) {
                document.documentElement.classList.add('light');
              }
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <HeroHeader />
        <MainWrapper>
          <RouteGuard>{children}</RouteGuard>
          <SearchDock />
          <ChatBubble />
          <AttendanceBubble />
        </MainWrapper>
        <PageLoadingIndicator />
        <LoadingOverlay />
        <ToastContainer />
      </body>
    </html>
  );
}