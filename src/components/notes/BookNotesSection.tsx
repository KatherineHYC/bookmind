import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/features/EmptyState";
import BookNoteCard from "./BookNoteCard";
import type { Note } from "@/types/note";

// 新增筆記頁的網址（頁面本身在筆記階段才會建立）
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
          actionLabel="記下第一個靈感"
          actionHref={newNoteHref}
        />
      ) : (
        <ul className="mt-3 grid gap-3 md:grid-cols-2 md:items-start">
          {notes.map((note) => (
            <li key={note.id}>
              <BookNoteCard note={note} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
