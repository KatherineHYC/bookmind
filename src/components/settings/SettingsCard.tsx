import { cn } from "@/lib/utils";

// 設定頁每一塊白色卡片的共用外框
export default function SettingsCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl bg-card shadow-xs", className)}>
      {children}
    </div>
  );
}
