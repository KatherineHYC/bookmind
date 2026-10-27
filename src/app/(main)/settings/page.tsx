import { Suspense } from "react";
import PageHeader from "@/components/layouts/PageHeader";
import Container from "@/components/layouts/Container";
import ProfileCard from "@/components/settings/ProfileCard";
import SettingsLinkList from "@/components/settings/SettingsLinkList";
import DaysUsedCard from "@/components/settings/DaysUsedCard";
import ExportDataCard from "@/components/settings/ExportDataCard";
import ClearDataCard from "@/components/settings/ClearDataCard";
import SignInCard from "@/components/settings/SignInCard";
import SignOutButton from "@/components/settings/SignOutButton";
import AuthResultHandler from "@/components/settings/AuthResultHandler";
import SettingsSkeleton from "@/components/settings/SettingsSkeleton";
import { getProfile } from "@/lib/queries/profile";
import { getAccount } from "@/lib/queries/account";
import { getBookCount } from "@/lib/queries/books";
import { getNoteCount } from "@/lib/queries/notes";
import { PROFILE_DEFAULTS } from "@/lib/profile-defaults";
import { APP_VERSION } from "@/lib/app-info";
import { AUTH_RESULT_PARAM, parseAuthResult } from "@/lib/auth-result";
import type { RawSearchParams } from "@/lib/search-params";
import headerSettings from "@/assets/illustrations/header-settings.webp";

interface SettingsPageProps {
  searchParams: Promise<RawSearchParams>;
}

async function SettingsContent({ searchParams }: SettingsPageProps) {
  const [profile, account, bookCount, noteCount, rawParams] = await Promise.all(
    [getProfile(), getAccount(), getBookCount(), getNoteCount(), searchParams],
  );

  const { displayName, avatarKey } = profile ?? PROFILE_DEFAULTS;
  const authResult = parseAuthResult(rawParams[AUTH_RESULT_PARAM]);

  // 拿不到帳號時當訪客處理
  const isAnonymous = account?.isAnonymous ?? true;

  const statusText =
    !isAnonymous && account?.email
      ? account.email
      : "訪客模式・資料僅儲存於本裝置";

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <ProfileCard
          displayName={displayName}
          avatarKey={avatarKey}
          statusText={statusText}
        />
        {isAnonymous && <SignInCard hasGuestData={bookCount > 0} />}
      </div>

      <div className="space-y-3">
        <ExportDataCard
          bookCount={bookCount}
          noteCount={noteCount}
          isAnonymous={isAnonymous}
        />
        {/* 清除資料只給訪客；登入後資料在雲端，改由登出處理 */}
        {isAnonymous && (
          <ClearDataCard bookCount={bookCount} noteCount={noteCount} />
        )}
      </div>

      <SettingsLinkList />

      {account && <DaysUsedCard since={account.createdAt} />}

      {/* 登出放在頁面最後，登入後才出現 */}
      {!isAnonymous && <SignOutButton />}

      <AuthResultHandler result={authResult} />
    </div>
  );
}

export default function SettingsPage({ searchParams }: SettingsPageProps) {
  return (
    <>
      <PageHeader
        title="我的"
        subtitle={"管理你的偏好設定，\n以及閱讀旅程的點滴。"}
        illustration={headerSettings}
      />
      <Container className="pb-8">
        <Suspense fallback={<SettingsSkeleton />}>
          <SettingsContent searchParams={searchParams} />
        </Suspense>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          目前版本 v{APP_VERSION}
        </p>
      </Container>
    </>
  );
}
