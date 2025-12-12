'use client';

import { useEffect, useState, ComponentType, createElement, FC } from 'react';
import { useRouter } from 'next/navigation';
import { observer } from '@legendapp/state/react';
import { authState$ } from '@/modules/auth/store';
import { ROUTES } from '@/constants/routes';

export const withGuestGuard = <P extends object>(
  Component: ComponentType<P>
): FC<P> => {
  const GuardedComponent: FC<P> = (props) => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const isAuthenticated = authState$.isAuthenticated.get();

    // Wait for client-side hydration to complete
    useEffect(() => {
      setMounted(true);
    }, []);

    // Redirect if authenticated (only after mounting)
    useEffect(() => {
      if (mounted && isAuthenticated) {
        router.replace(ROUTES.PUBLIC.HOME);
      }
    }, [mounted, isAuthenticated, router]);

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
      return null;
    }

    // Don't render component if authenticated
    if (isAuthenticated) {
      return null;
    }

    return createElement(Component, props);
  };

  return observer(GuardedComponent);
};