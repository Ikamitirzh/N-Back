"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setupAxiosInterceptor, apiClient } = useAuth();

  useEffect(() => {
    // تنظیم interceptor هنگام بارگذاری برنامه
    setupAxiosInterceptor(apiClient);
  }, []);
  return (
    <html lang="fa" dir="rtl">

      <body
        
      >
        {children}
      </body>
    </html>
  );
}
