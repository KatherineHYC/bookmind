import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileRow } from "@/types/profile";

// 取得目前使用者的個人設定；尚未建立時回 null（由呼叫端決定預設值）
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .maybeSingle<ProfileRow>();

  if (error) {
    console.error("查詢個人設定失敗：", error);
    return null;
  }

  if (!data) return null;

  return {
    userId: data.user_id,
    displayName: data.display_name,
    avatarKey: data.avatar_key,
    createdAt: data.created_at,
  };
}
