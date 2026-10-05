import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "@/lib/book-status";
import { cn } from "@/lib/utils";
import type { ReadingStatus } from "@/types/book";

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
