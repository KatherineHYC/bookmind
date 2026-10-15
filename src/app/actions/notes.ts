"use server";

import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { noteInputSchema, type NoteInput } from "@/lib/note-schema";
import {
  noteBackPath,
  parseNoteOrigin,
  type NoteOrigin,
} from "@/lib/note-origin";
import { isUuid } from "@/lib/uuid";
import type { NoteRow } from "@/types/note";

const NOTES_PATH = "/notes";

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

  redirect(bookDetailPath(bookId), RedirectType.replace);
}

// 刪除一則筆記；成功後回到使用者進來詳情頁之前的地方
export async function deleteNote(id: string, origin: NoteOrigin | null) {
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

  redirect(
    noteBackPath(parseNoteOrigin(origin), data.book_id),
    RedirectType.replace,
  );
}
