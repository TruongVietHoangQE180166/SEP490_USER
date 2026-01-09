import { User } from './types';

/**
 * Decode JWT token to extract user information
 * @param token - JWT token string
 * @returns Decoded user info or null if invalid
 */
export const decodeJWT = (token: string): User | null => {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Replace URL-safe characters
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decoded = JSON.parse(jsonPayload) as User;
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param token - JWT token string
 * @returns true if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Save user info to localStorage from decoded token
 * @param token - JWT access token
 */
export const saveUserInfoFromToken = (token: string): void => {
  const decoded = decodeJWT(token);
  if (!decoded) {
    console.error('Failed to decode token');
    return;
  }

  // Save individual fields to localStorage
  localStorage.setItem('accessToken', token);
  localStorage.setItem('userId', decoded.userId);
  localStorage.setItem('username', decoded.username);
  localStorage.setItem('email', decoded.email);
  localStorage.setItem('avatar', decoded.avatar);
};

/**
 * Clear all user info from localStorage
 */
export const clearUserInfo = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  localStorage.removeItem('avatar');
};

/**
 * Get user info from localStorage
 */
export const getUserInfoFromStorage = () => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    userId: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
    avatar: localStorage.getItem('avatar'),
  };
};
