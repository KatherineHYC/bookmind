import PageHeader from "@/components/layouts/PageHeader";
import headerSettings from "@/assets/illustrations/header-settings.webp";

export default function SettingsPage() {
  return (
    <PageHeader
      title="我的"
      subtitle={"管理你的偏好設定，\n以及閱讀旅程的點滴。"}
      illustration={headerSettings}
    />
  );
}
