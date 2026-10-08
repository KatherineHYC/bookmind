import Image from "next/image";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookCoverProps {
  coverUrl: string | null;
  title: string;
  size?: "md" | "sm";
}

export default function BookCover({
  coverUrl,
  title,
  size = "md",
}: BookCoverProps) {
  const isSmall = size === "sm";

  return (
    // 外框只負責比例，不裁切，影子和書頁才能露出來
    <div className="relative aspect-2/3 w-full">
      {/* 書頁厚度：一塊紙色的板子，比封面往右多露一點；直角，像真的紙頁 */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-y-[3%] border border-border bg-card",
          isSmall ? "-right-0.5 left-1" : "-right-1 left-2",
        )}
      />

      {/* 封面本體：書角是直角，只有書背那側留一點點圓 */}
      <div
        className={cn(
          "relative size-full overflow-hidden rounded-l-xs bg-muted",
          // 兩層影子：一層貼近書的實影 + 一層擴散的柔影
          "shadow-[2px_3px_6px_-2px_rgb(28_25_22/0.3),6px_10px_18px_-8px_rgb(28_25_22/0.35)]",
        )}
      >
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`《${title}》封面`}
            fill
            sizes={isSmall ? "64px" : "170px"}
            className="object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 p-3">
            <BookOpen
              className={cn(
                "text-muted-foreground/60",
                isSmall ? "size-5" : "size-7",
              )}
              strokeWidth={1.5}
            />
            {!isSmall && (
              <span className="line-clamp-3 text-center text-xs/relaxed text-muted-foreground">
                {title}
              </span>
            )}
          </div>
        )}

        {/* 書背：靠左一條由暗到亮再淡出的光影，模擬封面折進裝訂處 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[7%] bg-linear-to-r from-black/30 via-white/20 to-transparent"
        />
        {/* 書背折痕：一條細細的暗線 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-[7%] w-px bg-black/10"
        />
        {/* 整體受光：右側微微變暗，讓封面不是一片死平 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent from-60% to-black/10"
        />
      </div>
    </div>
  );
}
