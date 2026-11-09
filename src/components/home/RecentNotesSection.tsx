import SectionHeader from "./SectionHeader";
import SectionEmptyHint from "./SectionEmptyHint";
import RecentNoteItem from "./RecentNoteItem";
import type { NoteWithBookCover } from "@/types/note";

export default function RecentNotesSection({
  notes,
}: {
  notes: NoteWithBookCover[];
}) {
  const hasNotes = notes.length > 0;

  return (
    <section aria-labelledby="home-notes-title">
      <SectionHeader
        title="最近筆記"
        titleId="home-notes-title"
        href={hasNotes ? "/notes" : undefined}
      />

      {hasNotes ? (
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note, index) => (
            // 第 4 筆只在平板兩欄時補滿 2×2，手機和桌機三欄都只顯示 3 筆
            <li
              key={note.id}
              className={index === 3 ? "hidden md:block lg:hidden" : undefined}
            >
              <RecentNoteItem note={note} />
            </li>
          ))}
        </ul>
      ) : (
        <SectionEmptyHint
          message="還沒有任何筆記"
          linkLabel="打開一本書，記下第一個靈感"
          href="/books"
        />
      )}
    </section>
  );
}
