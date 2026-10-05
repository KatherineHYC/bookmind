import type { ReadingStatus } from "@/types/book";

export const READING_STATUSES = [
  "want_to_read",
  "reading",
  "completed",
] as const satisfies readonly ReadingStatus[];

export const STATUS_CONFIG: Record<
  ReadingStatus,
  { label: string; className: string; dotClassName: string }
> = {
  want_to_read: {
    label: "想讀",
    className: "bg-status-want-bg text-status-want",
    dotClassName: "bg-status-want",
  },
  reading: {
    label: "正在閱讀",
    className: "bg-status-reading-bg text-status-reading",
    dotClassName: "bg-status-reading",
  },
  completed: {
    label: "已完成",
    className: "bg-status-completed-bg text-status-completed",
    dotClassName: "bg-status-completed",
  },
};

export function isReadingStatus(value: unknown): value is ReadingStatus {
  return READING_STATUSES.some((status) => status === value);
}
