"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { authorsToDbString } from "@/lib/book-mapper";
import type { ReadingStatus } from "@/types/book";

const DASHBOARD_PATH = "/dashboard";

// 新增書籍的輸入格式驗證
const addBookSchema = z.object({
  googleBooksId: z.string().min(1),
  title: z.string().min(1),
  authors: z.array(z.string()),
  coverUrl: z.url().nullable(),
});

export type AddBookInput = z.infer<typeof addBookSchema>;

// 新增一本書到使用者書單
export async function addBook(input: AddBookInput) {
  const parsed = addBookSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "書籍資料格式不正確" };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "尚未登入，請重新整理頁面再試一次" };
  }

  const { error } = await supabase.from("books").insert({
    user_id: user.id,
    google_books_id: parsed.data.googleBooksId,
    title: parsed.data.title,
    authors: authorsToDbString(parsed.data.authors),
    cover_url: parsed.data.coverUrl,
  });

  if (error) {
    console.error("新增書籍失敗：", error);
    return { error: "新增書籍失敗，請稍後再試" };
  }

  revalidatePath(DASHBOARD_PATH);
  return { success: true };
}

// 從書單刪除一本書
export async function deleteBook(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("books").delete().eq("id", id);

  if (error) {
    console.error("刪除書籍失敗：", error);
    return { error: "刪除失敗，請稍後再試" };
  }

  revalidatePath(DASHBOARD_PATH);
  return { success: true };
}

// 切換閱讀狀態（想讀 / 正在讀 / 已讀）
export async function updateBookStatus(id: string, status: ReadingStatus) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("books")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("更新狀態失敗：", error);
    return { error: "更新失敗，請稍後再試" };
  }

  revalidatePath(DASHBOARD_PATH);
  return { success: true };
}
