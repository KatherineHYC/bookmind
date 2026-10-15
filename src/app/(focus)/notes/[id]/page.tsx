import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import FocusPageHeader from "@/components/layouts/FocusPageHeader";
import Container from "@/components/layouts/Container";
import DeleteNoteButton from "@/components/notes/DeleteNoteButton";
import NoteDetail from "@/components/notes/NoteDetail";
import NoteSourceLink from "@/components/notes/NoteSourceLink";
import { getNoteById } from "@/lib/queries/notes";
import { noteBackPath, noteEditPath, parseNoteOrigin } from "@/lib/note-origin";

interface NoteDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string | string[] }>;
}

export default async function NoteDetailPage({
  params,
  searchParams,
}: NoteDetailPageProps) {
  const [{ id }, { from }] = await Promise.all([params, searchParams]);

  const note = await getNoteById(id);

  if (!note) notFound();

  const origin = parseNoteOrigin(from);

  return (
    <>
      <FocusPageHeader
        backHref={noteBackPath(origin, note.bookId)}
        action={
          <div className="-mr-3 flex items-center">
            <Button
              render={<Link href={noteEditPath(note.id, origin)} />}
              nativeButton={false}
              variant="ghost"
              size="icon"
              aria-label="編輯這則筆記"
              className="size-11"
            >
              <Pencil className="size-5" aria-hidden />
            </Button>
            <DeleteNoteButton noteId={note.id} origin={origin} />
          </div>
        }
      />
      <Container className="pb-8 md:max-w-2xl lg:max-w-2xl">
        <NoteDetail note={note} />
        <NoteSourceLink
          bookId={note.bookId}
          bookTitle={note.bookTitle}
          bookAuthors={note.bookAuthors}
        />
      </Container>
    </>
  );
}
