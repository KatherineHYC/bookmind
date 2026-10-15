import FocusPageHeader from "@/components/layouts/FocusPageHeader";
import Container from "@/components/layouts/Container";
import EmptyState from "@/components/features/EmptyState";
import spotNotFound from "@/assets/illustrations/spot-not-found.webp";

// 找不到筆記：只留返回鍵，不顯示編輯與刪除
export default function NoteNotFound() {
  return (
    <>
      <FocusPageHeader backHref="/notes" />
      <Container className="pb-8">
        <EmptyState
          title="找不到這則筆記"
          description="它可能已經被刪除了"
          illustration={spotNotFound}
          actionLabel="回到筆記"
          actionHref="/notes"
        />
      </Container>
    </>
  );
}
