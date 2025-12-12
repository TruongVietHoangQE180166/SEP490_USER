export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    BLOG: '/blog',
    ABOUT: '/about',
  },
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
  PRIVATE: {
    PROFILE: '/profile',
    DASHBOARD: '/dashboard',
  },
} as const;

export const PUBLIC_ROUTES = Object.values(ROUTES.PUBLIC);
export const AUTH_ROUTES = Object.values(ROUTES.AUTH);
export const PRIVATE_ROUTES = Object.values(ROUTES.PRIVATE);