'use client';

import { useTheme } from '../providers/ThemeProvider';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
  const { themeMode, setThemeMode } = useTheme();

  // Function to cycle through theme modes: light -> dark -> system -> light
  const cycleThemeMode = () => {
    console.log('ThemeToggle - Current theme mode:', themeMode);
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('system');
    } else {
      setThemeMode('light');
    }
  };

  // Determine which icon to show based on the current theme mode
  const renderIcon = () => {
    switch (themeMode) {
      case 'light':
        return <SunIcon className="w-6 h-6 text-yellow-500" />;
      case 'dark':
        return <MoonIcon className="w-6 h-6 text-gray-300" />;
      case 'system':
        return <ComputerDesktopIcon className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <button
      onClick={cycleThemeMode}
      className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors z-50"
      aria-label="Toggle theme mode"
      title={`Current theme: ${themeMode}`}
    >
      {renderIcon()}
    </button>
  );
}
