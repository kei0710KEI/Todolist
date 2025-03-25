import Header from '@/components/Header';
import './globals.css';
import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'ToDo App',
  description: 'Next.js + Firebase + Tailwind + TypeScript',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <Header />
      <body className="bg-gray-50 text-gray-800 font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
