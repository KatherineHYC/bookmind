"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, PenLine, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "首頁", icon: Home },
  { href: "/books", label: "藏書", icon: Library },
  { href: "/notes", label: "筆記", icon: PenLine },
  { href: "/settings", label: "我的", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card">
      <ul className="mx-auto flex max-w-md">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined} // 給螢幕閱讀器的選中狀態
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs",
                  isActive
                    ? "font-medium text-primary"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2 : 1.5} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
