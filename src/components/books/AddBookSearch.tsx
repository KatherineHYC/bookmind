"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { RotateCw, ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/features/SearchBar";
import EmptyState from "@/components/features/EmptyState";
import BookSearchResultCard, {
  BOOK_SEARCH_LIST_CLASS,
} from "./BookSearchResultCard";
import { BookSearchResultListSkeleton } from "./BookSearchResultSkeleton";
import { searchBooks } from "@/lib/google-books";
import type { Book } from "@/types/book";

const IsbnScanOverlay = dynamic(() => import("./IsbnScanOverlay"), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-label="相機啟動中"
      className="fixed inset-0 z-50 bg-black"
    />
  ),
});

type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; books: Book[] }
  | { status: "error"; keyword: string };

interface AddBookSearchProps {
  addedGoogleBookIds: string[];
}

export default function AddBookSearch({
  addedGoogleBookIds,
}: AddBookSearchProps) {
  const [state, setState] = useState<SearchState>({ status: "idle" });
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const addedIds = useMemo(
    () => new Set(addedGoogleBookIds),
    [addedGoogleBookIds],
  );

  const latestRequestRef = useRef(0);

  const searchInputRef = useRef<HTMLInputElement>(null);

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
      setState({ status: "error", keyword });
    }
  }

  function handleManualEntry() {
    searchInputRef.current?.focus();
    setIsScannerOpen(false);
  }

  return (
    <>
      {/* 搜尋列：左邊搜尋框、右邊掃描按鈕 */}
      <div className="mb-4 flex items-center gap-3">
        <SearchBar
          onSubmit={handleSearch}
          inputRef={searchInputRef}
          className="min-w-0 flex-1"
        />
        <Button
          size="icon"
          onClick={() => setIsScannerOpen(true)}
          aria-label="掃描書籍條碼"
          className="size-11 rounded-full"
        >
          <ScanBarcode className="size-5" aria-hidden />
        </Button>
      </div>

      <section aria-label="搜尋結果" aria-busy={state.status === "loading"}>
        <SearchResults
          state={state}
          addedIds={addedIds}
          onRetry={handleSearch}
        />
      </section>

      {isScannerOpen && (
        <IsbnScanOverlay
          addedIds={addedIds}
          onClose={() => setIsScannerOpen(false)}
          onManualEntry={handleManualEntry}
        />
      )}
    </>
  );
}

interface SearchResultsProps {
  state: SearchState;
  addedIds: ReadonlySet<string>;
  onRetry: (keyword: string) => void;
}

function SearchResults({ state, addedIds, onRetry }: SearchResultsProps) {
  switch (state.status) {
    case "idle":
      return <EmptyState title="輸入書名或掃描書背條碼開始" />;

    case "loading":
      return <BookSearchResultListSkeleton />;

    case "error":
      return (
        <EmptyState
          title="暫時無法搜尋"
          description="請確認網路連線後再試一次。"
          actionLabel="重新搜尋"
          actionVariant="outline"
          actionIcon={<RotateCw aria-hidden />}
          onAction={() => onRetry(state.keyword)}
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
              <BookSearchResultCard
                book={book}
                isAdded={addedIds.has(book.googleBooksId)}
              />
            </li>
          ))}
        </ul>
      );
  }
}
