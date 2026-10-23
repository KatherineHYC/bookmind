import { Suspense } from "react";
import PageHeader from "@/components/layouts/PageHeader";
import Container from "@/components/layouts/Container";
import ProfileCard from "@/components/settings/ProfileCard";
import SettingsLinkList from "@/components/settings/SettingsLinkList";
import DaysUsedCard from "@/components/settings/DaysUsedCard";
import ExportDataCard from "@/components/settings/ExportDataCard";
import ClearDataCard from "@/components/settings/ClearDataCard";
import SettingsSkeleton from "@/components/settings/SettingsSkeleton";
import { getProfile } from "@/lib/queries/profile";
import { getAccount } from "@/lib/queries/account";
import { getBookCount } from "@/lib/queries/books";
import { getNoteCount } from "@/lib/queries/notes";
import { PROFILE_DEFAULTS } from "@/lib/profile-defaults";
import { APP_VERSION } from "@/lib/app-info";
import headerSettings from "@/assets/illustrations/header-settings.webp";

async function SettingsContent() {
  const [profile, account, bookCount, noteCount] = await Promise.all([
    getProfile(),
    getAccount(),
    getBookCount(),
    getNoteCount(),
  ]);

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

      <div className="space-y-3">
        <ExportDataCard bookCount={bookCount} noteCount={noteCount} />
        {/* 清除資料只給訪客；登入後資料在雲端，改由登出處理 */}
        {account?.isAnonymous && (
          <ClearDataCard bookCount={bookCount} noteCount={noteCount} />
        )}
      </div>

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
