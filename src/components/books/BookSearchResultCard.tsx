import { Check } from "lucide-react";
import BookCover from "./BookCover";
import type { Book } from "@/types/book";

export const BOOK_SEARCH_LIST_CLASS = "grid gap-3 grid-cols-1 md:grid-cols-2";

interface BookSearchResultCardProps {
  book: Book;
  isAdded: boolean;
  onSelect: (book: Book) => void;
}

export default function BookSearchResultCard({
  book,
  isAdded,
  onSelect,
}: BookSearchResultCardProps) {
  const year = book.publishedDate.slice(0, 4);
  const meta = [book.publisher, year].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors outline-none hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <span className="w-16 shrink-0">
        <BookCover coverUrl={book.coverUrl} title={book.title} size="sm" />
      </span>

      {/* 按鈕裡面不能放 h3 這類區塊標題，所以改用 span 排版 */}
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-base/6 font-medium wrap-break-word text-card-foreground">
          {book.title}
        </span>
        <span className="mt-1 block truncate text-sm text-muted-foreground">
          {book.authors.join("、") || "作者不詳"}
        </span>
        {meta && (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {meta}
          </span>
        )}
      </span>

      {isAdded ? (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
          <Check className="size-3.5" aria-hidden />
          已加入
        </span>
      ) : (
        <span className="inline-flex h-9 shrink-0 items-center rounded-full bg-primary px-4 text-sm text-primary-foreground">
          加入
        </span>
      )}
    </button>
  );
}
