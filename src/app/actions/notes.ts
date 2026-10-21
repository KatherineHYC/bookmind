"use server";

import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { noteInputSchema, type NoteInput } from "@/lib/note-schema";
import {
  noteBackPath,
  noteDetailPath,
  parseNoteOrigin,
  type NoteOrigin,
} from "@/lib/note-origin";
import { isUuid } from "@/lib/uuid";
import type { NoteRow } from "@/types/note";

const NOTES_PATH = "/notes";
const DASHBOARD_PATH = "/dashboard";

function bookDetailPath(bookId: string) {
  return `/books/${bookId}`;
}

// 新增一則筆記；成功後回到該書的詳情頁
export async function createNote(bookId: string, input: NoteInput) {
  if (!isUuid(bookId)) {
    return { error: "找不到這本書" };
  }

  const parsed = noteInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "筆記內容格式不正確" };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "尚未登入，請重新整理頁面" };
  }

  const note = parsed.data;

  const { error } = await supabase.from("notes").insert({
    user_id: user.id,
    book_id: bookId,
    type: note.type,
    title: note.title,
    excerpt: note.type === "excerpt" ? note.excerpt : null,
    page: note.type === "excerpt" ? note.page : null,
    content: note.content,
  });

  if (error) {
    console.error("新增筆記失敗：", error);
    return { error: "儲存失敗，請稍後再試" };
  }

  revalidatePath(bookDetailPath(bookId));
  revalidatePath(NOTES_PATH);
  revalidatePath(DASHBOARD_PATH);

  redirect(bookDetailPath(bookId), RedirectType.replace);
}

// 更新一則筆記；成功後回到這則筆記的詳情頁
export async function updateNote(
  id: string,
  origin: NoteOrigin | null,
  input: NoteInput,
) {
  if (!isUuid(id)) {
    return { error: "找不到這則筆記" };
  }

  const parsed = noteInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "筆記內容格式不正確" };
  }

  const note = parsed.data;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .update({
      type: note.type,
      title: note.title,
      excerpt: note.type === "excerpt" ? note.excerpt : null,
      page: note.type === "excerpt" ? note.page : null,
      content: note.content,
    })
    .eq("id", id)
    .select("book_id")
    .maybeSingle<Pick<NoteRow, "book_id">>();

  if (error) {
    console.error("更新筆記失敗：", error);
    return { error: "儲存失敗，請稍後再試" };
  }

  if (!data) {
    return { error: "找不到這則筆記，可能已經被刪除了" };
  }

  const safeOrigin = parseNoteOrigin(origin);

  revalidatePath(NOTES_PATH);
  revalidatePath(noteDetailPath(id));
  revalidatePath(bookDetailPath(data.book_id));
  revalidatePath(DASHBOARD_PATH);

  // 編輯頁那筆瀏覽紀錄被詳情頁取代，按返回不會回到編輯頁
  redirect(noteDetailPath(id, safeOrigin), RedirectType.replace);
}

// 刪除的共同步驟：刪資料＋讓相關頁面重新抓資料。只回報結果，不負責跳頁
async function removeNote(
  id: string,
): Promise<{ error: string } | { bookId: string }> {
  if (!isUuid(id)) {
    return { error: "找不到這則筆記" };
  }

  const supabase = await createClient();

  // delete() 後面接 select("book_id")，刪除的同時把「被刪掉的那一列」的 book_id 回傳，一趟就拿到。
  const { data, error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .select("book_id")
    .maybeSingle<Pick<NoteRow, "book_id">>();

  if (error) {
    console.error("刪除筆記失敗：", error);
    return { error: "刪除失敗，請稍後再試" };
  }

  if (!data) {
    return { error: "找不到這則筆記，可能已經被刪除了" };
  }

  revalidatePath(NOTES_PATH);
  revalidatePath(bookDetailPath(data.book_id));
  revalidatePath(DASHBOARD_PATH);

  return { bookId: data.book_id };
}

// 筆記詳情頁用：刪除後離開，回到使用者進來詳情頁之前的地方
export async function deleteNote(id: string, origin: NoteOrigin | null) {
  const result = await removeNote(id);
  if ("error" in result) return result;

  redirect(
    noteBackPath(parseNoteOrigin(origin), result.bookId),
    RedirectType.replace,
  );
}

// 書籍詳情頁用：刪除後留在原頁面
export async function deleteNoteInPlace(id: string) {
  const result = await removeNote(id);
  if ("error" in result) return result;
}
