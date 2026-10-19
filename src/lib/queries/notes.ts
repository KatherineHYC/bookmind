import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  rowToNote,
  rowToNoteDetail,
  rowToNoteWithBook,
} from "@/lib/note-mapper";
import { isUuid } from "@/lib/uuid";
import { sanitizeKeyword } from "./sanitize-keyword";
import type {
  Note,
  NoteDetail,
  NoteDetailRow,
  NoteQuery,
  NoteRow,
  NoteSort,
  NoteWithBook,
  NoteWithBookRow,
} from "@/types/note";

const SORT_COLUMN: Record<NoteSort, { column: string; ascending: boolean }> = {
  updated: { column: "updated_at", ascending: false },
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
};

// 筆記主頁主查詢：類型 ＋ 關鍵字 ＋ 排序自由組合（含所屬書名）
export async function getNotes({
  type,
  keyword,
  sort = "updated",
}: NoteQuery = {}): Promise<NoteWithBook[]> {
  const supabase = await createClient();

  let query = supabase.from("notes").select("*, books(title)");

  if (type) query = query.eq("type", type);

  const safeKeyword = keyword ? sanitizeKeyword(keyword) : "";
  if (safeKeyword) {
    query = query.or(
      `title.ilike.%${safeKeyword}%,excerpt.ilike.%${safeKeyword}%,content.ilike.%${safeKeyword}%`,
    );
  }

  const { column, ascending } = SORT_COLUMN[sort];

  const { data, error } = await query
    .order(column, { ascending })
    .overrideTypes<NoteWithBookRow[], { merge: false }>();

  if (error) {
    console.error("查詢筆記失敗：", error);
    return [];
  }

  return data.map(rowToNoteWithBook);
}

// 目前使用者有沒有任何筆記（決定筆記主頁要不要顯示工具列與「還沒有任何筆記」）
export async function hasAnyNote(): Promise<boolean> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("notes")
    .select("id", { count: "exact", head: true })
    .limit(1);

  if (error) {
    console.error("查詢筆記數量失敗：", error);
    return true;
  }

  return (count ?? 0) > 0;
}

// 取得某一本書的所有筆記，最新的在前（書籍詳情頁用）
export async function getNotesByBookId(bookId: string): Promise<Note[]> {
  if (!isUuid(bookId)) return [];

  const supabase = await createClient();

  // 查詢只需要描述「我要哪本書的筆記」。這個查詢會用到 0001 建好的 notes_book_id_idx 索引。
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("book_id", bookId)
    .order("created_at", { ascending: false })
    .overrideTypes<NoteRow[], { merge: false }>();

  if (error) {
    console.error("查詢書籍筆記失敗：", error);
    return [];
  }

  return data.map(rowToNote);
}

// 依 id 取單則筆記（含所屬書名與作者）；找不到回 null（筆記詳情頁用）
export async function getNoteById(id: string): Promise<NoteDetail | null> {
  if (!isUuid(id)) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*, books(title, authors)")
    .eq("id", id)
    .maybeSingle<NoteDetailRow>();

  if (error) {
    console.error("查詢筆記失敗：", error);
    return null;
  }

  return data ? rowToNoteDetail(data) : null;
}
