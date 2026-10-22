import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SettingsCard from "./SettingsCard";
import { AVATARS } from "@/lib/avatars";
import type { AvatarKey } from "@/types/profile";

interface ProfileCardProps {
  displayName: string;
  avatarKey: AvatarKey;
  statusText: string;
}

// 個人資料卡
export default function ProfileCard({
  displayName,
  avatarKey,
  statusText,
}: ProfileCardProps) {
  return (
    <SettingsCard>
      <Link
        href="/settings/profile"
        className="flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-muted/50"
      >
        <Image
          src={AVATARS[avatarKey].src}
          alt=""
          sizes="64px"
          className="size-16 shrink-0 rounded-full bg-muted object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl font-semibold text-primary">
            {displayName}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {statusText}
          </p>
        </div>
        <ChevronRight
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <span className="sr-only">編輯個人資料</span>
      </Link>
    </SettingsCard>
  );
}
