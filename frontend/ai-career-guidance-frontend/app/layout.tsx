'use client';

import { GeistProvider, CssBaseline } from '@geist-ui/core';
import "./globals.css";
import { Providers } from "./providers";

// Import metadata from the separate file
export { metadata } from './metadata';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <GeistProvider>
          <CssBaseline />
          <Providers>
            {children}
          </Providers>
        </GeistProvider>
      </body>
    </html>
  );
}
