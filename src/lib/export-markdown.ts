import { STATUS_CONFIG } from "@/lib/book-status";
import { formatDate } from "@/lib/format-date";
import type { ExportBook } from "@/types/export";
import type { Note, NoteType } from "@/types/note";

const NOTE_TYPE_LABEL: Record<NoteType, string> = {
  excerpt: "摘錄",
  thought: "心得",
};

const fileDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Taipei",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function buildExportFileName(now: Date): string {
  return `bookmind-${fileDateFormatter.format(now)}.md`;
}

export function countNotes(books: ExportBook[]): number {
  return books.reduce((sum, book) => sum + book.notes.length, 0);
}

// 每一行前面加「> 」變成引用區塊；空行也要留「>」，引用才不會在中間斷掉
function toBlockquote(text: string): string {
  return text
    .split("\n")
    .map((line) => (line.trim() ? `> ${line}` : ">"))
    .join("\n");
}

function joinPresent(parts: Array<string | null>, separator: string): string {
  return parts.filter((part) => part !== null).join(separator);
}

function noteToMarkdown(note: Note): string {
  const typeLabel = NOTE_TYPE_LABEL[note.type];

  // 有標題就用標題當小標，類型移到下面那行；沒標題就直接用「摘錄／心得」當小標
  const heading = note.title ?? typeLabel;
  const meta = joinPresent(
    [
      note.title ? typeLabel : null,
      note.page !== null ? `第 ${note.page} 頁` : null,
      formatDate(note.createdAt),
    ],
    " · ",
  );

  const parts = [`### ${heading}`, `*${meta}*`];
  if (note.type === "excerpt") parts.push(toBlockquote(note.excerpt));
  if (note.content) parts.push(note.content);

  return parts.join("\n\n");
}

function bookToMarkdown(book: ExportBook): string {
  const publishing = joinPresent(
    [
      book.publisher,
      book.publishedDate ? book.publishedDate.slice(0, 4) : null,
    ],
    "・",
  );

  const info = joinPresent(
    [
      book.authors.length > 0 ? `作者：${book.authors.join("、")}` : null,
      publishing ? `出版：${publishing}` : null,
      `閱讀狀態：${STATUS_CONFIG[book.status].label}`,
      `加入日期：${formatDate(book.createdAt)}`,
    ].map((line) => (line ? `- ${line}` : null)),
    "\n",
  );

  const notes =
    book.notes.length > 0
      ? book.notes.map(noteToMarkdown).join("\n\n")
      : "*還沒有筆記*";

  return [`## 《${book.title}》`, info, notes].join("\n\n");
}

// 整份匯出檔：開頭摘要 ＋ 每本書一段，書與書之間用分隔線隔開
export function buildExportMarkdown(books: ExportBook[], now: Date): string {
  const summary = `匯出日期：${formatDate(now.toISOString())}・共 ${books.length} 本書、${countNotes(books)} 則筆記`;
  const header = ["# BookMind 閱讀筆記", summary].join("\n\n");

  return [header, ...books.map(bookToMarkdown)].join("\n\n---\n\n") + "\n";
}
