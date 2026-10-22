import { Suspense } from "react";
import PageHeader from "@/components/layouts/PageHeader";
import Container from "@/components/layouts/Container";
import ProfileCard from "@/components/settings/ProfileCard";
import SettingsLinkList from "@/components/settings/SettingsLinkList";
import DaysUsedCard from "@/components/settings/DaysUsedCard";
import SettingsSkeleton from "@/components/settings/SettingsSkeleton";
import { getProfile } from "@/lib/queries/profile";
import { getAccount } from "@/lib/queries/account";
import { PROFILE_DEFAULTS } from "@/lib/profile-defaults";
import { APP_VERSION } from "@/lib/app-info";
import headerSettings from "@/assets/illustrations/header-settings.webp";

async function SettingsContent() {
  const [profile, account] = await Promise.all([getProfile(), getAccount()]);

  const { displayName, avatarKey } = profile ?? PROFILE_DEFAULTS;

  const statusText =
    account && !account.isAnonymous && account.email
      ? account.email
      : "訪客模式・資料僅儲存於本裝置";

  return (
    <div className="space-y-6">
      <ProfileCard
        displayName={displayName}
        avatarKey={avatarKey}
        statusText={statusText}
      />

      {/* 資料備份、清除本機資料：Issue 3 加在這裡 */}

      <SettingsLinkList />

      {account && <DaysUsedCard since={account.createdAt} />}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="我的"
        subtitle={"管理你的偏好設定，\n以及閱讀旅程的點滴。"}
        illustration={headerSettings}
      />
      <Container className="pb-8">
        <Suspense fallback={<SettingsSkeleton />}>
          <SettingsContent />
        </Suspense>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          目前版本 v{APP_VERSION}
        </p>
      </Container>
    </>
  );
}
