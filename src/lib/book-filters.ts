import { BookSort } from "@/types/book";

export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "全部" },
  { value: "reading", label: "閱讀中" },
  { value: "completed", label: "已完成" },
  { value: "want_to_read", label: "想讀" },
] as const;

export type BookStatusFilter = (typeof STATUS_FILTER_OPTIONS)[number]["value"];

export const SORT_OPTIONS = [
  { value: "newest", label: "最新" },
  { value: "oldest", label: "最舊" },
  { value: "title", label: "書名" },
] as const satisfies readonly { value: BookSort; label: string }[];

export interface BookFilters {
  status: BookStatusFilter;
  keyword: string;
  sort: BookSort;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

function pickOne(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function isOption<T extends string>(
  options: readonly { value: T }[],
  value: string,
): value is T {
  return options.some((option) => option.value === value);
}

export function parseBookFilters(raw: RawSearchParams): BookFilters {
  const status = pickOne(raw.status);
  const keyword = pickOne(raw.q);
  const sort = pickOne(raw.sort);
  return {
    status: isOption(STATUS_FILTER_OPTIONS, status) ? status : "all",
    keyword,
    sort: isOption(SORT_OPTIONS, sort) ? sort : "newest",
  };
}
