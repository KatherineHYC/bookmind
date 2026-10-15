// 筆記型別：摘錄（書中原文）／心得（自己的想法）
export type NoteType = "excerpt" | "thought";

// Supabase notes 資料表的實際欄位（DB 原始格式）
export interface NoteRow {
  id: string;
  created_at: string;
  user_id: string;
  book_id: string;
  type: NoteType;
  title: string | null;
  page: number | null;
  excerpt: string | null;
  content: string | null;
  updated_at: string;
}

// 兩種筆記共有的欄位
interface NoteBase {
  id: string;
  bookId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

// 摘錄：一定有原文，頁碼、感想選填
export interface ExcerptNote extends NoteBase {
  type: "excerpt";
  page: number | null;
  excerpt: string;
  content: string | null;
}

// 心得：一定有內容，且不可能有原文與頁碼
export interface ThoughtNote extends NoteBase {
  type: "thought";
  page: null;
  excerpt: null;
  content: string;
}

// 應用層的筆記型別（對應 DB 的 CHECK 約束）
export type Note = ExcerptNote | ThoughtNote;

export interface NoteWithBookRow extends NoteRow {
  books: { title: string } | null;
}

export type NoteWithBook = Note & { bookTitle: string };

// 筆記詳情頁用：嵌入所屬書籍的書名與作者（DB 原始格式）
export interface NoteDetailRow extends NoteRow {
  books: { title: string; authors: string } | null;
}

// 筆記詳情頁用的型別：筆記 ＋「出自」那一行要顯示的書籍資訊
export type NoteDetail = Note & {
  bookTitle: string;
  bookAuthors: string[];
};
