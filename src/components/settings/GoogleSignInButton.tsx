"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/features/GoogleIcon";
import { useGoogleAuth } from "./useGoogleAuth";

interface GoogleSignInButtonProps {
  // 目前這個訪客有沒有書（筆記一定掛在書底下，所以看書就夠）
  hasGuestData: boolean;
}

// 「使用 Google 登入」
export default function GoogleSignInButton({
  hasGuestData,
}: GoogleSignInButtonProps) {
  const { isRedirecting, linkGoogle, switchToGoogle } = useGoogleAuth();

  // 有書：綁定到目前帳號，資料原地保留
  // 沒書：直接登入該 Google 帳號，登出後再登入就不會撞到「已有資料」確認框
  const handleClick = hasGuestData ? linkGoogle : switchToGoogle;

  return (
    <Button
      variant="outline"
      size="lg"
      className="mt-4 w-full bg-card"
      disabled={isRedirecting}
      onClick={handleClick}
    >
      {isRedirecting ? (
        <>
          <Loader2 className="animate-spin" aria-hidden />
          正在前往 Google…
        </>
      ) : (
        <>
          <GoogleIcon aria-hidden />
          使用 Google 登入
        </>
      )}
    </Button>
  );
}
