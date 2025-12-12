'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Define theme modes
type ThemeMode = 'light' | 'dark' | 'system';

// Helper function to detect system dark mode preference
const getSystemPreference = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Update context type to include the new properties
interface ThemeContextType {
  darkMode: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  themeMode: 'system',
  setThemeMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [mounted, setMounted] = useState(false);

  // Initialize theme state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Get theme mode preference following Tailwind's recommendation
        console.log('ThemeProvider init - Reading from localStorage');
        const savedTheme = localStorage.getItem('theme');
        console.log('ThemeProvider init - localStorage.theme:', savedTheme);
        
        // Determine if we should use system preference
        const useSystemPreference = !savedTheme;
        console.log('ThemeProvider init - Using system preference:', useSystemPreference);
        
        // Set theme mode state based on localStorage
        if (savedTheme === 'light') {
          console.log('ThemeProvider init - Setting theme mode to: light');
          setThemeModeState('light');
          setDarkMode(false);
        } else if (savedTheme === 'dark') {
          console.log('ThemeProvider init - Setting theme mode to: dark');
          setThemeModeState('dark');
          setDarkMode(true);
        } else {
          // Use system preference
          console.log('ThemeProvider init - Setting theme mode to: system');
          setThemeModeState('system');
          const systemPreference = getSystemPreference();
          console.log('ThemeProvider init - System preference is dark:', systemPreference);
          setDarkMode(systemPreference);
        }
        
        // Apply dark mode class to html element directly (Tailwind recommendation)
        const shouldUseDarkMode =
          savedTheme === 'dark' ||
          (!savedTheme && getSystemPreference());
        
        console.log('ThemeProvider init - Should use dark mode:', shouldUseDarkMode);
        
        if (shouldUseDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        console.error('ThemeProvider init - Error accessing localStorage:', error);
        // Fallback to system preference if localStorage access fails
        setThemeModeState('system');
        setDarkMode(getSystemPreference());
      }
    }
    setMounted(true);
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  // Function to set theme mode and update localStorage following Tailwind's recommendation
  const setThemeMode = (mode: ThemeMode) => {
    console.log('ThemeProvider - Setting theme mode to:', mode);
    setThemeModeState(mode);
    
    try {
      if (mode === 'light') {
        localStorage.setItem('theme', 'light');
        console.log('ThemeProvider - Saved "light" to localStorage.theme');
        setDarkMode(false);
      } else if (mode === 'dark') {
        localStorage.setItem('theme', 'dark');
        console.log('ThemeProvider - Saved "dark" to localStorage.theme');
        setDarkMode(true);
      } else if (mode === 'system') {
        // For system preference, remove the item from localStorage
        localStorage.removeItem('theme');
        console.log('ThemeProvider - Removed theme from localStorage for system preference');
        const systemPreference = getSystemPreference();
        console.log('ThemeProvider - System preference is dark:', systemPreference);
        setDarkMode(systemPreference);
      }
    } catch (error) {
      console.error('ThemeProvider - Error saving to localStorage:', error);
    }
  };

  // Update DOM when darkMode changes
  useEffect(() => {
    if (!mounted) return;
    
    console.log('ThemeProvider - Updating DOM, darkMode:', darkMode);
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, mounted]);

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ darkMode, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
