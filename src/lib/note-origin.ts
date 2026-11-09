// 詳情頁「從哪裡進來」，用 ?from= 帶著，決定返回鍵與刪除後要回哪裡。
// 筆記：book（書籍詳情）、home（首頁），沒標記當作從 /notes 進來。
// 書籍：home（首頁），沒標記當作從 /books 進來。
export type NoteOrigin = "book" | "home";
export type BookOrigin = "home";

const NOTES_PATH = "/notes";
const LIBRARY_PATH = "/books";
const DASHBOARD_PATH = "/dashboard";

// 只認得固定值，其他一律當作沒有，所以有人把 from 改成 https://壞網站.com 也沒用（避免 open redirect）
export function parseNoteOrigin(value: unknown): NoteOrigin | null {
  return value === "book" || value === "home" ? value : null;
}

export function parseBookOrigin(value: unknown): BookOrigin | null {
  return value === "home" ? "home" : null;
}

function withOrigin(path: string, origin: string | null): string {
  return origin ? `${path}?from=${origin}` : path;
}

export function noteDetailPath(id: string, origin: NoteOrigin | null = null) {
  return withOrigin(`/notes/${id}`, origin);
}

export function noteEditPath(id: string, origin: NoteOrigin | null = null) {
  return withOrigin(`/notes/${id}/edit`, origin);
}

export function noteBackPath(origin: NoteOrigin | null, bookId: string) {
  if (origin === "book") return `/books/${bookId}`;
  if (origin === "home") return DASHBOARD_PATH;
  return NOTES_PATH;
}

export function bookDetailPath(id: string, origin: BookOrigin | null = null) {
  return withOrigin(`/books/${id}`, origin);
}

export function newNotePath(bookId: string, origin: BookOrigin | null = null) {
  return withOrigin(`/books/${bookId}/notes/new`, origin);
}

export function bookBackPath(origin: BookOrigin | null) {
  return origin === "home" ? DASHBOARD_PATH : LIBRARY_PATH;
}
