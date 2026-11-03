import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Vercel Cron 每天呼叫一次，讓 Supabase 資料庫保持活躍
// 排程時間設定在專案根目錄的 vercel.json
export async function GET(request: NextRequest) {
  // 只接受 Vercel Cron 的呼叫：Vercel 會自動帶上 Authorization: Bearer <CRON_SECRET>
  // 沒設定 CRON_SECRET 時一律拒絕，避免變成任何人都能打的公開端點
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 這裡沒有使用者、也不需要 cookie，所以用最基本的 client，而不是 SSR 版本
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { error } = await supabase.rpc("keep_alive");

  if (error) {
    console.error("keep-alive 失敗：", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
