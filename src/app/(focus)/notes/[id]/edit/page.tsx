import { notFound } from "next/navigation";
import NoteForm from "@/components/notes/NoteForm";
import { updateNote } from "@/app/actions/notes";
import { noteDetailPath, parseNoteOrigin } from "@/lib/note-origin";
import { noteToFormValues } from "@/lib/note-schema";
import { getNoteById } from "@/lib/queries/notes";

interface EditNotePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string | string[] }>;
}

export default async function EditNotePage({
  params,
  searchParams,
}: EditNotePageProps) {
  const [{ id }, { from }] = await Promise.all([params, searchParams]);

  const note = await getNoteById(id);

  // 往上找最近的 not-found.tsx：/notes/[id]/not-found.tsx，畫面是「找不到這則筆記」
  if (!note) notFound();

  // 把「從哪裡來」一路帶著：編輯完回到詳情頁，詳情頁的返回鍵才知道要回書籍頁還是 /notes
  const origin = parseNoteOrigin(from);

  return (
    <NoteForm
      mode="edit"
      action={updateNote.bind(null, note.id, origin)}
      backHref={noteDetailPath(note.id, origin)}
      defaultValues={noteToFormValues(note)}
    />
  );
}
