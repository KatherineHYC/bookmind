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

        <h3 className="mt-3 line-clamp-2 text-sm/5 font-medium text-balance wrap-break-word text-card-foreground">
          {book.title}
        </h3>

        <p className="mt-1 w-full truncate text-xs text-muted-foreground">
          {book.authors.join("、") || "作者不詳"}
        </p>

        <div className="mt-auto pt-2">
          <StatusBadge status={book.status} />
        </div>
      </Link>
    </article>
  );
}
