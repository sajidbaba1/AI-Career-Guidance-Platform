'use client';

import { Button, useToasts } from '@geist-ui/core';
import { Moon, Sun } from '@geist-ui/icons';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const { setToast } = useToasts();
  
  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme?.(newTheme);
      setToast({
        text: `Switched to ${newTheme} mode`,
        type: 'success',
        delay: 1000
      });
    } catch (error) {
      console.error('Failed to toggle theme:', error);
      setToast({
        text: 'Failed to change theme',
        type: 'error'
      });
    }
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
        <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            AI Career Guidance
          </h1>
          <Button 
            auto 
            aria-label="Loading theme" 
            loading 
            type="abort"
            className="opacity-0"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            
          </Button>
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
      <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          AI Career Guidance
        </h1>
        <div className="flex items-center space-x-4">
          <Button 
            auto 
            onClick={toggleTheme}
            icon={theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            type="abort"
            className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </nav>
    </header>
  );
}
