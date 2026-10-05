import { notFound } from "next/navigation";
import FocusPageHeader from "@/components/layouts/FocusPageHeader";
import Container from "@/components/layouts/Container";
import BookInfo from "@/components/books/BookInfo";
import DeleteBookButton from "@/components/books/DeleteBookButton";
import BookNotesSection from "@/components/notes/BookNotesSection";
import { getBookById } from "@/lib/queries/books";
import { getNotesByBookId } from "@/lib/queries/notes";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;

  // 總等待時間是兩者中較慢的那個，而不是兩個相加。（兩口爐同時開火，而不是煮完湯才開始炒菜）
  const [book, notes] = await Promise.all([
    getBookById(id),
    getNotesByBookId(id),
  ]);

  // 找不到書（id 不存在、亂打、或不是自己的書）→ 交給同資料夾的 not-found.tsx
  if (!book) notFound();

  return (
    <>
      <FocusPageHeader
        title={book.title}
        backHref="/books"
        action={<DeleteBookButton bookId={book.id} noteCount={notes.length} />}
      />
      <Container className="pb-8">
        <BookInfo book={book} />
        <BookNotesSection bookId={book.id} notes={notes} />
      </Container>
    </>
  );
}
