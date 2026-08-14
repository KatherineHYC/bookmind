import Link from "next/link";
import { Library, PenLine, Tag, Sprout, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col text-center items-center gap-3">
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
        <h3 className="tracking-widest text-sm font-semibold text-foreground ">
          {title}
        </h3>
        <p className="mt-1.5 text-xs/normal text-balance text-center tracking-normal text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

const CONTAINER = "mx-auto w-full max-w-md px-6";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* ===== Section 1：Hero ===== */}
      <section className="isolate">
        <div className="mx-auto w-full text-center max-w-md py-9">
          <div>
            <h1 className="text-6xl/tight font-semibold text-primary">
              BookMind
            </h1>
            <h2 className="mt-7 whitespace-nowrap text-2xl/loose tracking-wider font-medium text-foreground">
              將字裡行間的靈感記錄下來
            </h2>
            <p className="mt-6 text-base/loose text-muted-foreground">
              一本書，一個想法，
              <br />
              都是你成長的養分。
            </p>
            <Button asChild size="lg" className="mt-8 h-12 px-10 text-sm">
              <Link href="/dashboard">開始記錄 →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== Section 2：功能介紹 ===== */}
      <section className="isolate">
        <div className={cn(CONTAINER, "py-10")}>
          <h2 className="text-center text-xl/loose tracking-widest font-medium text-foreground">
            為閱讀而生的筆記空間
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Section 3：引言（滿版色塊）===== */}
      <section className="isolate bg-secondary">
        <blockquote className="mx-auto flex w-fit flex-col items-center px-6 py-14 text-center">
          <p className="my-6 text-lg leading-loose text-secondary-foreground">
            「閱讀是一場與作者的對話，
            <br />
            而筆記，是與自己的對話。」
          </p>
        </blockquote>
      </section>
    </main>
  );
}
