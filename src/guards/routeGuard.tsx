'use client';

import { ReactNode, useEffect, useState } from 'react';
import { observer } from '@legendapp/state/react';
import { usePathname, useRouter } from 'next/navigation';
import { authState$ } from '@/modules/auth/store';
import { getNormalizedRole } from '@/modules/auth/utils';
import { ROUTES, PRIVATE_ROUTES, AUTH_ROUTES } from '@/constants/routes';


interface RouteGuardProps {
  children: ReactNode;
}

export const RouteGuard = observer(({ children }: RouteGuardProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = authState$.isAuthenticated.get();
  const user = authState$.user.get();

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

      console.log('[RouteGuard] Path:', pathname, 'Auth:', isAuthenticated, 'User:', user);

      // Handle private route access
      if (isPrivateRoute && !isAuthenticated) {
        console.log('[RouteGuard] Private route access denied - redirecting to login');
        router.replace(ROUTES.AUTH.LOGIN);
        return;
      }

      // Role-based access control
      if (isAuthenticated && user) {
        const userRoleRaw = user.role || (user.roles && user.roles[0]);
        const userRole = getNormalizedRole(userRoleRaw);
        
        console.log('[RouteGuard] Checking Role:', userRole, 'Original:', userRoleRaw, 'at Path:', pathname);

        
        // Admin route check
        if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
          console.log('[RouteGuard] Non-admin accessing admin route - redirecting to home');
          router.replace(ROUTES.PUBLIC.HOME);
          return;
        }
        
        // Teacher route check
        if (pathname.startsWith('/teacher') && userRole !== 'TEACHER') {
          console.log('[RouteGuard] Non-teacher accessing teacher route - redirecting to home');
          router.replace(ROUTES.PUBLIC.HOME);
          return;
        }
      }

      // Handle auth route access
      if (isAuthRoute && isAuthenticated) {
        const userRoleRaw = user?.role || (user?.roles && user?.roles[0]);
        const userRole = getNormalizedRole(userRoleRaw);
        
        console.log('[RouteGuard] Authenticated user at auth route, Role:', userRole, 'Original:', userRoleRaw);

        
        if (userRole === 'ADMIN') {
          console.log('[RouteGuard] Redirecting to Admin Dashboard');
          router.replace(ROUTES.ADMIN.DASHBOARD);
        } else if (userRole === 'TEACHER') {
          console.log('[RouteGuard] Redirecting to Teacher Dashboard');
          router.replace(ROUTES.TEACHER.DASHBOARD);
        } else {
          console.log('[RouteGuard] Redirecting to Public Home');
          router.replace(ROUTES.PUBLIC.HOME);
        }
        return;
      }
    }, [mounted, isPrivateRoute, isAuthRoute, isAuthenticated, user, pathname, router]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Final check before rendering
  if (isPrivateRoute && !isAuthenticated) return null;
  if (isAuthRoute && isAuthenticated) return null;
  
  // Role checks for rendering
  if (isAuthenticated && user) {
    const userRole = getNormalizedRole(user.role || (user.roles && user.roles[0]));
    if (pathname.startsWith('/admin') && userRole !== 'ADMIN') return null;
    if (pathname.startsWith('/teacher') && userRole !== 'TEACHER') return null;
  }


  return <>{children}</>;
});