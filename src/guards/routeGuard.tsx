'use client';

import { ReactNode, useEffect, useState } from 'react';
import { observer } from '@legendapp/state/react';
import { usePathname, useRouter } from 'next/navigation';
import { authState$, authActions } from '@/modules/auth/store';
import { getNormalizedRole, decodeJWT } from '@/modules/auth/utils';
import { ROUTES, PRIVATE_ROUTES, AUTH_ROUTES } from '@/constants/routes';
import { socketService } from '@/services/socketService';


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

  // Monitor token expiration (Method 1)
  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
       authActions.clearAuth();
       router.replace(ROUTES.AUTH.LOGIN);
       return;
    }

    const currentTime = Date.now() / 1000;
    const timeRemaining = decoded.exp - currentTime;

    if (timeRemaining <= 0) {
      console.log('[RouteGuard] Token already expired on load. Logging out.');
      authActions.clearAuth();
      router.replace(ROUTES.AUTH.LOGIN);
      return;
    }

    console.log(`[RouteGuard] Token expires in ${Math.round(timeRemaining)}s. Setting auto-logout.`);
    // Set timeout to log out when token expires
    const timeoutId = setTimeout(() => {
      console.log('[RouteGuard] Token expired. Auto-logging out.');
      authActions.clearAuth();
      router.replace(ROUTES.AUTH.LOGIN);
    }, timeRemaining * 1000);

    return () => clearTimeout(timeoutId);
  }, [mounted, isAuthenticated, router]);

  // Manage Global Socket Connection
  useEffect(() => {
    if (!mounted) return;

    if (isAuthenticated && user?.userId) {
       console.log('[RouteGuard] Người dùng trực tuyến. Đang kết nối Socket...');
       socketService.connect(user.userId);
    } else {
       console.log('[RouteGuard] Không có thông tin người dùng hợp lệ. Hủy Socket...');
       socketService.disconnect();
    }

    return () => {
       socketService.disconnect();
    };
  }, [mounted, isAuthenticated, user?.userId]);

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