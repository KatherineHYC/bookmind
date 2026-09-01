import type {
  Note,
  NoteRow,
  NoteWithBook,
  NoteWithBookRow,
} from "@/types/note";

export function rowToNote(row: NoteRow): Note {
  const base = {
    id: row.id,
    bookId: row.book_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (row.type === "excerpt") {
    if (row.excerpt === null) {
      throw new Error(`筆記 ${row.id} 型別為 excerpt 但缺少原文`);
    }
    return {
      ...base,
      type: "excerpt",
      excerpt: row.excerpt,
      content: row.content,
    };
  }

  // 走到這裡 row.type 只可能是 "thought"
  if (row.content === null) {
    throw new Error(`筆記 ${row.id} 型別為 thought 但缺少內容`);
  }
  return {
    ...base,
    type: "thought",
    excerpt: null,
    content: row.content,
  };
}

export function rowToNoteWithBook(row: NoteWithBookRow): NoteWithBook {
  return {
    ...rowToNote(row),
    bookTitle: row.books?.title ?? "未知書籍",
  };
}
