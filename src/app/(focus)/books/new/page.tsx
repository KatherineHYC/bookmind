import FocusPageHeader from "@/components/layouts/FocusPageHeader";
import Container from "@/components/layouts/Container";
import EmptyState from "@/components/features/EmptyState";

export default function AddBookPage() {
  return (
    <>
      <FocusPageHeader
        title="新增書籍"
        description="搜尋或掃描條碼，把書加入你的書單。"
        backHref="/books"
      />
      <Container>
        <EmptyState title="輸入書名或掃描書背條碼開始" />
      </Container>
    </>
  );
}
