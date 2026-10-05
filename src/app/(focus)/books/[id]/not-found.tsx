import FocusPageHeader from "@/components/layouts/FocusPageHeader";
import Container from "@/components/layouts/Container";
import EmptyState from "@/components/features/EmptyState";

// 找不到書籍：只留返回鍵，不顯示刪除按鈕
export default function BookNotFound() {
  return (
    <>
      <FocusPageHeader backHref="/books" />
      <Container className="pb-8">
        <EmptyState
          title="找不到這本書"
          description="它可能已經被刪除了"
          actionLabel="回到藏書"
          actionHref="/books"
        />
      </Container>
    </>
  );
}
