import Image from "next/image";
import { Leaf } from "lucide-react";
import SettingsCard from "./SettingsCard";
import ExportDataButton from "./ExportDataButton";
import spotOpenBook from "@/assets/illustrations/spot-open-book.webp";

interface ExportDataCardProps {
  bookCount: number;
  noteCount: number;
}

// 資料備份卡：外框與文字是 Server Component，只有按鈕＋確認框是 Client
export default function ExportDataCard({
  bookCount,
  noteCount,
}: ExportDataCardProps) {
  return (
    <SettingsCard className="p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="flex items-center gap-2 font-semibold text-primary">
            <Leaf className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
            資料備份
          </h2>
          <p className="mt-2 text-xs/relaxed text-muted-foreground">
            資料僅儲存於此裝置，不支援還原，
            <br />
            如需留存請自行匯出
          </p>
        </div>
        <Image
          src={spotOpenBook}
          alt=""
          sizes="64px"
          className="h-auto w-16 shrink-0"
        />
      </div>

      <ExportDataButton bookCount={bookCount} noteCount={noteCount} />
    </SettingsCard>
  );
}
