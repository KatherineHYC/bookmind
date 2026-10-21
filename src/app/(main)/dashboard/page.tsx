import { Suspense } from "react";
import PageHeader from "@/components/layouts/PageHeader";
import Container from "@/components/layouts/Container";
import EmptyState from "@/components/features/EmptyState";
import StatsRow from "@/components/home/StatsRow";
import ReadingSection from "@/components/home/ReadingSection";
import RecentNotesSection from "@/components/home/RecentNotesSection";
import DashboardSkeleton from "@/components/home/DashboardSkeleton";
import { getBookCount, getBooks } from "@/lib/queries/books";
import { getNoteCount, getRecentNotes } from "@/lib/queries/notes";
import headerHome from "@/assets/illustrations/header-home.webp";
import spotSearchStart from "@/assets/illustrations/spot-search-start.webp";

const READING_LIMIT = 3;
const RECENT_NOTE_LIMIT = 3;

async function DashboardContent() {
  const [bookCount, readingCount, noteCount, readingBooks, recentNotes] =
    await Promise.all([
      getBookCount(),
      getBookCount("reading"),
      getNoteCount(),
      getBooks({ status: "reading", sort: "newest", limit: READING_LIMIT }),
      getRecentNotes(RECENT_NOTE_LIMIT),
    ]);

  return (
    <div className="space-y-10">
      <StatsRow
        bookCount={bookCount}
        readingCount={readingCount}
        noteCount={noteCount}
      />

      {bookCount === 0 ? (
        <EmptyState
          title="從第一本書開始"
          description="加入一本書，這裡就會出現你的閱讀進度與筆記。"
          illustration={spotSearchStart}
          actionLabel="新增書籍"
          actionHref="/books/new"
        />
      ) : (
        <>
          <ReadingSection books={readingBooks} />
          <RecentNotesSection notes={recentNotes} />
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="BookMind"
        subtitle="每一本書，都是一段旅程"
        illustration={headerHome}
      />
      <Container className="pb-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </Container>
    </>
  );
}
