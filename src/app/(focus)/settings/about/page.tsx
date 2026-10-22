import type { Metadata } from "next";
import Image from "next/image";
import { BookMarked, ExternalLink, User } from "lucide-react";
import GithubIcon from "@/components/features/GithubIcon";
import FocusPageHeader from "@/components/layouts/FocusPageHeader";
import Container from "@/components/layouts/Container";
import { APP_VERSION, AUTHOR_URL, GITHUB_REPO_URL } from "@/lib/app-info";
import spotAbout from "@/assets/illustrations/spot-about.webp";

export const metadata: Metadata = { title: "關於 BookMind" };

const EXTERNAL_LINKS = [
  { href: GITHUB_REPO_URL, label: "GitHub 原始碼", icon: GithubIcon },
  { href: AUTHOR_URL, label: "作者", icon: User },
];

export default function AboutPage() {
  return (
    <>
      <FocusPageHeader backHref="/settings" />
      <Container className="pb-12 md:max-w-lg lg:max-w-lg">
        <div className="text-center">
          <BookMarked
            className="mx-auto size-12 text-primary"
            strokeWidth={1.5}
            aria-hidden
          />
          <h1 className="mt-2 text-4xl font-semibold text-primary">BookMind</h1>
          <p className="mt-2 text-sm text-foreground">
            翻過的每一頁，都值得被記住。
          </p>
          <Image
            src={spotAbout}
            alt=""
            sizes="224px"
            className="mx-auto mt-6 h-auto w-56"
          />
        </div>

        <p className="mt-6 font-sans text-sm/relaxed text-foreground">
          BookMind 為喜歡紙本書的你而設計。掃描 ISBN
          或搜尋書名，就能把書加進書架；讀到觸動你的句子時，隨手記下摘錄與心得。書會翻過去，但那些讓你停下來的句子，可以一直留在身邊。
        </p>

        <p className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          v{APP_VERSION}
        </p>

        <ul className="mt-4 space-y-3">
          {EXTERNAL_LINKS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl bg-card px-4 py-4 shadow-xs transition-colors hover:bg-muted/50"
              >
                <Icon className="size-5 shrink-0" aria-hidden />
                <span className="flex-1 text-sm">{label}</span>
                <ExternalLink
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <span className="sr-only">（在新分頁開啟）</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
