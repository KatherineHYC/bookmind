import { notFound } from "next/navigation";
import NoteForm from "@/components/notes/NoteForm";
import { createNote } from "@/app/actions/notes";
import { getBookById } from "@/lib/queries/books";
import { bookDetailPath, parseBookOrigin } from "@/lib/note-origin";

interface NewNotePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string | string[] }>;
}

export default async function NewNotePage({
  params,
  searchParams,
}: NewNotePageProps) {
  const [{ id }, { from }] = await Promise.all([params, searchParams]);

  // 確認書存在而且是自己的（別人的書 RLS 會讓它查不到）
  const book = await getBookById(id);

  // 往上找最近的 not-found.tsx：/books/[id]/not-found.tsx，畫面是「找不到這本書」
  if (!book) notFound();

  // 書籍詳情的來源一路帶著：存檔或返回後，書籍詳情的返回鍵才知道要回首頁還是藏書頁
  const origin = parseBookOrigin(from);

  return (
    <NoteForm
      mode="create"
      action={createNote.bind(null, book.id, origin)}
      backHref={bookDetailPath(book.id, origin)}
    />
  );
}
