import { createServerClient } from "@supabase/ssr";
import {
  isAuthRefreshDiscardedError,
  isAuthRetryableFetchError,
  type AuthError,
} from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

// 需要使用者才能運作的 app 頁面；只有進到這些頁面才建立匿名帳號
const APP_PATHS = ["/dashboard", "/books", "/notes", "/settings"];
// 放在 /settings 底下、但不需要帳號的公開頁面（Google OAuth 審核也會來看隱私權頁）
const PUBLIC_PATHS = [
  "/settings/about",
  "/settings/privacy",
  "/settings/terms",
];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user && shouldCreateAnonymousUser(request, error)) {
    await supabase.auth.signInAnonymously();
  }

  return response;
}

// 同時符合兩個條件才建立匿名帳號，避免重複建立、或把既有帳號的 cookie 蓋掉
function shouldCreateAnonymousUser(
  request: NextRequest,
  error: AuthError | null,
) {
  // 1. 暫時性失敗（網路斷線、Supabase 5xx、同時刷新 token 被丟棄）：
  //    原本的帳號還在，保留 cookie 等下一次請求，不能換成新帳號
  if (
    isAuthRetryableFetchError(error) ||
    isAuthRefreshDiscardedError(error) ||
    (error?.status ?? 0) >= 500
  ) {
    return false;
  }

  // 2. 只有 app 頁面需要帳號；首頁、法律頁、不存在的網址都不建
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.includes(pathname)) return false;

  return APP_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|swe-worker-.*|workbox-.*|api/keep-alive|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
