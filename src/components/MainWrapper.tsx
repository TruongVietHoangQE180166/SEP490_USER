'use client';

import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current page is an auth page
  const isAuthPage = pathname && Object.values(ROUTES.AUTH).some((route) => pathname.startsWith(route));
  const isLearnPage = pathname && pathname.startsWith('/learn');
  
  return (
    <div className={(isAuthPage || isLearnPage) ? 'relative min-h-screen' : 'relative min-h-screen pt-28'}>
      {children}
    </div>
  );
}
