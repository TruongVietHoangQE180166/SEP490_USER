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
    LEARN: '/learn',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    // add more admin routes here
  },
  TEACHER: {
    DASHBOARD: '/teacher',
    // add more teacher routes here
  }
} as const;

export const PUBLIC_ROUTES = Object.values(ROUTES.PUBLIC);
export const AUTH_ROUTES = Object.values(ROUTES.AUTH);
export const PRIVATE_ROUTES = [
  ...Object.values(ROUTES.PRIVATE),
  ...Object.values(ROUTES.ADMIN),
  ...Object.values(ROUTES.TEACHER)
];

// Role based access requirements
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: [ROUTES.ADMIN.DASHBOARD],
  TEACHER: [ROUTES.TEACHER.DASHBOARD],
  USER: [ROUTES.PRIVATE.MY_COURSE, ROUTES.PRIVATE.LEARN],
};