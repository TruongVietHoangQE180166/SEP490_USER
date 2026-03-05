'use client';

import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current page is an auth page
  const isAuthPage = pathname && Object.values(ROUTES.AUTH).some((route) => pathname.startsWith(route));
  const isLearnPage = pathname && pathname.startsWith('/learn');
  const isAdminPage = pathname && pathname.startsWith('/admin');
  const isTeacherPage = pathname && pathname.startsWith('/teacher');
  
  const noHeader = isAuthPage || isLearnPage || isAdminPage || isTeacherPage;
  
  return (
    <div className={noHeader ? 'relative min-h-screen' : 'relative min-h-screen pt-28'}>
      {children}
    </div>
  );
}
