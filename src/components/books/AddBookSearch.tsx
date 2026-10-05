"use client";

import { useRef, useState } from "react";
import SearchBar from "@/components/features/SearchBar";
import EmptyState from "@/components/features/EmptyState";
import BookSearchResultCard, {
  BOOK_SEARCH_LIST_CLASS,
} from "./BookSearchResultCard";
import { BookSearchResultListSkeleton } from "./BookSearchResultSkeleton";
import { searchBooks } from "@/lib/google-books";
import type { Book } from "@/types/book";

type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; books: Book[] }
  | { status: "error" };

export default function AddBookSearch() {
  const [state, setState] = useState<SearchState>({ status: "idle" });

  const latestRequestRef = useRef(0);

  async function handleSearch(keyword: string) {
    const requestId = ++latestRequestRef.current;

    if (!keyword) {
      setState({ status: "idle" });
      return;
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setState({ status: "loading" });

    try {
      const { books } = await searchBooks(keyword);
      if (requestId !== latestRequestRef.current) return;
      setState({ status: "success", books });
    } catch {
      if (requestId !== latestRequestRef.current) return;
      setState({ status: "error" });
    }
  }

  return (
    <>
      {/* 搜尋列（D5 的掃描按鈕會放在這一排右側） */}
      <div className="mb-4 flex items-center gap-3">
        <SearchBar onSubmit={handleSearch} className="min-w-0 flex-1" />
      </div>

      <section aria-label="搜尋結果" aria-busy={state.status === "loading"}>
        <SearchResults state={state} />
      </section>
    </>
  );
}

function SearchResults({ state }: { state: SearchState }) {
  switch (state.status) {
    case "idle":
      return <EmptyState title="輸入書名或掃描書背條碼開始" />;

    case "loading":
      return <BookSearchResultListSkeleton />;

    case "error":
      // 先放最基本的提示，正式版（插圖 + 重新搜尋按鈕）在 D6
      return (
        <EmptyState
          title="暫時無法搜尋"
          description="請確認網路連線後再試一次。"
        />
      );

    case "success":
      if (state.books.length === 0) {
        return (
          <EmptyState
            title="找不到相關書籍"
            description="試試其他關鍵字，或改用條碼掃描。"
          />
        );
      }

      return (
        <ul className={BOOK_SEARCH_LIST_CLASS}>
          {state.books.map((book) => (
            <li key={book.googleBooksId}>
              <BookSearchResultCard book={book} />
            </li>
          ))}
        </ul>
      );
  }
}
