"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ENTRANCE_DURATION_MS = 500;

// 剛新增的書卡外層：播一次進場動畫，播完把網址上的 ?added= 拿掉，重新整理就不會再播
export default function NewBookEntrance({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has("added")) return;
    params.delete("added");
    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    // 要等動畫播完才清：清掉後頁面重新渲染，這層會消失，太早清動畫會被切斷
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timer = window.setTimeout(
      () => router.replace(href, { scroll: false }),
      reduceMotion ? 0 : ENTRANCE_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [pathname, router, searchParams]);

  return (
    <div className="h-full animate-in duration-500 ease-out fade-in fill-mode-both slide-in-from-bottom-2 motion-reduce:animate-none">
      {children}
    </div>
  );
}
