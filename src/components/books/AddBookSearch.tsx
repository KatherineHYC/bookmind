"use client";

import { useState } from "react";
import IsbnScanner from "./IsbnScanner";
import { searchBooks, searchByISBN } from "@/lib/google-books";
import { addBook } from "@/app/actions/books";
import type { Book } from "@/types/book";

type Mode = "idle" | "scanning";

export default function AddBookSearch() {
  const [mode, setMode] = useState<Mode>("idle");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  async function handleScanSuccess(isbn: string) {
    setMode("idle");
    setLoading(true);
    setError(null);
    try {
      const book = await searchByISBN(isbn);
      setResults(book ? [book] : []);
      if (!book) setError(`找不到 ISBN ${isbn} 對應的書籍`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "搜尋發生錯誤");
    } finally {
      setLoading(false);
    }
  }

  // 手動輸入關鍵字搜尋
  async function handleManualSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await searchBooks(query);
      setResults(result.books);
    } catch (err) {
      setError(err instanceof Error ? err.message : "搜尋發生錯誤");
    } finally {
      setLoading(false);
    }
  }

  // 點選搜尋結果，加入自己的書單
  async function handleAdd(book: Book) {
    setAddingId(book.googleBooksId);
    setError(null);
    const result = await addBook({
      googleBooksId: book.googleBooksId,
      title: book.title,
      authors: book.authors,
      coverUrl: book.coverUrl,
    });
    setAddingId(null);
    if (result?.error) {
      setError(result.error);
      return;
    }
    // 加入成功後從搜尋結果移除，避免重複加入
    setResults((prev) =>
      prev.filter((b) => b.googleBooksId !== book.googleBooksId),
    );
  }

  return (
    <div className="p-4">
      {mode === "scanning" ? (
        <IsbnScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setMode("idle")}
        />
      ) : (
        <form onSubmit={handleManualSearch} className="flex gap-2 mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="輸入書名或作者..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-primary text-white rounded-lg text-sm"
          >
            搜尋
          </button>
          <button
            type="button"
            onClick={() => setMode("scanning")}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            📷 掃描
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-gray-500">搜尋中...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="space-y-2">
        {results.map((book) => (
          <li
            key={book.isbn13 ?? book.googleBooksId}
            className="border rounded-lg p-3 text-sm flex items-center justify-between gap-2"
          >
            <div className="min-w-0">
              <p className="font-medium truncate">{book.title}</p>
              <p className="text-gray-500 text-xs truncate">
                {book.authors.join("、") || "作者不詳"}
              </p>
            </div>
            <button
              onClick={() => handleAdd(book)}
              disabled={addingId === book.googleBooksId}
              className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs shrink-0"
            >
              {addingId === book.googleBooksId ? "加入中..." : "+ 加入書單"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
