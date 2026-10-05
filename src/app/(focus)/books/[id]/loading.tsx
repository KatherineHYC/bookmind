import FocusPageHeader from "@/components/layouts/FocusPageHeader";
import Container from "@/components/layouts/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteListSkeleton } from "@/components/notes/NoteCardSkeleton";

// 書籍詳情頁的載入畫面：版面對齊 page.tsx（書名 → 封面＋資訊 → 筆記列表）
export default function BookDetailLoading() {
  return (
    <>
      <FocusPageHeader backHref="/books" />
      <Container className="pb-8">
        <div role="status" aria-label="書籍資料載入中">
          {/* 書名：-mt-2 是為了對齊正式頁面裡 h1 的位置 */}
          <Skeleton className="-mt-2 h-9 w-2/3" />

          <div className="mt-4 flex gap-4">
            <Skeleton className="aspect-2/3 w-28 shrink-0 rounded-md md:w-36" />
            <div className="flex-1 pt-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-3 h-4 w-24" />
              <Skeleton className="mt-3 h-4 w-12" />
              <Skeleton className="mt-5 h-9 w-28 rounded-full" />
            </div>
          </div>

          <Skeleton className="mt-8 mb-4 h-6 w-24" />
          <NoteListSkeleton count={2} />
        </div>
      </Container>
    </>
  );
}
