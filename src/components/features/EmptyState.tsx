import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ILLUSTRATION_SIZES = "(min-width: 768px) 224px, 192px";

interface EmptyStateProps {
  title: string;
  description?: string;
  illustration?: StaticImageData;
  illustrationBadge?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  // 按鈕外觀：default 實心（主要動作）、outline 外框（補救動作，例如重試）
  actionVariant?: "default" | "outline";
  // 按鈕文字前面的小圖示
  actionIcon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  illustration,
  illustrationBadge,
  actionLabel,
  actionHref,
  onAction,
  actionVariant = "default",
  actionIcon,
}: EmptyStateProps) {
  // 有文字 + 有其中一種行為，才渲染按鈕
  const hasAction = Boolean(actionLabel) && Boolean(actionHref || onAction);

  const actionClassName = cn(
    "mt-6 h-11 px-6",
    actionVariant === "outline" && "border-primary/50 bg-card text-primary",
  );

  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <div className="relative w-48 md:w-56">
        {illustration ? (
          <Image
            src={illustration}
            alt=""
            sizes={ILLUSTRATION_SIZES}
            className="h-auto w-full"
          />
        ) : (
          <div className="aspect-4/3 w-full rounded-lg bg-muted" aria-hidden />
        )}

        {illustrationBadge && (
          <div className="absolute top-[12%] right-[10%]" aria-hidden>
            {illustrationBadge}
          </div>
        )}
      </div>

      <p className="mt-6 text-base font-medium text-foreground">{title}</p>

      {description && (
        <p className="mt-2 text-sm/relaxed text-muted-foreground">
          {description}
        </p>
      )}

      {hasAction &&
        (actionHref ? (
          <Button
            render={<Link href={actionHref} />}
            nativeButton={false}
            variant={actionVariant}
            className={actionClassName}
          >
            {actionIcon}
            {actionLabel}
          </Button>
        ) : (
          <Button
            onClick={onAction}
            variant={actionVariant}
            className={actionClassName}
          >
            {actionIcon}
            {actionLabel}
          </Button>
        ))}
    </div>
  );
}
