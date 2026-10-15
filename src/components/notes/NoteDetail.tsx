import NoteTypeBadge from "./NoteTypeBadge";
import { formatDate } from "@/lib/format-date";
import type { Note } from "@/types/note";

// 保留使用者輸入的換行；超長的英文單字或網址也會折行，不會撐破版面
const NOTE_TEXT_CLASS = "whitespace-pre-line wrap-break-word";

// 筆記詳情頁的內文：類型徽章、頁碼與日期、標題、摘錄／心得、我的感想
export default function NoteDetail({ note }: { note: Note }) {
  return (
    <article>
      <div className="flex items-center gap-3">
        <NoteTypeBadge type={note.type} />
        <p className="text-sm text-muted-foreground">
          {note.page !== null && <span>P. {note.page} · </span>}
          <time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>
        </p>
      </div>

      {note.title ? (
        <h1 className="mt-4 text-3xl/snug font-semibold wrap-break-word text-primary md:text-4xl/snug">
          {note.title}
        </h1>
      ) : (
        <h1 className="sr-only">
          {note.type === "excerpt" ? "摘錄筆記" : "心得筆記"}
        </h1>
      )}

      {note.type === "excerpt" ? (
        <>
          <blockquote
            className={`mt-6 border-l-4 border-primary pl-4 text-lg/9 text-foreground ${NOTE_TEXT_CLASS}`}
          >
            「{note.excerpt}」
          </blockquote>

          {note.content && (
            <section aria-labelledby="note-reflection-heading">
              <hr className="mt-8 border-border" />
              <h2
                id="note-reflection-heading"
                className="mt-6 text-base font-semibold text-foreground"
              >
                我的感想
              </h2>
              <p
                className={`mt-3 text-base/8 text-foreground ${NOTE_TEXT_CLASS}`}
              >
                {note.content}
              </p>
            </section>
          )}
        </>
      ) : (
        <p className={`mt-6 text-base/8 text-foreground ${NOTE_TEXT_CLASS}`}>
          {note.content}
        </p>
      )}
    </article>
  );
}
