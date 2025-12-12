'use client';

import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current page is an auth page
  const isAuthPage = pathname && Object.values(ROUTES.AUTH).some((route) => pathname.startsWith(route));
  
  return (
    <div className={isAuthPage ? 'relative min-h-screen' : 'relative min-h-screen pt-16'}>
      {children}
    </div>
  );
}
