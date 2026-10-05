import { Skeleton } from "@/components/ui/skeleton";
import { BOOK_GRID_CLASS } from "./BookGrid";

// 單張書籍卡的骨架屏：對齊 BookCard 的置中版型（封面、書名、作者、狀態徽章）
export default function BookCardSkeleton() {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-card p-3">
      <Skeleton className="aspect-2/3 w-full rounded-md" />
      <Skeleton className="mt-3 h-4 w-4/5" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <Skeleton className="mt-3 h-5 w-14 rounded-full" />
    </div>
  );
}

export function BookGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className={BOOK_GRID_CLASS}>
      {Array.from({ length: count }, (_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}
