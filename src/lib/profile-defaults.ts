import type { Profile } from "@/types/profile";

// 還沒建立 profiles 資料列時，畫面用這組
export const PROFILE_DEFAULTS = {
  displayName: "閱讀旅人",
  avatarKey: "avatar-1",
} as const satisfies Pick<Profile, "displayName" | "avatarKey">;
