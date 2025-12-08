import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, ThemeConfig } from '../../types';

interface ThemeContextValue {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const DEFAULT_THEME: ThemeConfig = {
  mode: 'light',
  primaryColor: '#6366f1', // Indigo
  accentColor: '#ec4899', // Pink
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    const stored = localStorage.getItem('conceptscroll-theme');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_THEME;
      }
    }
    return DEFAULT_THEME;
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    // Handle system theme if mode is 'system'
    let effectiveMode = theme.mode;
    if (theme.mode === 'system') {
      effectiveMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Apply dark/light mode
    if (effectiveMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply custom colors
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    
    // Save to localStorage
    localStorage.setItem('conceptscroll-theme', JSON.stringify(theme));
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme.mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      if (mediaQuery.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme.mode]);

  const setTheme = (updates: Partial<ThemeConfig>) => {
    setThemeState(prev => ({ ...prev, ...updates }));
  };

  const toggleTheme = () => {
    setThemeState(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
