import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AUTH_RESULT_PARAM, type AuthResult } from "@/lib/auth-result";

// 從 Google 回來的落地點：Google → Supabase → 這裡 → /settings
// 網址上會帶 code（成功）或 error / error_code（失敗）
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    // 用一次性的 code 換成 session，寫進 cookie

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) return redirectToSettings(request, "signed-in");

    console.error("交換登入 session 失敗：", error);
    return redirectToSettings(request, "failed");
  }

  return redirectToSettings(request, toAuthResult(searchParams));
}

// 把 Supabase 帶回來的錯誤翻成設定頁看得懂的結果
function toAuthResult(params: URLSearchParams): AuthResult {
  const error = params.get("error");
  const errorCode = params.get("error_code");

  // 這個 Google 帳號已經綁在另一個使用者身上（D 狀態）
  if (errorCode === "identity_already_exists") return "identity-exists";

  // 使用者在 Google 畫面按取消：Google 回 access_denied，且沒有 Supabase 自己的錯誤代碼
  if (error === "access_denied" && !errorCode) return "cancelled";

  console.error("Google 登入失敗：", params.get("error_description"));
  return "failed";
}

// 只導回站內的 /settings，不接受網址指定目的地（避免 open redirect）
function redirectToSettings(request: NextRequest, result: AuthResult) {
  const url = new URL("/settings", request.url);
  url.searchParams.set(AUTH_RESULT_PARAM, result);
  return NextResponse.redirect(url);
}
