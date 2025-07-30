'use client';

import { GeistProvider, CssBaseline } from '@geist-ui/core';
import "./globals.css";
import { Providers } from "./providers";
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-gray-900 transition-colors duration-200">
        <Providers>
          <GeistProvider>
            <CssBaseline />
            <Navigation />
            <main className="pt-16 min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster />
          </GeistProvider>
        </Providers>
      </body>
    </html>
  );
}
