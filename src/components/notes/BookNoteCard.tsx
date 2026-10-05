import NoteTypeBadge from "./NoteTypeBadge";
import { formatDate } from "@/lib/format-date";
import type { Note } from "@/types/note";

const NOTE_TEXT_CLASS = "whitespace-pre-line text-sm/7 wrap-break-word";

// 書籍詳情頁的筆記卡：顯示全文、不截斷
export default function BookNoteCard({ note }: { note: Note }) {
  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <NoteTypeBadge type={note.type} />

      {note.type === "excerpt" ? (
        <>
          <blockquote
            className={`mt-3 text-card-foreground ${NOTE_TEXT_CLASS}`}
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
        <p className={`mt-3 text-card-foreground ${NOTE_TEXT_CLASS}`}>
          {note.content}
        </p>
      )}

      <time
        dateTime={note.createdAt}
        className="mt-3 block text-xs text-muted-foreground"
      >
        {formatDate(note.createdAt)}
      </time>
    </article>
  );
}
