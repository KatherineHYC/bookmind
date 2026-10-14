import { notFound } from "next/navigation";
import NoteForm from "@/components/notes/NoteForm";
import { getBookById } from "@/lib/queries/books";

interface NewNotePageProps {
  params: Promise<{ id: string }>;
}

export default async function NewNotePage({ params }: NewNotePageProps) {
  const { id } = await params;

  const book = await getBookById(id);

  if (!book) notFound();

  return <NoteForm bookId={book.id} />;
}
