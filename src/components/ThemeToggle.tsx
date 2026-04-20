'use client';

import { useState, useEffect } from 'react';
import { observer } from '@legendapp/state/react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { themeState$, setThemeMode, type ThemeMode } from '@/stores/themeStore';
import { cn } from '@/lib/utils';

const themeOptions = [
  { value: 'light' as ThemeMode, label: 'Light', icon: Sun },
  { value: 'dark' as ThemeMode, label: 'Dark', icon: Moon },
  { value: 'system' as ThemeMode, label: 'System', icon: Monitor },
];

export const ThemeToggle = observer(() => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const currentMode = themeState$.mode.get();

  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.theme-toggle-dropdown')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-md bg-muted" />
    );
  }

  const currentOption = themeOptions.find(opt => opt.value === currentMode) || themeOptions[2];
  const CurrentIcon = currentOption.icon;

  return (
    <div className="relative theme-toggle-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-md",
          "bg-transparent hover:bg-accent",
          "text-foreground transition-colors",
          "border border-transparent hover:border-border"
        )}
        title={`Theme: ${currentOption.label}`}
        aria-label={`Giao diện: ${currentOption.label}`}
        aria-expanded={isOpen}
      >
        <CurrentIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = currentMode === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => {
                  setThemeMode(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5",
                  "text-sm text-left transition-colors",
                  isActive 
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "text-popover-foreground hover:bg-accent/50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{option.label}</span>
                {isActive && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

ThemeToggle.displayName = 'ThemeToggle';