import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  rowToNote,
  rowToNoteDetail,
  rowToNoteWithBook,
} from "@/lib/note-mapper";
import { isUuid } from "@/lib/uuid";
import type {
  Note,
  NoteDetail,
  NoteDetailRow,
  NoteRow,
  NoteWithBook,
  NoteWithBookRow,
} from "@/types/note";

// 取得目前使用者的所有筆記（含所屬書名），最新的在前
export async function getNotes(): Promise<NoteWithBook[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .select("*, books(title)")
    .order("created_at", { ascending: false })
    .overrideTypes<NoteWithBookRow[], { merge: false }>();

  if (error) {
    console.error("查詢筆記失敗：", error);
    return [];
  }

  return data.map(rowToNoteWithBook);
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
