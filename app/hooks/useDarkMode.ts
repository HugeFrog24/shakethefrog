'use client';

import { useTheme } from '../providers/ThemeProvider';

/**
 * A simplified hook that provides dark mode state from ThemeProvider
 * This hook is maintained for backward compatibility with existing components
 */
export function useDarkMode() {
  const { darkMode, setThemeMode } = useTheme();

  // Simplified toggle function that cycles between light and dark
  const toggleDarkMode = () => {
    console.log('useDarkMode - Toggling dark mode, current darkMode:', darkMode);
    setThemeMode(darkMode ? 'light' : 'dark');
  };

  // For backward compatibility
  const resetToSystemPreference = () => {
    console.log('useDarkMode - Resetting to system preference');
    setThemeMode('system');
  };

  return { darkMode, toggleDarkMode, resetToSystemPreference };
}
