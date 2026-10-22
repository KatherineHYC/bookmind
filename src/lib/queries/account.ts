import "server-only";

import { createClient } from "@/lib/supabase/server";

export interface Account {
  createdAt: string;
  isAnonymous: boolean;
  email: string | null;
}

// 取得帳號本身的資訊（Supabase 內建的 auth.users）。
export async function getAccount(): Promise<Account | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    if (error) console.error("取得使用者失敗：", error);
    return null;
  }

  return {
    createdAt: user.created_at,
    isAnonymous: user.is_anonymous ?? false,
    email: user.email ?? null,
  };
}
