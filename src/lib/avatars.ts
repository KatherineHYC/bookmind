import type { StaticImageData } from "next/image";
import avatarGirl from "@/assets/illustrations/avatar-girl.webp";
import avatarBoy from "@/assets/illustrations/avatar-boy.webp";
import avatarSprout from "@/assets/illustrations/avatar-sprout.webp";
import avatarCat from "@/assets/illustrations/avatar-cat.webp";
import avatarPug from "@/assets/illustrations/avatar-pug.webp";
import avatarAlien from "@/assets/illustrations/avatar-alien.webp";
import type { AvatarKey } from "@/types/profile";

export const AVATAR_KEYS = [
  "avatar-1",
  "avatar-2",
  "avatar-3",
  "avatar-4",
  "avatar-5",
  "avatar-6",
] as const satisfies readonly AvatarKey[];

export const AVATARS: Record<
  AvatarKey,
  { src: StaticImageData; label: string }
> = {
  "avatar-1": { src: avatarGirl, label: "女孩" },
  "avatar-2": { src: avatarBoy, label: "男孩" },
  "avatar-3": { src: avatarSprout, label: "小芽怪" },
  "avatar-4": { src: avatarCat, label: "貓咪" },
  "avatar-5": { src: avatarPug, label: "狗狗" },
  "avatar-6": { src: avatarAlien, label: "外星人" },
};
