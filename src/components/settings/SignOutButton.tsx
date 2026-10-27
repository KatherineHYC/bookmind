"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/features/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";

const SIGN_OUT_FAILED = "登出失敗，請稍後再試";

// 設定頁最下方的登出按鈕
export default function SignOutButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    if (isSigningOut) return;
    setIsOpen(nextOpen);
  }

  function handleConfirm() {
    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut({ scope: "local" });
        if (error) throw error;

        toast.success("已登出");
        router.refresh();
      } catch (error) {
        console.error("登出失敗：", error);
        toast.error(SIGN_OUT_FAILED);
      } finally {
        setIsOpen(false);
      }
    });
  }

  return (
    <>
      <Button
        size="lg"
        className="h-12 w-full rounded-2xl bg-accent-foreground text-primary-foreground shadow-xs hover:bg-accent-foreground/90"
        onClick={() => setIsOpen(true)}
      >
        <LogOut strokeWidth={1.5} aria-hidden />
        登出
      </Button>

      <ConfirmDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        icon={<LogOut strokeWidth={1.5} aria-hidden />}
        title="確定要登出嗎？"
        description="登出後這台裝置將不再顯示你的資料，重新登入即可找回。"
        confirmLabel={isSigningOut ? "登出中…" : "登出"}
        destructive
        isPending={isSigningOut}
        onConfirm={handleConfirm}
      />
    </>
  );
}
