import Link from "next/link";
import { BookOpen } from "lucide-react";
import NoteTypeBadge from "./NoteTypeBadge";
import { formatDate } from "@/lib/format-date";
import { noteDetailPath } from "@/lib/note-origin";
import type { NoteWithBook } from "@/types/note";

// 筆記主頁的列表卡：整張可點、內容截斷三行，底部標出出處
export default function NoteCard({ note }: { note: NoteWithBook }) {
  // 摘錄顯示原文（加「」），心得顯示內容；摘錄的感想留到詳情頁再看
  const body = note.type === "excerpt" ? `「${note.excerpt}」` : note.content;

  return (
    <Link
      href={noteDetailPath(note.id)}
      className="block h-full rounded-lg border border-border bg-card p-4 transition-colors outline-none hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <NoteTypeBadge type={note.type} />

      {note.title && (
        <h2 className="mt-2 line-clamp-2 text-base font-semibold wrap-break-word text-foreground">
          {note.title}
        </h2>
      )}

      <p className="mt-2 line-clamp-3 text-sm/6 whitespace-pre-line wrap-break-word text-card-foreground">
        {body}
      </p>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <BookOpen className="size-3.5 shrink-0" aria-hidden />
        <span className="min-w-0 truncate">{note.bookTitle}</span>
        {note.page !== null && (
          <span className="shrink-0">· p.{note.page}</span>
        )}
        <span className="shrink-0" aria-hidden>
          ·
        </span>
        <time dateTime={note.createdAt} className="shrink-0">
          {formatDate(note.createdAt)}
        </time>
      </p>
    </Link>
  );
}
