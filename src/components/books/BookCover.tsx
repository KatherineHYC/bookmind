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
    <div className="relative aspect-2/3 w-full overflow-hidden rounded-md bg-muted">
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
    </div>
  );
}
