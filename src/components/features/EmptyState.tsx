import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ILLUSTRATION_WIDTH = 320;
const ILLUSTRATION_HEIGHT = 240;

interface EmptyStateProps {
  title: string;
  description?: string;
  illustration?: string;
  actionLabel?: string;
  actionHref?: string; // 導頁用
  onAction?: () => void; // 開 Dialog 用
}

export default function EmptyState({
  title,
  description,
  illustration,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  // 有文字 + 有其中一種行為，才渲染按鈕
  const hasAction = Boolean(actionLabel) && Boolean(actionHref || onAction);

  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      {/* 版位尺寸寫死，換圖不影響版面 */}
      <div className="w-48 md:w-56">
        {illustration ? (
          <Image
            src={illustration}
            alt=""
            width={ILLUSTRATION_WIDTH}
            height={ILLUSTRATION_HEIGHT}
            className="h-auto w-full"
          />
        ) : (
          <div className="aspect-4/3 w-full rounded-lg bg-muted" aria-hidden />
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
            className="mt-6"
          >
            {actionLabel}
          </Button>
        ) : (
          <Button onClick={onAction} className="mt-6">
            {actionLabel}
          </Button>
        ))}
    </div>
  );
}
