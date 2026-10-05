import "client-only";

import { looksLikeIsbn, normalizeIsbn } from "@/lib/isbn";
import type { Book } from "@/types/book";

export interface BookSearchResult {
  books: Book[];
  totalItems: number;
}

// 實際打 API 的地方；q 是已經整理好的 Google Books 查詢字串
async function fetchBooks(
  q: string,
  maxResults: number,
): Promise<BookSearchResult> {
  const params = new URLSearchParams({
    q,
    maxResults: String(maxResults),
  });

  const response = await fetch(`/api/books/search?${params}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? "搜尋失敗");
  }

  return response.json();
}

// 搜尋書籍（關鍵字；輸入的是 ISBN 時自動改用 ISBN 查詢）
export async function searchBooks(
  keyword: string,
  maxResults: number = 10,
): Promise<BookSearchResult> {
  const q = looksLikeIsbn(keyword) ? `isbn:${normalizeIsbn(keyword)}` : keyword;

  return fetchBooks(q, maxResults);
}

// 用 ISBN 找一本書（掃描條碼後使用）；找不到回 null
export async function searchByISBN(isbn13: string): Promise<Book | null> {
  const { books } = await fetchBooks(`isbn:${isbn13}`, 1);
  const book = books[0];
  if (!book) return null;

  return { ...book, isbn13: book.isbn13 ?? isbn13 };
}
