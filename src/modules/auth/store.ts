import { observable } from '@legendapp/state';
import { AuthState, User } from './types';
import { STORAGE_KEYS } from '@/constants/storageKeys';

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Create observable
export const authState$ = observable<AuthState>(initialAuthState);

// Manual persistence handling
if (typeof window !== 'undefined') {
  // Load from localStorage on init
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (stored) {
      const data = JSON.parse(stored);
      authState$.set(data);
    }
  } catch (e) {
    console.error('Failed to load auth state:', e);
  }

  // Save to localStorage on change
  authState$.onChange(() => {
    const value = authState$.get();
    if (value.isAuthenticated) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(value));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  });
}

// Actions
export const authActions = {
  setUser: (user: User, token: string) => {
    authState$.set({
      user,
      token,
      isAuthenticated: true,
    });
    
    // Also save individual fields to localStorage for easy access
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userId', user.userId);
      localStorage.setItem('username', user.username);
      localStorage.setItem('email', user.email);
      if (user.avatar) {
        localStorage.setItem('avatar', user.avatar);
      }
    }
  },


  clearAuth: () => {
    authState$.set(initialAuthState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      // Also remove individual fields
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('avatar');
    }
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = authState$.user.peek();
    if (currentUser) {
      authState$.user.set({ ...currentUser, ...updates });
    }
  },
};