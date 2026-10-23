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

export type ClearAllDataResult = { ok: true } | { error: string };

const CLEAR_FAILED = "清除失敗，請稍後再試";

// 清除目前使用者的所有資料：書（筆記靠 on delete cascade 跟著刪）＋ 個人設定
// 匿名帳號本身保留，下次讀取個人設定就會回到預設的「閱讀旅人」
export async function clearAllData(): Promise<ClearAllDataResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "尚未登入，請重新整理頁面" };
  }

  // RLS 是最後一道防線；萬一哪天 policy 被改壞，少了這行就會變成「刪掉整張表」。
  // 刪除這種不可逆的動作，條件寫在程式碼裡，看的人也一眼就知道範圍。
  const { error: booksError } = await supabase
    .from("books")
    .delete()
    .eq("user_id", user.id);

  if (booksError) {
    console.error("清除書籍失敗：", booksError);
    return { error: CLEAR_FAILED };
  }

  // 這裡接受這個風險，因為兩個刪除都可以重跑（沒東西可刪也不會出錯），使用者再按一次就好。
  // 要做到「全有或全無」，得在資料庫寫一個 function 再用 supabase.rpc() 呼叫。
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("user_id", user.id);

  if (profileError) {
    console.error("清除個人設定失敗：", profileError);
    return { error: CLEAR_FAILED };
  }

  // 首頁、藏書、筆記、設定頁全都受影響，所以從最外層 layout 整個重新驗證
  revalidatePath("/", "layout");

  return { ok: true };
}
