import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReadingStatus } from "@/types/book";

// 狀態對照表：Record 會強制三種狀態都要填，少一個就編譯失敗
const STATUS_CONFIG: Record<
  ReadingStatus,
  { label: string; className: string }
> = {
  want_to_read: {
    label: "想讀",
    className: "bg-status-want-bg text-status-want",
  },
  reading: {
    label: "正在閱讀",
    className: "bg-status-reading-bg text-status-reading",
  },
  completed: {
    label: "已完成",
    className: "bg-status-completed-bg text-status-completed",
  },
};

interface StatusBadgeProps {
  status: ReadingStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, className: tone } = STATUS_CONFIG[status];

  return (
    <Badge className={cn("border-transparent font-normal", tone, className)}>
      {label}
    </Badge>
  );
}
