import type { Metadata } from "next";
import ProfileForm from "@/components/settings/ProfileForm";
import { getProfile } from "@/lib/queries/profile";
import { PROFILE_DEFAULTS } from "@/lib/profile-defaults";

export const metadata: Metadata = { title: "編輯個人資料 - BookMind" };

export default async function EditProfilePage() {
  const profile = await getProfile();
  const { displayName, avatarKey } = profile ?? PROFILE_DEFAULTS;

  return <ProfileForm defaultValues={{ displayName, avatarKey }} />;
}
