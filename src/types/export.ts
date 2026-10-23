import type { BookRow, ReadingStatus } from "./book";
import type { Note, NoteRow } from "./note";

// 匯出用：一本書 ＋ 它底下所有筆記（DB 原始格式）
export interface BookWithNotesRow extends BookRow {
  notes: NoteRow[];
}

// 匯出用：轉成 Markdown 前整理好的一本書
export interface ExportBook {
  title: string;
  authors: string[];
  status: ReadingStatus;
  publisher: string | null;
  publishedDate: string | null;
  createdAt: string;
  notes: Note[];
}
