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
    VERIFY_OTP: '/verify-otp',
    RESET_PASSWORD: '/reset-password',
  },
  PRIVATE: {
    PROFILE: '/profile',
    DASHBOARD: '/dashboard',
    MY_COURSE: '/my-course',
  },
} as const;

export const PUBLIC_ROUTES = Object.values(ROUTES.PUBLIC);
export const AUTH_ROUTES = Object.values(ROUTES.AUTH);
export const PRIVATE_ROUTES = Object.values(ROUTES.PRIVATE);