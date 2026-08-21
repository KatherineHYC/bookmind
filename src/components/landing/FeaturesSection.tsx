import { Library, PenLine, Tag, Sprout, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// 卡片資料：icon、標題、說明文字、底色 tone
const FEATURES: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
  tone: "secondary" | "accent";
}> = [
  {
    icon: Library,
    title: "書籍管理",
    description: "集中管理書單，打造專屬於你的閱讀地圖。",
    tone: "secondary",
  },
  {
    icon: PenLine,
    title: "筆記記錄",
    description: "隨時記下閱讀心得與靈感，讓想法不再稍縱即逝。",
    tone: "accent",
  },
  {
    icon: Tag,
    title: "分類標籤",
    description: "用標籤整理想法，讓知識成為有脈絡的連結。",
    tone: "accent",
  },
  {
    icon: Sprout,
    title: "追蹤與成長",
    description: "追蹤你的閱讀軌跡，看見自己的成長與改變。",
    tone: "secondary",
  },
];

// 單張功能卡片：圓形 icon 底 + 標題 + 說明
function FeatureCard({
  icon: Icon,
  title,
  description,
  tone,
}: (typeof FEATURES)[number]) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div
        className={cn(
          "flex size-14 shrink-0 items-center justify-center rounded-full",
          tone === "secondary"
            ? "bg-secondary text-secondary-foreground"
            : "bg-accent text-accent-foreground",
        )}
      >
        <Icon className="size-6" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-sm font-semibold tracking-widest text-foreground">
          {title}
        </h3>
        <p className="mt-1.5 text-balance text-xs/normal text-muted-foreground">
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
        <h2 className="text-center text-xl/loose font-medium tracking-widest text-foreground">
          為閱讀而生的筆記空間
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
