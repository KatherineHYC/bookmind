import { Suspense } from "react";
import PageHeader from "@/components/layouts/PageHeader";
import Container from "@/components/layouts/Container";
import EmptyState from "@/components/features/EmptyState";
import NoteCard from "@/components/notes/NoteCard";
import { NoteListSkeleton } from "@/components/notes/NoteCardSkeleton";
import NoteToolbar from "@/components/notes/NoteToolbar";
import { getNotes, hasAnyNote } from "@/lib/queries/notes";
import { parseNoteFilters, type NoteFilters } from "@/lib/note-filters";
import type { RawSearchParams } from "@/lib/search-params";
import headerNotes from "@/assets/illustrations/header-notes.webp";
import spotNotFound from "@/assets/illustrations/spot-not-found.webp";
import spotOpenBook from "@/assets/illustrations/spot-open-book.webp";

interface NotesPageProps {
  searchParams: Promise<RawSearchParams>;
}

// 列表
async function NoteResults({ filters }: { filters: NoteFilters }) {
  const notes = await getNotes({
    type: filters.type === "all" ? undefined : filters.type,
    keyword: filters.keyword || undefined,
    sort: filters.sort,
  });

  if (notes.length === 0) {
    return (
      <EmptyState
        title="找不到符合的筆記"
        description="試試其他關鍵字或篩選條件。"
        illustration={spotNotFound}
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {notes.map((note) => (
        <li key={note.id}>
          <NoteCard note={note} />
        </li>
      ))}
    </ul>
  );
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const [rawParams, hasNotes] = await Promise.all([searchParams, hasAnyNote()]);
  const filters = parseNoteFilters(rawParams);

  const suspenseKey = `${filters.type}-${filters.keyword}-${filters.sort}`;

  return (
    <>
      <PageHeader
        title="筆記"
        subtitle={"將字裡行間的靈感，\n化為日後的養分。"}
        illustration={headerNotes}
      />
      <Container className="pb-8">
        {hasNotes ? (
          <>
            <NoteToolbar filters={filters} />
            <Suspense key={suspenseKey} fallback={<NoteListSkeleton />}>
              <NoteResults filters={filters} />
            </Suspense>
          </>
        ) : (
          <EmptyState
            title="還沒有任何筆記"
            description="到藏書打開一本書，記下第一個靈感。"
            illustration={spotOpenBook}
            actionLabel="前往藏書"
            actionHref="/books"
          />
        )}
      </Container>
    </>
  );
}
