import Link from "next/link";
import { CalendarDays } from "lucide-react";
import BookCover from "@/components/books/BookCover";
import { formatDate } from "@/lib/format-date";
import { noteDetailPath } from "@/lib/note-origin";
import type { NoteWithBookCover } from "@/types/note";

export default function RecentNoteItem({ note }: { note: NoteWithBookCover }) {
  const body = note.type === "excerpt" ? `「${note.excerpt}」` : note.content;

  return (
    <Link
      href={noteDetailPath(note.id)}
      className="flex items-start gap-4 rounded-lg p-2 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <div className="w-12 shrink-0">
        <BookCover
          coverUrl={note.bookCoverUrl}
          title={note.bookTitle}
          size="sm"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm/6 whitespace-pre-line wrap-break-word text-card-foreground">
          {body}
        </p>

        <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="min-w-0 truncate">{note.bookTitle}</span>
          <span className="h-3 w-px shrink-0 bg-border" aria-hidden />
          <CalendarDays className="size-3.5 shrink-0" aria-hidden />
          <time dateTime={note.createdAt} className="shrink-0">
            {formatDate(note.createdAt)}
          </time>
        </p>
      </div>
    </Link>
  );
}
