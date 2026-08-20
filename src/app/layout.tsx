import type { Metadata, Viewport } from "next";
import { Noto_Serif_TC, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-tc",
  display: "swap",
  preload: false,
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-tc",
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
  themeColor: "#2C4A3D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${notoSerifTC.variable} ${notoSansTC.variable}`}
    >
      <body className="antialiased">
        <main>{children}</main>
        <footer className="bg-primary text-white">
          <div className="max-w-3xl mx-auto px-4 py-4 text-center text-sm text-slate-200">
            <p>Copyright © 2026 Katherine Hsu</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
