import { Suspense } from "react";
import PageHeader from "@/components/layouts/PageHeader";
import Container from "@/components/layouts/Container";
import EmptyState from "@/components/features/EmptyState";
import BookGrid from "@/components/books/BookGrid";
import { BookGridSkeleton } from "@/components/books/BookCardSkeleton";
import BookToolbar from "@/components/books/BookToolbar";
import { getBooks } from "@/lib/queries/books";
import { parseBookFilters, type BookFilters } from "@/lib/book-filters";
import FAB from "@/components/layouts/FAB";

interface LibraryPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function BookResults({ filters }: { filters: BookFilters }) {
  const books = await getBooks({
    status: filters.status === "all" ? undefined : filters.status,
    keyword: filters.keyword || undefined,
    sort: filters.sort,
  });

  const isFiltered = filters.status !== "all" || filters.keyword !== "";

  if (books.length === 0) {
    return isFiltered ? (
      <EmptyState title="找不到符合的書" description="換個篩選條件試試。" />
    ) : (
      <EmptyState
        title="書架還空著"
        description="加入第一本書，開始你的閱讀紀錄。"
        actionLabel="新增書籍"
        actionHref="/books/new"
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

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const filters = parseBookFilters(await searchParams);

  const suspenseKey = `${filters.status}-${filters.keyword}-${filters.sort}`;

  return (
    <>
      <PageHeader
        title="藏書"
        subtitle="收藏與整理你的書籍，讓閱讀更有方向。"
      />
      <Container className="pb-8">
        <BookToolbar filters={filters} />

        <Suspense key={suspenseKey} fallback={<BookGridSkeleton />}>
          <BookResults filters={filters} />
        </Suspense>
        <FAB href="/books/new" label="新增書籍" />
      </Container>
    </>
  );
}
