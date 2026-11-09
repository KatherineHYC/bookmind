import SectionHeader from "./SectionHeader";
import SectionEmptyHint from "./SectionEmptyHint";
import ReadingBookItem from "./ReadingBookItem";
import type { BookListItem } from "@/types/book";

const READING_LIST_HREF = "/books?status=reading";

export default function ReadingSection({ books }: { books: BookListItem[] }) {
  const hasBooks = books.length > 0;

  return (
    <section aria-labelledby="home-reading-title">
      <SectionHeader
        title="正在閱讀"
        titleId="home-reading-title"
        href={hasBooks ? READING_LIST_HREF : undefined}
      />

      {hasBooks ? (
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book, index) => (
            // 第 4 筆只在平板兩欄時補滿 2×2，手機和桌機三欄都只顯示 3 筆
            <li
              key={book.id}
              className={index === 3 ? "hidden md:block lg:hidden" : undefined}
            >
              <ReadingBookItem book={book} />
            </li>
          ))}
        </ul>
      ) : (
        <SectionEmptyHint
          message="目前沒有正在閱讀的書"
          linkLabel="到藏書挑一本"
          href="/books"
        />
      )}
    </section>
  );
}
