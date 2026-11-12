import Link from "next/link";
import NoteTypeBadge from "./NoteTypeBadge";
import NoteCardMenu from "./NoteCardMenu";
import { formatDate } from "@/lib/format-date";
import { noteDetailPath } from "@/lib/note-origin";
import type { Note } from "@/types/note";

const NOTE_TEXT_CLASS = "whitespace-pre-line text-sm/7 wrap-break-word";

// 預覽時把連續空行合併，避免空行佔掉行數額度
function compactLines(text: string) {
  return text.replace(/\n{2,}/g, "\n");
}

// 書籍詳情頁的筆記卡：限制行數的預覽，桌機版固定最小高度讓卡片等大，整張可點進筆記詳情頁
export default function BookNoteCard({ note }: { note: Note }) {
  return (
    <article className="relative h-full rounded-lg border border-border bg-card md:min-h-72">
      <Link
        href={noteDetailPath(note.id, "book")}
        className="flex h-full flex-col rounded-lg p-4 transition-colors outline-none hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <div>
          <NoteTypeBadge type={note.type} />

          {note.title && (
            <h3 className="mt-2 line-clamp-1 text-base font-semibold wrap-break-word text-foreground">
              {note.title}
            </h3>
          )}

          {note.type === "excerpt" ? (
            <>
              <blockquote
                className={`mt-2 line-clamp-4 text-card-foreground ${NOTE_TEXT_CLASS}`}
              >
                「{compactLines(note.excerpt ?? "")}」
              </blockquote>
              {note.content && (
                <p
                  className={`mt-2 line-clamp-2 text-muted-foreground ${NOTE_TEXT_CLASS}`}
                >
                  {compactLines(note.content)}
                </p>
              )}
            </>
          ) : (
            <p
              className={`mt-2 line-clamp-6 text-card-foreground ${NOTE_TEXT_CLASS}`}
            >
              {compactLines(note.content ?? "")}
            </p>
          )}
        </div>

        <p className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-muted-foreground">
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
