"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { authorsToDbString } from "@/lib/book-mapper";
import { isReadingStatus } from "@/lib/book-status";
import { isUuid } from "@/lib/uuid";
import type { ReadingStatus } from "@/types/book";

const LIBRARY_PATH = "/books";
const ADD_BOOK_PATH = "/books/new";
const NOTES_PATH = "/notes";

const UNIQUE_VIOLATION = "23505";

function bookDetailPath(id: string) {
  return `/books/${id}`;
}

// 新增書籍的輸入格式驗證
const addBookSchema = z.object({
  googleBooksId: z.string().min(1),
  title: z.string().min(1),
  authors: z.array(z.string()),
  coverUrl: z.url().nullable(),
  isbn13: z
    .string()
    .regex(/^\d{13}$/)
    .nullable(),
  publisher: z.string().nullable(),
  publishedDate: z.string().nullable(),
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
    return { error: "尚未登入，請重新整理頁面" };
  }

  const { error } = await supabase.from("books").insert({
    user_id: user.id,
    google_books_id: parsed.data.googleBooksId,
    title: parsed.data.title,
    authors: authorsToDbString(parsed.data.authors),
    cover_url: parsed.data.coverUrl,
    isbn13: parsed.data.isbn13,
    publisher: parsed.data.publisher,
    published_date: parsed.data.publishedDate,
  });

  if (error && error.code !== UNIQUE_VIOLATION) {
    console.error("新增書籍失敗：", error);
    return { error: "加入失敗，請稍後再試" };
  }

  revalidatePath(LIBRARY_PATH);
  revalidatePath(ADD_BOOK_PATH);
  return { success: true };
}

// 從書單刪除一本書；成功後直接導回藏書頁
export async function deleteBook(id: string) {
  if (!isUuid(id)) {
    return { error: "找不到這本書" };
  }

  const supabase = await createClient();

  // 筆記不用另外刪：notes.book_id 設了 on delete cascade，書一刪，資料庫會自動連筆記一起刪
  const { error } = await supabase.from("books").delete().eq("id", id);

  if (error) {
    console.error("刪除書籍失敗：", error);
    return { error: "刪除失敗，請稍後再試" };
  }

  revalidatePath(LIBRARY_PATH);
  revalidatePath(NOTES_PATH);

  // revalidatePath 會讓「使用者正在看的這一頁」（/books/[id]）跟著重新渲染，
  // 但書已經刪掉了 → 頁面會先閃一下「找不到這本書」，前端才來得及跳走。
  // 在這裡 redirect，伺服器這一趟回應就直接帶著 /books 的畫面回去，中間沒有空檔。
  // 也不能被包在 try/catch 裡（會被 catch 吃掉）。
  redirect(LIBRARY_PATH);
}

// 切換閱讀狀態（想讀 / 正在閱讀 / 已完成）
export async function updateBookStatus(id: string, status: ReadingStatus) {
  // 任何人都能繞過畫面直接送任意資料過來，所以進到伺服器的參數要在執行時再驗一次。
  if (!isUuid(id) || !isReadingStatus(status)) {
    return { error: "資料格式不正確" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("books")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("更新狀態失敗：", error);
    return { error: "更新失敗，請稍後再試" };
  }

  revalidatePath(LIBRARY_PATH);
  revalidatePath(bookDetailPath(id));
  return { success: true };
}
