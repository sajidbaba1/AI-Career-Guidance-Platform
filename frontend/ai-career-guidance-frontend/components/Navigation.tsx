import Link from 'next/link';
import { Button, useTheme } from '@geist-ui/core';
import { Moon, Sun } from '@geist-ui/icons';

export default function Navigation() {
  const { themeType, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(themeType === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            AI Career Guide
          </Link>
          <div className="flex space-x-4 items-center">
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              Dashboard
            </Link>
            <Button 
              auto 
              iconRight={themeType === 'dark' ? <Sun /> : <Moon />}
              onClick={toggleTheme}
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            />
            <Button auto type="secondary" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>Login</Button>
            <Button auto type="success" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>Sign Up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
