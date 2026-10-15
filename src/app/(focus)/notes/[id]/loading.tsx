import FocusPageHeader from "@/components/layouts/FocusPageHeader";
import Container from "@/components/layouts/Container";
import { Skeleton } from "@/components/ui/skeleton";

// 筆記詳情頁的載入畫面：版面對齊 page.tsx（徽章＋日期 → 標題 → 引言 → 內文 → 出自）
// loading.tsx 拿不到 searchParams，不知道使用者從哪裡來，返回鍵先指向 /notes
export default function NoteDetailLoading() {
  return (
    <>
      <FocusPageHeader backHref="/notes" />
      <Container className="pb-8 md:max-w-2xl lg:max-w-2xl">
        <div role="status" aria-label="筆記載入中">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>

          <Skeleton className="mt-5 h-9 w-3/4" />

          <div className="mt-6 space-y-3 border-l-4 border-muted pl-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>

          <div className="mt-8 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="mt-12 h-4 w-1/2" />
        </div>
      </Container>
    </>
  );
}
