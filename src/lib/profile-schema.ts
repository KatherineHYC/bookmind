import { z } from "zod";
import { AVATAR_KEYS } from "@/lib/avatars";

export const DISPLAY_NAME_MAX = 12;

// 表單和 Server Action 共用同一份規則：前端擋一次給使用者看，後端再擋一次防繞過
export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "暱稱不能空白")
    .max(DISPLAY_NAME_MAX, `暱稱最多 ${DISPLAY_NAME_MAX} 個字`),
  avatarKey: z.enum(AVATAR_KEYS),
});

export type ProfileFormValues = z.input<typeof profileSchema>;
export type ProfileInput = z.output<typeof profileSchema>;
