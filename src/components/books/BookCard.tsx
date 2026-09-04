import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { zhTW } from "date-fns/locale";
import StatusBadge from "./StatusBadge";
import BookCover from "./BookCover";
import type { BookListItem } from "@/types/book";

// 副資訊：想讀看加入多久，其餘看筆記進度
function getSubInfo(book: BookListItem): string {
  if (book.status === "want_to_read") {
    return `${formatDistanceToNow(new Date(book.createdAt), {
      addSuffix: true,
      locale: zhTW,
    })}加入`;
  }
  return book.noteCount > 0 ? `${book.noteCount} 則筆記` : "尚無筆記";
}

export default function BookCard({ book }: { book: BookListItem }) {
  return (
    <article className="relative rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-md">
      <Link href={`/books/${book.id}`} className="block">
        <BookCover coverUrl={book.coverUrl} title={book.title} />

        <h3 className="mt-3 line-clamp-2 min-h-10 text-sm/5 font-medium text-card-foreground">
          {book.title}
        </h3>

        <p className="mt-1 truncate text-xs text-muted-foreground">
          {book.authors.join("、") || "作者不詳"}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <StatusBadge status={book.status} />
          <span className="shrink-0 text-[0.6875rem] text-muted-foreground">
            {getSubInfo(book)}
          </span>
        </div>
      </Link>

    </article>
  );
}
