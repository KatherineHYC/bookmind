import "server-only";

import { createClient } from "@/lib/supabase/server";
import { rowToBookListItem } from "@/lib/book-mapper";
import type { BookListItem, BookRow, ReadingStatus } from "@/types/book";

// 取得目前使用者的書籍，最新加入的在前
export async function getBooksByStatus(
  status?: ReadingStatus,
): Promise<BookListItem[]> {
  const supabase = await createClient();

  const base = supabase.from("books").select("*");

  const filtered = status ? base.eq("status", status) : base;

  const { data, error } = await filtered
    .order("created_at", { ascending: false })
    .overrideTypes<BookRow[], { merge: false }>();

  if (error) {
    console.error("查詢書籍失敗：", error);
    return [];
  }

  return data.map(rowToBookListItem);
}

// 依 id 取單本書；找不到回 null
export async function getBookById(id: string): Promise<BookListItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .maybeSingle<BookRow>();

  if (error) {
    console.error("查詢書籍失敗：", error);
    return null;
  }

  return data ? rowToBookListItem(data) : null;
}

// 計算書籍數量；首頁統計卡用
export async function getBookCount(status?: ReadingStatus): Promise<number> {
  const supabase = await createClient();

  const base = supabase.from("books").select("*", {
    count: "exact",
    head: true,
  });

  const { count, error } = await (status ? base.eq("status", status) : base);

  if (error) {
    console.error("計算書籍數量失敗：", error);
    return 0;
  }

  return count ?? 0;
}
