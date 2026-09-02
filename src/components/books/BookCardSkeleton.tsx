import { Skeleton } from "@/components/ui/skeleton";

// 單張書籍卡的骨架：封面 2:3、書名兩行、作者一行、狀態徽章
export default function BookCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <Skeleton className="aspect-2/3 w-full rounded-md" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-1.5 h-4 w-3/5" />
      <Skeleton className="mt-2 h-3 w-2/5" />
      <Skeleton className="mt-3 h-5 w-16 rounded-full" />
    </div>
  );
}

// grid 版：一次排 N 張，頁面直接用這個
export function BookGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}
