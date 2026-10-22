"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileInput } from "@/lib/profile-schema";

export type UpdateProfileResult = { ok: true } | { error: string };

// 更新暱稱與頭像
export async function updateProfile(
  input: ProfileInput,
): Promise<UpdateProfileResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "個人資料格式不正確" };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "尚未登入，請重新整理頁面" };
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      display_name: parsed.data.displayName,
      avatar_key: parsed.data.avatarKey,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    console.error("更新個人資料失敗：", error);
    return { error: "儲存失敗，請稍後再試" };
  }

  revalidatePath("/settings");

  return { ok: true };
}
