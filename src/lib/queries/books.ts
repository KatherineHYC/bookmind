import "server-only";

import { createClient } from "@/lib/supabase/server";
import { rowToBookListItem } from "@/lib/book-mapper";
import type {
  BookListItem,
  BookQuery,
  BookRowWithNoteCount,
  BookSort,
  ReadingStatus,
} from "@/types/book";

const SELECT_WITH_NOTE_COUNT = "*, notes(count)";

const SORT_COLUMN: Record<BookSort, { column: string; ascending: boolean }> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  title: { column: "title", ascending: true },
};

function sanitizeKeyword(keyword: string): string {
  return keyword.replace(/[,%_()]/g, " ").trim();
}

// 藏書頁主查詢：狀態 ＋ 關鍵字 ＋ 排序自由組合
export async function getBooks({
  status,
  keyword,
  sort = "newest",
}: BookQuery = {}): Promise<BookListItem[]> {
  const supabase = await createClient();

  let query = supabase.from("books").select(SELECT_WITH_NOTE_COUNT);

  if (status) query = query.eq("status", status);

  const safeKeyword = keyword ? sanitizeKeyword(keyword) : "";
  if (safeKeyword) {
    query = query.or(
      `title.ilike.%${safeKeyword}%,authors.ilike.%${safeKeyword}%,isbn13.ilike.%${safeKeyword}%`,
    );
  }

  const { column, ascending } = SORT_COLUMN[sort];

  const { data, error } = await query
    .order(column, { ascending })
    .overrideTypes<BookRowWithNoteCount[], { merge: false }>();

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
    .select(SELECT_WITH_NOTE_COUNT) // 詳情頁也要顯示筆記數
    .eq("id", id)
    .maybeSingle<BookRowWithNoteCount>();

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
