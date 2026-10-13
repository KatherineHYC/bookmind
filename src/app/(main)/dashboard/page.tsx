import PageHeader from "@/components/layouts/PageHeader";
import headerHome from "@/assets/illustrations/header-home.webp";

export default function DashboardPage() {
  return (
    <PageHeader
      title="BookMind"
      subtitle="每一本書，都是一段旅程"
      illustration={headerHome}
    />
  );
}
