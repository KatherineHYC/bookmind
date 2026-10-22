import type { StaticImageData } from "next/image";
import avatarGirl from "@/assets/illustrations/avatar-girl.webp";
import avatarBoy from "@/assets/illustrations/avatar-boy.webp";
import avatarSprout from "@/assets/illustrations/avatar-sprout.webp";
import type { AvatarKey } from "@/types/profile";

export const AVATAR_KEYS = [
  "avatar-1",
  "avatar-2",
  "avatar-3",
] as const satisfies readonly AvatarKey[];

export const AVATARS: Record<
  AvatarKey,
  { src: StaticImageData; label: string }
> = {
  "avatar-1": { src: avatarGirl, label: "女孩" },
  "avatar-2": { src: avatarBoy, label: "男孩" },
  "avatar-3": { src: avatarSprout, label: "小芽怪" },
};
