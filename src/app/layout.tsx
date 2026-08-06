import type { Metadata, Viewport } from "next";
import { Noto_Serif_TC } from "next/font/google";
import "./globals.css";


const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "BookMind - 書籍學習筆記",
  description: "掃描 ISBN 或搜尋書籍，記錄摘錄與心得。無需帳號即可立即使用。",
  keywords: ["閱讀", "書單", "筆記", "ISBN", "學習"],
  manifest: "/manifest.json",
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#414c3d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${notoSerifTC.variable} font-serif tracking-widest antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
