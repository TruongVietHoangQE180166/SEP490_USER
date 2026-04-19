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
import { GlobalUIWrapper } from '@/components/GlobalUIWrapper';
import { NewbieRewardBubble } from '@/components/NewbieRewardBubble';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'VICTEACH - Nền tảng học hỏi và đầu tư tài chính số 1',
    template: '%s | VICTEACH'
  },
  description: 'VICTEACH cung cấp các khóa học chuyên sâu về Blockchain, Crypto, Phân tích kỹ thuật và Tài chính phi tập trung (DeFi). Bắt đầu hành trình đầu tư thông minh của bạn ngay hôm nay.',
  keywords: ['VICTEACH', 'học crypto', 'đầu tư tài chính', 'blockchain', 'phân tích kỹ thuật', 'defi', 'tài chính phi tập trung', 'khóa học online'],
  authors: [{ name: 'VICTEACH Team' }],
  creator: 'VICTEACH',
  publisher: 'VICTEACH',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://victeach.io.vn',
    siteName: 'VICTEACH',
    title: 'VICTEACH - Học và Đầu tư Tài chính Thông minh',
    description: 'Nâng tầm kiến thức về thị trường Crypto và Blockchain cùng các chuyên gia hàng đầu.',
    images: [
      {
        url: 'https://victeach.io.vn/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VICTEACH - Financial Education Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VICTEACH - Học và Đầu tư Tài chính Thông minh',
    description: 'Nền tảng giáo dục tài chính số hàng đầu Việt Nam.',
    images: ['https://victeach.io.vn/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon.ico' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome', url: '/favicon_io/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/favicon_io/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  manifest: '/favicon_io/site.webmanifest',
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
        <GlobalUIWrapper>
          <HeroHeader />
        </GlobalUIWrapper>
        <MainWrapper>
          <RouteGuard>{children}</RouteGuard>
          <GlobalUIWrapper>
            <SearchDock />
            <ChatBubble />
            <NewbieRewardBubble />
            <AttendanceBubble />
          </GlobalUIWrapper>
        </MainWrapper>
        <PageLoadingIndicator />
        <LoadingOverlay />
        <ToastContainer />
        
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'VICTEACH',
              url: 'https://victeach.io.vn',
              logo: 'https://victeach.io.vn/logo.png',
              sameAs: [
                'https://facebook.com/victeach',
                'https://twitter.com/victeach',
                'https://youtube.com/victeach',
              ],
              description: 'Nền tảng giáo dục tài chính số 1 về Blockchain và Crypto.',
            }),
          }}
        />
      </body>
    </html>
  );
}