import "server-only";

import { createClient } from "@/lib/supabase/server";
import { rowToNoteWithBook } from "@/lib/note-mapper";
import type { NoteWithBook, NoteWithBookRow } from "@/types/note";

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
