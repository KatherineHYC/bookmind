import Link from "next/link";
import NoteTypeBadge from "./NoteTypeBadge";
import NoteCardMenu from "./NoteCardMenu";
import { formatDate } from "@/lib/format-date";
import { noteDetailPath } from "@/lib/note-origin";
import type { Note } from "@/types/note";

const NOTE_TEXT_CLASS = "whitespace-pre-line text-sm/7 wrap-break-word";

// 書籍詳情頁的筆記卡：顯示全文、不截斷，整張可點進筆記詳情頁
export default function BookNoteCard({ note }: { note: Note }) {
  return (
    <article className="relative rounded-lg border border-border bg-card">
      <Link
        href={noteDetailPath(note.id, "book")}
        className="block rounded-lg p-4 transition-colors outline-none hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <NoteTypeBadge type={note.type} />

        {note.title && (
          <h3 className="mt-2 text-base font-semibold wrap-break-word text-foreground">
            {note.title}
          </h3>
        )}

        {note.type === "excerpt" ? (
          <>
            <blockquote
              className={`mt-2 text-card-foreground ${NOTE_TEXT_CLASS}`}
            >
              「{note.excerpt}」
            </blockquote>
            {note.content && (
              <p className={`mt-2 text-muted-foreground ${NOTE_TEXT_CLASS}`}>
                {note.content}
              </p>
            )}
          </>
        ) : (
          <p className={`mt-2 text-card-foreground ${NOTE_TEXT_CLASS}`}>
            {note.content}
          </p>
        )}

        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          {note.page !== null && (
            <>
              <span>p.{note.page}</span>
              <span aria-hidden>·</span>
            </>
          )}
          <time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>
        </p>
      </Link>
      <NoteCardMenu noteId={note.id} />
    </article>
  );
}
