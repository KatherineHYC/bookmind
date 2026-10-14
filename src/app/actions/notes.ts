"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { noteInputSchema, type NoteInput } from "@/lib/note-schema";
import { isUuid } from "@/lib/uuid";

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

  redirect(bookDetailPath(bookId));
}
