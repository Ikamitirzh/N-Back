// src/app/(user)/layout.jsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function UserLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={inter.className}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}