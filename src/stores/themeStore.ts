import { observable } from '@legendapp/state';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
}

// Get system preference
const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Determine initial theme mode
const getInitialMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  
  try {
    const stored = localStorage.getItem('theme-storage');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.mode === 'dark' || data.mode === 'light' || data.mode === 'system') {
        return data.mode;
      }
    }
  } catch (e) {
    console.error('Failed to load theme:', e);
  }
  
  return 'system';
};

// Resolve theme based on mode
const resolveTheme = (mode: ThemeMode): ResolvedTheme => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
};

const initialMode = typeof window !== 'undefined' ? getInitialMode() : 'system';

export const themeState$ = observable<ThemeState>({
  mode: initialMode,
  resolvedTheme: resolveTheme(initialMode),
});

// Client-side only logic
if (typeof window !== 'undefined') {
  // Apply initial theme immediately
  const initialResolved = themeState$.resolvedTheme.peek();
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(initialResolved);
  
  // Listen to system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    const currentMode = themeState$.mode.peek();
    if (currentMode === 'system') {
      const newResolved = getSystemTheme();
      themeState$.resolvedTheme.set(newResolved);
      
      // Update DOM
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newResolved);
    }
  };
  
  mediaQuery.addEventListener('change', handleSystemThemeChange);
  
  // Save to localStorage on mode change and update DOM
  themeState$.mode.onChange(({ value: mode }) => {
    const value = themeState$.get();
    localStorage.setItem('theme-storage', JSON.stringify({ mode: value.mode }));
    
    // Resolve and update theme
    const resolved = resolveTheme(mode);
    themeState$.resolvedTheme.set(resolved);
    
    // Update document class
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
  });
}

// Actions
export const setThemeMode = (mode: ThemeMode) => {
  themeState$.mode.set(mode);
};

export const toggleTheme = () => {
  const currentMode = themeState$.mode.get();
  const modes: ThemeMode[] = ['light', 'dark', 'system'];
  const currentIndex = modes.indexOf(currentMode);
  const nextIndex = (currentIndex + 1) % modes.length;
  setThemeMode(modes[nextIndex]);
};
