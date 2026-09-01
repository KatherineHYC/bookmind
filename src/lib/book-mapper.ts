import type { BookListItem, BookRow } from "@/types/book";

const AUTHOR_SEPARATOR = "、";

export function rowToBookListItem(row: BookRow): BookListItem {
  return {
    id: row.id,
    googleBooksId: row.google_books_id,
    title: row.title,
    authors: row.authors ? row.authors.split(AUTHOR_SEPARATOR) : [],
    coverUrl: row.cover_url,
    status: row.status,
    createdAt: row.created_at,
    isbn13: row.isbn13,
  };
}

export function authorsToDbString(authors: string[]): string {
  return authors.join(AUTHOR_SEPARATOR);
}
