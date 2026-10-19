import Container from "@/components/layouts/Container";
import { Skeleton } from "@/components/ui/skeleton";

// 編輯筆記頁的載入畫面：版面對齊 NoteForm（頁首 → 類型切換 → 頁碼 → 標題 → 內容）
export default function EditNoteLoading() {
  return (
    <div
      role="status"
      aria-label="筆記載入中"
      className="pt-[calc(env(safe-area-inset-top)+0.5rem)]"
    >
      <Container className="md:max-w-2xl lg:max-w-2xl">
        <div className="flex h-11 items-center gap-3">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-5 w-24" />
        </div>

        <Skeleton className="mt-4 h-12 w-full rounded-full" />
        <Skeleton className="mt-8 h-5 w-1/3" />
        <Skeleton className="mt-8 h-8 w-2/3" />

        <div className="mt-8 space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </Container>
    </div>
  );
}
