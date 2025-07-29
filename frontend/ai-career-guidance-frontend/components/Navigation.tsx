import Link from 'next/link';
import { Button } from '@geist-ui/core';

export default function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            AI Career Guide
          </Link>
          <div className="flex space-x-4 items-center">
            <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">
              Dashboard
            </Link>
            <Button auto type="secondary">Login</Button>
            <Button auto type="success">Sign Up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
