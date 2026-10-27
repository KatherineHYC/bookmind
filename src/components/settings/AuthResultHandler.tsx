"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";
import ConfirmDialog from "@/components/features/ConfirmDialog";
import { useGoogleAuth } from "./useGoogleAuth";
import type { AuthResult } from "@/lib/auth-result";

interface AuthResultHandlerProps {
  result: AuthResult | null;
}

// 從 Google 回到 /settings 後，依網址上的結果顯示 Toast 或衝突確認框
// 自己不畫任何東西，只有衝突時才會出現對話框
export default function AuthResultHandler({ result }: AuthResultHandlerProps) {
  const router = useRouter();
  const { isRedirecting, switchToGoogle } = useGoogleAuth();

  const [isConflictOpen, setIsConflictOpen] = useState(
    result === "identity-exists",
  );

  useEffect(() => {
    if (!result) return;

    // 固定 id：開發模式下 effect 會跑兩次，同一個 id 只顯示一則 Toast
    if (result === "signed-in") {
      toast.success("已登入，資料已同步", { id: "auth-result" });
    } else if (result === "cancelled") {
      toast("已取消登入", { id: "auth-result" });
    } else if (result === "failed") {
      toast.error("登入失敗，請稍後再試", { id: "auth-result" });
    }

    // 處理完就把 ?auth=... 拿掉，重新整理或分享網址時才不會再跳一次
    router.replace("/settings", { scroll: false });
  }, [result, router]);

  function handleOpenChange(nextOpen: boolean) {
    // 正在前往 Google 時不讓框被關掉
    if (isRedirecting) return;
    setIsConflictOpen(nextOpen);
  }

  return (
    <ConfirmDialog
      open={isConflictOpen}
      onOpenChange={handleOpenChange}
      icon={<CircleAlert strokeWidth={1.5} aria-hidden />}
      title="這個 Google 帳號已有資料"
      description="此帳號先前已在其他裝置使用過。改用此帳號登入後，目前的訪客資料將不會保留。"
      confirmLabel={isRedirecting ? "正在前往 Google…" : "改用此帳號"}
      destructive
      isPending={isRedirecting}
      onConfirm={switchToGoogle}
    />
  );
}
