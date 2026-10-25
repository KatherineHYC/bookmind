"use server";

import { getExportBooks } from "@/lib/queries/export";
import {
  buildExportFileName,
  buildExportMarkdown,
  countNotes,
} from "@/lib/export-markdown";

export type ExportDataResult =
  | {
      ok: true;
      fileName: string;
      content: string;
      bookCount: number;
      noteCount: number;
    }
  | { error: string };
// 把目前使用者的書與筆記整理成一份 Markdown，交給前端觸發下載
export async function exportData(): Promise<ExportDataResult> {
  const books = await getExportBooks();

  if (books === null) {
    return { error: "匯出失敗，請稍後再試" };
  }

  if (books.length === 0) {
    return { error: "還沒有書籍或筆記可以匯出" };
  }

  const now = new Date();

  return {
    ok: true,
    fileName: buildExportFileName(now),
    content: buildExportMarkdown(books, now),
    bookCount: books.length,
    noteCount: countNotes(books),
  };
}
