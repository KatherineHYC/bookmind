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

// 一次多拿幾筆候選資料，再從裡面挑最好的
const ISBN_CANDIDATES = 10;

// 幫候選資料打分數：資料越完整、越像台灣出版的繁中版，分數越高
// 同一個 ISBN 在 Google Books 常有好幾筆資料（不同來源上傳），第一筆不一定最完整
function scoreCandidate(book: Book, isbn13: string): number {
  let score = 0;

  // ISBN 完全一致最重要：Google 有時會把原文版、其他版本一起回傳
  if (book.isbn13 === isbn13) score += 10;
  if (book.authors.length > 0) score += 4;
  if (book.coverUrl) score += 4;
  // 繁中優先，其次是其他中文資料；英文與其他語言不加分
  if (book.language === "zh-TW") score += 3;
  else if (book.language.startsWith("zh")) score += 1;
  // 書名有中文字，通常就是我們要的中文版
  if (/\p{Script=Han}/u.test(book.title)) score += 2;
  if (book.publisher) score += 1;
  if (book.description) score += 1;

  return score;
}

// 用 ISBN 找一本書（掃描條碼後使用）；找不到回 null
export async function searchByISBN(isbn13: string): Promise<Book | null> {
  const { books } = await fetchBooks(`isbn:${isbn13}`, ISBN_CANDIDATES);
  if (books.length === 0) return null;

  // 分數最高的排第一；同分時保留 Google 原本的順序
  const [best] = books
    .map((book, index) => ({
      book,
      index,
      score: scoreCandidate(book, isbn13),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  return { ...best.book, isbn13: best.book.isbn13 ?? isbn13 };
}
