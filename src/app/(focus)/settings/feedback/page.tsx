import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import FocusPageHeader from "@/components/layouts/FocusPageHeader";
import Container from "@/components/layouts/Container";
import CopyEmailButton from "@/components/settings/CopyEmailButton";
import { APP_VERSION, SUPPORT_EMAIL } from "@/lib/app-info";
import { describeDevice } from "@/lib/device-label";
import spotFeedback from "@/assets/illustrations/spot-feedback.webp";

export const metadata: Metadata = { title: "問題回報 - BookMind" };

// mailto 連結：主旨固定，內文先幫使用者附上版本與裝置資訊
function buildMailto(device: string) {
  const subject = "BookMind 問題回報";
  const body = [
    "請描述你遇到的問題或想法：",
    "",
    "",
    "──────────",
    `版本：v${APP_VERSION}`,
    `瀏覽器：${device}`,
  ].join("\n");

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default async function FeedbackPage() {
  const device = describeDevice((await headers()).get("user-agent"));

  return (
    <>
      <FocusPageHeader backHref="/settings" />
      <Container className="pb-12 text-center md:max-w-lg lg:max-w-lg">
        <Image
          src={spotFeedback}
          alt=""
          sizes="192px"
          className="mx-auto h-auto w-48"
        />

        <h1 className="mt-6 text-2xl font-semibold text-primary">
          遇到問題，或有想法嗎？
        </h1>
        <p className="mt-3 font-sans text-sm/relaxed text-foreground">
          不論是操作卡住、資料出錯，
          <br />
          還是希望 BookMind 多一個功能，都歡迎寫信告訴我們。
        </p>

        <Button
          render={<a href={buildMailto(device)} />}
          nativeButton={false}
          className="mt-8 h-12 w-full text-base"
        >
          <Mail className="size-5" />
          寄信回報
        </Button>
        <p className="mt-3 font-sans text-xs/relaxed text-muted-foreground">
          信中已自動附上版本與瀏覽器資訊，
          <br />
          若方便，再附上一張截圖就更好了。
        </p>

        <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          或直接寄到
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-card py-1 pr-1 pl-4 shadow-xs">
          <span className="min-w-0 flex-1 truncate text-left font-sans text-sm select-all">
            {SUPPORT_EMAIL}
          </span>
          <CopyEmailButton email={SUPPORT_EMAIL} />
        </div>
      </Container>
    </>
  );
}
