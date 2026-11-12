import Link from "next/link";
import StatusBadge from "./StatusBadge";
import BookCover from "./BookCover";
import type { BookListItem } from "@/types/book";

export default function BookCard({ book }: { book: BookListItem }) {
  return (
    <article className="relative h-full rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-md">
      <Link
        href={`/books/${book.id}`}
        className="flex h-full flex-col items-center text-center"
      >
        <BookCover coverUrl={book.coverUrl} title={book.title} />

        {/* 書名只顯示一行，完整書名在詳情頁 */}
        <h3 className="mt-3 w-full truncate text-sm/5 font-medium text-card-foreground">
          {book.title}
        </h3>

        <p className="mt-1 w-full truncate text-xs text-muted-foreground">
          {book.authors.join("、") || "作者不詳"}
        </p>

        <div className="mt-auto flex flex-col items-center gap-1.5 pt-2">
          <StatusBadge status={book.status} />
          {/* 固定高度：沒有筆記時保留空位，讓每張卡片等高 */}
          <p className="h-4 text-xs text-muted-foreground">
            {book.noteCount > 0 && `${book.noteCount} 則筆記`}
          </p>
        </div>
      </Link>
    </article>
  );
}
