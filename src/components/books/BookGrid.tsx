import type { BookListItem } from "@/types/book";
import BookCard from "./BookCard";
import NewBookEntrance from "./NewBookEntrance";

export const BOOK_GRID_CLASS =
  "grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5";

interface BookGridProps {
  books: BookListItem[];
  addedId?: string | null;
}

export default function BookGrid({ books, addedId = null }: BookGridProps) {
  return (
    <div className={BOOK_GRID_CLASS}>
      {books.map((book) =>
        book.id === addedId ? (
          <NewBookEntrance key={book.id}>
            <BookCard book={book} />
          </NewBookEntrance>
        ) : (
          <BookCard key={book.id} book={book} />
        ),
      )}
    </div>
  );
}
