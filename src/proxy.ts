// @WHY middleware 沒有瀏覽器，所以必須使用 Server Client
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
          cookiesToSet.forEach(
            ({ name, value }) => request.cookies.set(name, value), // @WHY 把新的 Cookie 更新到目前的 Request。
          );
          response = NextResponse.next({ request }); // @WHY 因為 Request 改了，所以重新建立新的 Response。
          cookiesToSet.forEach(
            ({ name, value, options }) =>
              response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    await supabase.auth.signInAnonymously();
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/keep-alive|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
