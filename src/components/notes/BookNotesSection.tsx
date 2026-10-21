import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/features/EmptyState";
import BookNoteCard from "./BookNoteCard";
import SwipeGroup from "./SwipeGroup";
import SwipeableNoteCard from "./SwipeableNoteCard";
import type { Note } from "@/types/note";
import spotOpenBook from "@/assets/illustrations/spot-open-book.webp";

// 新增筆記頁的網址
function newNotePath(bookId: string) {
  return `/books/${bookId}/notes/new`;
}

interface BookNotesSectionProps {
  bookId: string;
  notes: Note[];
}

// 書籍詳情頁的「我的筆記」區塊：標題列 ＋ 筆記列表（或空狀態）
export default function BookNotesSection({
  bookId,
  notes,
}: BookNotesSectionProps) {
  const newNoteHref = newNotePath(bookId);

  return (
    <section aria-labelledby="book-notes-heading" className="mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h2
            id="book-notes-heading"
            className="text-lg font-semibold text-foreground"
          >
            我的筆記
          </h2>
          <span className="text-sm text-muted-foreground">
            共 {notes.length} 則
          </span>
        </div>

        <Button
          render={<Link href={newNoteHref} />}
          nativeButton={false}
          variant="ghost"
          className="-mr-3 h-11 text-primary"
        >
          <Plus aria-hidden />
          新增筆記
        </Button>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          title="還沒有這本書的筆記"
          illustration={spotOpenBook}
          actionLabel="記下第一個靈感"
          actionHref={newNoteHref}
        />
      ) : (
        <>
          {/* 只在觸控裝置顯示：有滑鼠的裝置用三點選單，不需要這行提示 */}
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground pointer-fine:hidden">
            <ArrowLeft className="size-3.5" aria-hidden />
            左滑筆記可編輯或刪除
          </p>

          <SwipeGroup>
            <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 md:items-start">
              {notes.map((note) => (
                <li key={note.id}>
                  {/* 卡片內容（BookNoteCard）仍是 Server Component，只有外框負責手勢 */}
                  <SwipeableNoteCard noteId={note.id}>
                    <BookNoteCard note={note} />
                  </SwipeableNoteCard>
                </li>
              ))}
            </ul>
          </SwipeGroup>
        </>
      )}
    </section>
  );
}
