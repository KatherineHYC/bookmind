import { Suspense } from "react";
import PageHeader from "@/components/layouts/PageHeader";
import Container from "@/components/layouts/Container";
import EmptyState from "@/components/features/EmptyState";
import BookGrid from "@/components/books/BookGrid";
import { BookGridSkeleton } from "@/components/books/BookCardSkeleton";
import { getBooks } from "@/lib/queries/books";

async function BookSection() {
  const books = await getBooks();

  if (books.length === 0) {
    return (
      <EmptyState
        title="書架還空著"
        description="加入第一本書，開始你的閱讀紀錄。"
      />
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        共 {books.length} 本書
      </p>
      <BookGrid books={books} />
    </>
  );
}

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        title="藏書"
        subtitle="收藏與整理你的書籍，讓閱讀更有方向。"
      />
      <Container className="pb-8">
        <Suspense fallback={<BookGridSkeleton />}>
          <BookSection />
        </Suspense>
      </Container>
    </>
  );
}
