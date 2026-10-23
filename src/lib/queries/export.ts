import "server-only";

import { createClient } from "@/lib/supabase/server";
import { authorsFromDbString } from "@/lib/book-mapper";
import { rowToNote } from "@/lib/note-mapper";
import type { BookWithNotesRow, ExportBook } from "@/types/export";

// 一次撈出所有書與各自的筆記，書與筆記都由舊到新（讀起來像一本閱讀日記）
// 失敗回 null，和「真的沒有資料」的 [] 分開，呼叫端才分得出要顯示哪種訊息
export async function getExportBooks(): Promise<ExportBook[] | null> {
  const supabase = await createClient();

  // 不用先查書、再一本一本查筆記（那樣 12 本書就要打 13 次資料庫）。
  // 第二個 .order() 加了 referencedTable，排的是「每本書底下的筆記」，不是書本身。
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
