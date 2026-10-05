import BookCover from "./BookCover";
import AddBookButton from "./AddBookButton";
import type { Book } from "@/types/book";

// 結果列表的排版：手機單欄、平板以上雙欄（骨架屏共用同一組 class）
export const BOOK_SEARCH_LIST_CLASS = "grid gap-3 md:grid-cols-2";

interface BookSearchResultCardProps {
  book: Book;
  isAdded: boolean;
}

export default function BookSearchResultCard({
  book,
  isAdded,
}: BookSearchResultCardProps) {
  const year = book.publishedDate.slice(0, 4);
  const meta = [book.publisher, year].filter(Boolean).join(" · ");

  return (
    <article className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div className="w-16 shrink-0">
        <BookCover coverUrl={book.coverUrl} title={book.title} size="sm" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-base/6 font-medium wrap-break-word text-card-foreground">
          {book.title}
        </h3>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {book.authors.join("、") || "作者不詳"}
        </p>
        {meta && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {meta}
          </p>
        )}
      </div>

      {/* 右側操作區：加入 / 加入中 / 已加入 */}
      <AddBookButton book={book} isAdded={isAdded} />
    </article>
  );
}
