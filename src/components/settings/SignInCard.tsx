import { Leaf } from "lucide-react";
import SettingsCard from "./SettingsCard";
import GoogleSignInButton from "./GoogleSignInButton";

interface SignInCardProps {
  hasGuestData: boolean;
}

// 訪客才看得到的登入卡：外框與文字是 Server Component，只有按鈕是 Client
export default function SignInCard({ hasGuestData }: SignInCardProps) {
  return (
    <SettingsCard className="p-4">
      <h2 className="flex items-center gap-2 font-semibold text-primary">
        <Leaf className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
        登入以跨裝置同步
      </h2>
      <p className="mt-2 text-xs/relaxed text-muted-foreground">
        登入後，現有的書籍與筆記會完整保留
      </p>

      <GoogleSignInButton hasGuestData={hasGuestData} />
    </SettingsCard>
  );
}
