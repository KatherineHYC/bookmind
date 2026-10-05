import FocusPageHeader from "@/components/layouts/FocusPageHeader";
import Container from "@/components/layouts/Container";
import AddBookSearch from "@/components/books/AddBookSearch";

export default function AddBookPage() {
  return (
    <>
      <FocusPageHeader
        title="新增書籍"
        description="搜尋或掃描條碼，把書加入你的書單。"
        backHref="/books"
      />
      <Container className="pb-8">
        <AddBookSearch />
      </Container>
    </>
  );
}
