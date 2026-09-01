export type AvatarKey = "avatar-1" | "avatar-2" | "avatar-3";

// Supabase profiles 資料表的實際欄位（DB 原始格式）
export interface ProfileRow {
  user_id: string;
  display_name: string;
  avatar_key: AvatarKey;
  created_at: string;
  updated_at: string;
}

// 畫面顯示用的個人資料型別
export interface Profile {
  userId: string;
  displayName: string;
  avatarKey: AvatarKey;
  createdAt: string;
}
