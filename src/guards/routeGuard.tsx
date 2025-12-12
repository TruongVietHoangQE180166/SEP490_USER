'use client';

import { ReactNode, useEffect, useState } from 'react';
import { observer } from '@legendapp/state/react';
import { usePathname, useRouter } from 'next/navigation';
import { authState$ } from '@/modules/auth/store';
import { ROUTES, PRIVATE_ROUTES, AUTH_ROUTES } from '@/constants/routes';

interface RouteGuardProps {
  children: ReactNode;
}

export const RouteGuard = observer(({ children }: RouteGuardProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = authState$.isAuthenticated.get();

  // Wait for client-side hydration to complete
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if current route is private
  const isPrivateRoute = pathname && PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current route is auth (login/register)
  const isAuthRoute = pathname && AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Handle redirects only after mounting
  useEffect(() => {
    if (!mounted) return;

    // Handle private route access
    if (isPrivateRoute && !isAuthenticated) {
      router.replace(ROUTES.PUBLIC.HOME);
      return;
    }

    // Handle auth route access
    if (isAuthRoute && isAuthenticated) {
      router.replace(ROUTES.PUBLIC.HOME);
      return;
    }
  }, [mounted, isPrivateRoute, isAuthRoute, isAuthenticated, router]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Don't render if redirecting
  if ((isPrivateRoute && !isAuthenticated) || (isAuthRoute && isAuthenticated)) {
    return null;
  }

  // Otherwise, render children
  return <>{children}</>;
});