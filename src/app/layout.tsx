import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reading Tracker - 追蹤你的閱讀旅程",
  description: "個人閱讀追蹤與筆記管理工具，記錄每一本書、每一個想法。",
  keywords: ["閱讀", "書單", "筆記", "閱讀追蹤"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
