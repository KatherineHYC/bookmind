import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  titleId: string;
  href?: string;
}

// 首頁區塊標題：左邊標題、右邊「查看全部 ›」
export default function SectionHeader({
  title,
  titleId,
  href,
}: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 id={titleId} className="text-lg font-semibold text-foreground">
        {title}
      </h2>

      {href && (
        <Link
          href={href}
          className="-mr-2 flex items-center gap-0.5 rounded-md px-2 py-1 text-sm text-primary transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          查看全部
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
