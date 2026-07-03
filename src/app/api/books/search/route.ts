import { NextRequest, NextResponse } from "next/server";
import type { GoogleBookVolume, Book } from "@/types/book";

// 將 Google 原始資料轉換成 BookMind 內部格式
function transformBook(volume: GoogleBookVolume): Book {
  const info = volume.volumeInfo;

  const isbn13 =
    info.industryIdentifiers?.find((isbn) => isbn.type === "ISBN_13")
      ?.identifier ?? null;

  const isbn10 =
    info.industryIdentifiers?.find((isbn) => isbn.type === "ISBN_10")
      ?.identifier ?? null;

  // 書籍封面縮圖
  const rawCover = info.imageLinks?.thumbnail ?? null;
  const coverUrl = rawCover ? rawCover.replace("http://", "https://") : null;

  return {
    googleBooksId: volume.id,
    title: info.title,
    authors: info.authors ?? [],
    description: info.description ?? "",
    publisher: info.publisher ?? "",
    publishedDate: info.publishedDate ?? "",
    pageCount: info.pageCount ?? null,
    coverUrl,
    isbn13,
    isbn10,
    language: info.language ?? "unknown",
    categories: info.categories ?? [],
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const maxResults = searchParams.get("maxResults") ?? "10";

  if (!query || query.trim() === "") {
    return NextResponse.json({ error: "請提供搜尋關鍵字" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  const url = new URL("https://www.googleapis.com/books/v1/volumes");

  url.searchParams.set("q", query.trim());
  url.searchParams.set("maxResults", maxResults);
  url.searchParams.set("printType", "books");
  if (apiKey) {
    url.searchParams.set("key", apiKey);
  }

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Google Books API 錯誤：${response.status}`);
    }

    const data = await response.json();

    const books: Book[] = (data.items ?? []).map(transformBook);

    return NextResponse.json({
      books,
      totalItems: data.totalItems ?? 0,
    });
  } catch (error) {
    console.error("Google Books API 呼叫失敗：", error);
    return NextResponse.json(
      { error: "書籍搜尋失敗，請稍後再試" },
      { status: 500 },
    );
  }
}
