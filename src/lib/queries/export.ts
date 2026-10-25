import "server-only";

import { createClient } from "@/lib/supabase/server";
import { authorsFromDbString } from "@/lib/book-mapper";
import { rowToNote } from "@/lib/note-mapper";
import type { BookWithNotesRow, ExportBook } from "@/types/export";

// 一次撈出所有書與各自的筆記，書與筆記都由舊到新
export async function getExportBooks(): Promise<ExportBook[] | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("books")
    .select("*, notes(*)")
    .order("created_at", { ascending: true })
    .order("created_at", { referencedTable: "notes", ascending: true })
    .overrideTypes<BookWithNotesRow[], { merge: false }>();

  if (error) {
    console.error("查詢匯出資料失敗：", error);
    return null;
  }

  return data.map((row) => ({
    title: row.title,
    authors: authorsFromDbString(row.authors),
    status: row.status,
    publisher: row.publisher,
    publishedDate: row.published_date,
    createdAt: row.created_at,
    notes: row.notes.map(rowToNote),
  }));
}
