import type { Book } from "@/types/book";

export interface BookSearchResult {
  books: Book[];
  totalItems: number;
}

// 搜尋書籍（關鍵字）
export async function searchBooks(
  query: string,
  maxResults: number = 10,
): Promise<BookSearchResult> {
  const params = new URLSearchParams({
    q: query,
    maxResults: String(maxResults),
  });

  const response = await fetch(`/api/books/search?${params}`);


  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? "搜尋失敗");
  }

  return response.json();
}

// 用 ISBN 搜尋（掃描條碼後使用）
export async function searchByISBN(isbn: string): Promise<Book | null> {
  const result = await searchBooks(`isbn:${isbn}`, 1);
  return result.books[0] ?? null;
}
