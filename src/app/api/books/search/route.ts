import { NextRequest, NextResponse } from "next/server";
import type { GoogleBookVolume, Book } from "@/types/book";

function normalizeCoverUrl(raw: string | undefined): string | null {
  if (!raw) return null;

  try {
    const url = new URL(raw);
    url.protocol = "https:";
    url.searchParams.delete("edge");
    return url.toString();
  } catch {
    return null;
  }
}

// Google 的簡介常夾帶 HTML 標籤（<br>、<p>、<b>），轉成純文字才能直接顯示
function toPlainText(html: string | undefined): string {
  if (!html) return "";

  return (
    html
      // 換行類的標籤先換成真正的換行
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      // 其他標籤全部拿掉
      .replace(/<[^>]+>/g, "")
      // 常見的 HTML 特殊字元還原
      .replace(/&nbsp;/g, " ")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      // 連續三個以上的換行縮成一個空行
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

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
  const coverUrl = normalizeCoverUrl(info.imageLinks?.thumbnail);

  return {
    googleBooksId: volume.id,
    title: info.title,
    authors: info.authors ?? [],
    description: toPlainText(info.description),
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

// 這些狀態碼代表「Google 那邊暫時出狀況」，等一下再試通常就會好
// 429 太多請求、500 伺服器錯誤、502/503/504 閘道或服務暫時不可用
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
// 最多重試 2 次（總共打 3 次），每次等久一點：400ms → 1200ms
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 400;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 呼叫 Google Books，遇到暫時性錯誤自動重試
// 400 這類「請求本身有問題」的錯誤重試也沒用，直接回傳交給外層處理
async function fetchWithRetry(url: string): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const isLastAttempt = attempt >= MAX_RETRIES;

    try {
      const response = await fetch(url, { next: { revalidate: 3600 } });

      if (
        response.ok ||
        !RETRYABLE_STATUS.has(response.status) ||
        isLastAttempt
      ) {
        return response;
      }

      console.warn(
        `Google Books 回傳 ${response.status}，第 ${attempt + 1} 次重試`,
      );
    } catch (error) {
      // 斷線、DNS 失敗這類網路錯誤也重試；最後一次就往外丟
      if (isLastAttempt) throw error;
      console.warn(`Google Books 連線失敗，第 ${attempt + 1} 次重試`);
    }

    await sleep(BASE_DELAY_MS * 3 ** attempt);
  }
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
    const response = await fetchWithRetry(url.toString());

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
