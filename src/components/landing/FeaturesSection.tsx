import Image from "next/image";
import {
  Library,
  PenLine,
  Cloud,
  type LucideIcon,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import brushStroke from "@/assets/illustrations/deco-brush-1.webp";

// 卡片資料：只寫實際做出來的功能
const FEATURES: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
  tone: "secondary" | "accent";
}> = [
  {
    icon: Library,
    title: "書籍管理",
    description: "掃描 ISBN 或搜尋書名就能加入，打造專屬於你的閱讀地圖。",
    tone: "secondary",
  },
  {
    icon: PenLine,
    title: "筆記紀錄",
    description: "隨時記下喜歡的書中原句或心得感想，讓想法不再稍縱即逝。",
    tone: "accent",
  },
  {
    icon: Cloud,
    title: "雲端同步",
    description: "免註冊就能開始使用；連結 Google 帳號後，換裝置也可查看筆記。",
    tone: "secondary",
  },
  {
    icon: Smartphone,
    title: "加到桌面",
    description: "不用下載 App，把網頁加到手機主畫面，點開就能直接記錄。",
    tone: "accent",
  },
];

// 單張功能卡片：icon 在左、文字靠左，長句子比置中好讀
function FeatureCard({
  icon: Icon,
  title,
  description,
  tone,
}: (typeof FEATURES)[number]) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-full",
          tone === "secondary"
            ? "bg-secondary text-secondary-foreground"
            : "bg-accent text-accent-foreground",
        )}
      >
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 pt-0.5">
        {/* 標題保留宋體（繼承 html 的 font-serif），放大到 16px */}
        <h3 className="text-base font-semibold tracking-widest text-foreground">
          {title}
        </h3>
        {/* 說明改黑體 14px，與設定頁內文一致 */}
        <p className="mt-1 text-pretty font-sans text-sm/relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="isolate">
      <div className="mx-auto w-full max-w-md px-6 py-10">
        <Image
          src={brushStroke}
          alt=""
          sizes="160px"
          className="mx-auto mb-2 w-40"
        />
        <h2 className="text-center text-xl/loose font-medium tracking-widest text-foreground">
          為閱讀而生的筆記空間
        </h2>

        <div className="mx-auto mt-8 flex max-w-[18rem] flex-col gap-6">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
