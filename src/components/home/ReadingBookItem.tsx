import Link from "next/link";
import BookCover from "@/components/books/BookCover";
import type { BookListItem } from "@/types/book";

export default function ReadingBookItem({ book }: { book: BookListItem }) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="flex items-center gap-4 rounded-lg p-2 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <div className="w-16 shrink-0">
        <BookCover coverUrl={book.coverUrl} title={book.title} size="sm" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-base font-medium wrap-break-word text-card-foreground">
          {book.title}
        </h3>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {book.authors.join("、") || "作者不詳"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {book.noteCount > 0 ? `${book.noteCount} 則筆記` : "還沒有筆記"}
        </p>
      </div>
    </Link>
  );
}
