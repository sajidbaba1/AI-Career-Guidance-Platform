import Link from 'next/link';
import { Button, useTheme } from '@geist-ui/core';
import { Moon, Sun } from '@geist-ui/icons';

export default function Navigation() {
  const { themeType, setTheme } = useTheme();
  
  return (
    <nav className="fixed w-full z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              AI Career Guide
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              auto 
              onClick={() => setTheme(themeType === 'dark' ? 'light' : 'dark')}
              icon={themeType === 'dark' ? <Sun /> : <Moon />}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
