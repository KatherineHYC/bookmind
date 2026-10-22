import { Skeleton } from "@/components/ui/skeleton";

// 設定頁內容的骨架：個人資料卡 ＋ 支援清單 ＋ 天數卡
export default function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-2xl bg-card p-4">
        <Skeleton className="size-16 shrink-0 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-2 h-3 w-40" />
        </div>
      </div>
      <div>
        <Skeleton className="mb-2 h-4 w-20" />
        <div className="space-y-5 rounded-2xl bg-card p-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
