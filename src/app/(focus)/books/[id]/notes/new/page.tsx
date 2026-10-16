import { notFound } from "next/navigation";
import NoteForm from "@/components/notes/NoteForm";
import { createNote } from "@/app/actions/notes";
import { getBookById } from "@/lib/queries/books";

interface NewNotePageProps {
  params: Promise<{ id: string }>;
}

export default async function NewNotePage({ params }: NewNotePageProps) {
  const { id } = await params;

  // 確認書存在而且是自己的（別人的書 RLS 會讓它查不到）
  const book = await getBookById(id);

  // 往上找最近的 not-found.tsx：/books/[id]/not-found.tsx，畫面是「找不到這本書」
  if (!book) notFound();

  return (
    <NoteForm
      mode="create"
      action={createNote.bind(null, book.id)}
      backHref={`/books/${book.id}`}
    />
  );
}
