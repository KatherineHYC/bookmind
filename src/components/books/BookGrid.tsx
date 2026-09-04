import type { BookListItem } from "@/types/book";
import BookCard from "./BookCard";

export const BOOK_GRID_CLASS =
  "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4";

export default function BookGrid({ books }: { books: BookListItem[] }) {
  return (
    <div className={BOOK_GRID_CLASS}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
