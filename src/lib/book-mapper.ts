import type {
  BookDetail,
  BookListItem,
  BookRowWithNoteCount,
} from "@/types/book";

const AUTHOR_SEPARATOR = "、";

// DB 存的是「、」串起來的字串 → 還原成陣列；筆記詳情頁的「出自」也會用到
export function authorsFromDbString(authors: string): string[] {
  return authors ? authors.split(AUTHOR_SEPARATOR) : [];
}

export function rowToBookListItem(row: BookRowWithNoteCount): BookListItem {
  return {
    id: row.id,
    googleBooksId: row.google_books_id,
    title: row.title,
    authors: authorsFromDbString(row.authors),
    coverUrl: row.cover_url,
    status: row.status,
    createdAt: row.created_at,
    isbn13: row.isbn13,
    noteCount: row.notes?.[0]?.count ?? 0,
  };
}

export function rowToBookDetail(row: BookRowWithNoteCount): BookDetail {
  return {
    ...rowToBookListItem(row),
    publisher: row.publisher,
    publishedDate: row.published_date,
  };
}

export function authorsToDbString(authors: string[]): string {
  return authors.join(AUTHOR_SEPARATOR);
}
