import { Bookmark, Library, Sprout, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsRowProps {
  bookCount: number;
  readingCount: number;
  noteCount: number;
}

interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: "sand" | "sage";
}

const TONE_CLASS: Record<StatItem["tone"], string> = {
  sand: "bg-accent text-accent-foreground",
  sage: "bg-secondary text-secondary-foreground",
};

// 首頁統計列
export default function StatsRow({
  bookCount,
  readingCount,
  noteCount,
}: StatsRowProps) {
  const items: StatItem[] = [
    { label: "全部書籍", value: bookCount, icon: Library, tone: "sand" },
    { label: "正在閱讀", value: readingCount, icon: Sprout, tone: "sage" },
    { label: "筆記數", value: noteCount, icon: Bookmark, tone: "sand" },
  ];

  return (
    <dl className="grid grid-cols-3 divide-x divide-border">
      {items.map(({ label, value, icon: Icon, tone }) => (
        <div
          key={label}
          className="flex items-center justify-center gap-2 px-1 md:gap-3"
        >
          <span
            aria-hidden
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full md:size-12",
              TONE_CLASS[tone],
            )}
          >
            <Icon className="size-5 md:size-6" strokeWidth={1.5} />
          </span>

          <div className="flex min-w-0 flex-col-reverse items-center">
            <dt className="text-xs whitespace-nowrap text-muted-foreground">
              {label}
            </dt>
            <dd className="text-2xl/tight font-semibold text-primary tabular-nums md:text-3xl/tight">
              {value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
