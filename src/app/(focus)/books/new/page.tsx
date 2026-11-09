import FocusPageHeader from "@/components/layouts/FocusPageHeader";
import Container from "@/components/layouts/Container";
import AddBookSearch from "@/components/books/AddBookSearch";
import { getAddedGoogleBookIds } from "@/lib/queries/books";
import { bookBackPath, parseBookOrigin } from "@/lib/note-origin";

interface AddBookPageProps {
  searchParams: Promise<{ from?: string | string[] }>;
}

export default async function AddBookPage({ searchParams }: AddBookPageProps) {
  const [{ from }, addedGoogleBookIds] = await Promise.all([
    searchParams,
    getAddedGoogleBookIds(),
  ]);

  return (
    <>
      <FocusPageHeader
        title="新增書籍"
        description="搜尋或掃描條碼，把書加入你的書單。"
        backHref={bookBackPath(parseBookOrigin(from))}
      />
      <Container className="pb-8">
        <AddBookSearch addedGoogleBookIds={addedGoogleBookIds} />
      </Container>
    </>
  );
}
