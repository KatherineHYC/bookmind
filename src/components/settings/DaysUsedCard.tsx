import Image from "next/image";
import { differenceInCalendarDays } from "date-fns";
import SettingsCard from "./SettingsCard";
import spotDays from "@/assets/illustrations/spot-days.webp";

interface DaysUsedCardProps {
  // 帳號建立時間（ISO 字串）
  since: string;
}

// 使用天數卡
export default function DaysUsedCard({ since }: DaysUsedCardProps) {
  const days = differenceInCalendarDays(new Date(), new Date(since)) + 1;

  return (
    <SettingsCard className="flex items-center  p-4 gap-8">
      <Image
        src={spotDays}
        alt=""
        sizes="64px"
        className="h-auto w-16 shrink-0"
      />
      <div className="min-w-0 text-sm/relaxed">
        <p>
          使用 BookMind 已經{" "}
          <span className="text-base font-semibold text-primary tabular-nums">
            {days}
          </span>{" "}
          天了
        </p>
        <p className="mt-1 text-muted-foreground">持續閱讀，持續成長</p>
      </div>
    </SettingsCard>
  );
}
