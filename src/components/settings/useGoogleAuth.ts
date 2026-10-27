import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const REDIRECT_FAILED = "無法前往 Google 登入，請稍後再試";

// 前往 Google 的兩種方式：
// link   → 把 Google 掛到「目前這個匿名帳號」上，user id 不變，資料全部保留
// switch → 直接登入那個 Google 帳號原本的使用者，目前的訪客資料不會帶過去
type GoogleAuthMode = "link" | "switch";

export function useGoogleAuth() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  // iOS Safari 從 Google 頁按上一頁時會從快照（bfcache）還原，按鈕會卡在轉圈，這裡把狀態重置
  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) setIsRedirecting(false);
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  async function goToGoogle(mode: GoogleAuthMode) {
    setIsRedirecting(true);

    const supabase = createClient();
    // 用目前的 origin，localhost、區網 IP、Vercel 網域都能對上
    const options = { redirectTo: `${window.location.origin}/auth/callback` };

    try {
      const { error } =
        mode === "link"
          ? await supabase.auth.linkIdentity({ provider: "google", options })
          : await supabase.auth.signInWithOAuth({
              provider: "google",
              options,
            });

      // 最常見：Supabase 後台沒開 Manual linking，或 Google provider 沒設定好
      if (error) throw error;
      // 成功時瀏覽器已在跳轉，刻意不重置 isRedirecting，讓轉圈持續到離開頁面
    } catch (error) {
      // 斷網這類不是 Supabase 包裝過的錯誤會直接 throw，一起在這裡接住
      console.error("前往 Google 登入失敗：", error);
      toast.error(REDIRECT_FAILED);
      setIsRedirecting(false);
    }
  }

  return {
    isRedirecting,
    linkGoogle: () => goToGoogle("link"),
    switchToGoogle: () => goToGoogle("switch"),
  };
}
