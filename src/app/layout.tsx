import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BookMind - 書籍學習筆記",
  description: "掃描 ISBN 或搜尋書籍，記錄摘錄與心得。無需帳號即可立即使用。",
  keywords: ["閱讀", "書單", "筆記", "ISBN", "學習"],
  manifest: "/manifest.json",
  themeColor: "#1e3a5f",
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
