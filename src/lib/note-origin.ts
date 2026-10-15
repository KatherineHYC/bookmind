// 筆記詳情頁「從哪裡進來」：目前只有書籍詳情頁需要特別標記，沒標記就當作從 /notes 進來
export type NoteOrigin = "book";

const NOTES_PATH = "/notes";

export function parseNoteOrigin(value: unknown): NoteOrigin | null {
  return value === "book" ? "book" : null;
}

function withOrigin(path: string, origin: NoteOrigin | null): string {
  return origin ? `${path}?from=${origin}` : path;
}

export function noteDetailPath(id: string, origin: NoteOrigin | null = null) {
  return withOrigin(`/notes/${id}`, origin);
}

export function noteEditPath(id: string, origin: NoteOrigin | null = null) {
  return withOrigin(`/notes/${id}/edit`, origin);
}

// 所以有人把 from 改成 https://壞網站.com 也沒用（避免 open redirect）。
export function noteBackPath(origin: NoteOrigin | null, bookId: string) {
  return origin === "book" ? `/books/${bookId}` : NOTES_PATH;
}
