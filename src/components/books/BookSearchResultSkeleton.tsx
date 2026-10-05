import { Skeleton } from "@/components/ui/skeleton";
import { BOOK_SEARCH_LIST_CLASS } from "./BookSearchResultCard";

// 單張搜尋結果卡的骨架屏：對齊 BookSearchResultCard（左封面、右三行文字）
export default function BookSearchResultSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <Skeleton className="aspect-2/3 w-16 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function BookSearchResultListSkeleton({
  count = 3,
}: {
  count?: number;
}) {
  return (
    <div className={BOOK_SEARCH_LIST_CLASS}>
      {Array.from({ length: count }, (_, i) => (
        <BookSearchResultSkeleton key={i} />
      ))}
    </div>
  );
}
