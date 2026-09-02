import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NoteType } from "@/types/note";

const TYPE_CONFIG: Record<NoteType, { label: string; className: string }> = {
  excerpt: {
    label: "摘錄",
    className: "bg-status-reading-bg text-status-reading",
  },
  thought: {
    label: "心得",
    className: "bg-status-completed-bg text-status-completed",
  },
};

interface NoteTypeBadgeProps {
  type: NoteType;
  className?: string;
}

export default function NoteTypeBadge({ type, className }: NoteTypeBadgeProps) {
  const { label, className: tone } = TYPE_CONFIG[type];

  return (
    <Badge className={cn("border-transparent font-normal", tone, className)}>
      {label}
    </Badge>
  );
}
