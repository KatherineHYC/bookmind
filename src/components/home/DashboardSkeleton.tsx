import { Skeleton } from "@/components/ui/skeleton";

function ItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-2">
      <Skeleton className="aspect-2/3 w-14 shrink-0 rounded-xs" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-2 h-3 w-1/2" />
        <Skeleton className="mt-3 h-3 w-16" />
      </div>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <ItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// 首頁內容的骨架：統計列 ＋ 兩個區塊
export default function DashboardSkeleton() {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex items-center justify-center gap-2">
            <Skeleton className="size-10 rounded-full md:size-12" />
            <div className="flex flex-col items-center gap-1.5">
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
}
