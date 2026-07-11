import { createBrowserClient } from "@supabase/ssr";

// 瀏覽器端使用（'use client' 元件內）
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
