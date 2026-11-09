import { notFound } from "next/navigation";
import FocusPageHeader from "@/components/layouts/FocusPageHeader";
import Container from "@/components/layouts/Container";
import BookInfo from "@/components/books/BookInfo";
import DeleteBookButton from "@/components/books/DeleteBookButton";
import BookNotesSection from "@/components/notes/BookNotesSection";
import { getBookById } from "@/lib/queries/books";
import { getNotesByBookId } from "@/lib/queries/notes";
import { bookBackPath, parseBookOrigin } from "@/lib/note-origin";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string | string[] }>;
}

export default async function BookDetailPage({
  params,
  searchParams,
}: BookDetailPageProps) {
  const [{ id }, { from }] = await Promise.all([params, searchParams]);

  const [book, notes] = await Promise.all([
    getBookById(id),
    getNotesByBookId(id),
  ]);

  // 找不到書（id 不存在、亂打、或不是自己的書）→ 交給同資料夾的 not-found.tsx
  if (!book) notFound();

  const origin = parseBookOrigin(from);

  return (
    <>
      <FocusPageHeader
        title={book.title}
        backHref={bookBackPath(origin)}
        action={
          <DeleteBookButton
            bookId={book.id}
            noteCount={notes.length}
            origin={origin}
          />
        }
      />
      <Container className="pb-8">
        <BookInfo book={book} />
        <BookNotesSection bookId={book.id} notes={notes} origin={origin} />
      </Container>
    </>
  );
}
