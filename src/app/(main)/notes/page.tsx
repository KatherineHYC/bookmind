import PageHeader from "@/components/layouts/PageHeader";
import headerNotes from "@/assets/illustrations/header-notes.webp";

export default function NotesPage() {
  return (
    <PageHeader
      title="筆記"
      subtitle={"將字裡行間的靈感，\n化為日後的養分。"}
      illustration={headerNotes}
    />
  );
}
