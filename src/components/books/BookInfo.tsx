import BookCover from "./BookCover";
import BookStatusSelect from "./BookStatusSelect";
import type { BookDetail } from "@/types/book";

// 書籍資訊區：封面在左，右側依序為作者、出版社、出版年、閱讀狀態
export default function BookInfo({ book }: { book: BookDetail }) {
  // 出版日期可能是 "2019"、"2019-06"、"2019-06-01"，畫面只顯示年份
  const publishedYear = book.publishedDate?.slice(0, 4);

  return (
    <section aria-label="書籍資訊" className="flex gap-4">
      <div className="w-28 shrink-0 md:w-36">
        <BookCover coverUrl={book.coverUrl} title={book.title} />
      </div>

      <div className="min-w-0 flex-1 pt-1">
        <p className="text-sm/6 wrap-break-word text-foreground">
          {book.authors.join("、") || "作者不詳"}
        </p>
        {book.publisher && (
          <p className="mt-1 text-sm/6 wrap-break-word text-muted-foreground">
            {book.publisher}
          </p>
        )}
        {publishedYear && (
          <p className="mt-1 text-sm/6 text-muted-foreground">
            {publishedYear}
          </p>
        )}

        <div className="mt-4">
          <BookStatusSelect bookId={book.id} status={book.status} />
        </div>
      </div>
    </section>
  );
}
