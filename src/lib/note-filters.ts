import { isOption, pickOne, type RawSearchParams } from "@/lib/search-params";
import type { NoteSort, NoteType } from "@/types/note";

export const TYPE_FILTER_OPTIONS = [
  { value: "all", label: "全部" },
  { value: "excerpt", label: "摘錄" },
  { value: "thought", label: "心得" },
] as const satisfies readonly { value: NoteType | "all"; label: string }[];

export type NoteTypeFilter = (typeof TYPE_FILTER_OPTIONS)[number]["value"];

export const NOTE_SORT_OPTIONS = [
  { value: "updated", label: "最新更新" },
  { value: "newest", label: "最新建立" },
  { value: "oldest", label: "最早建立" },
] as const satisfies readonly { value: NoteSort; label: string }[];

// 預設值集中在這裡：parse 時用、工具列判斷「要不要寫進網址」時也用
export const DEFAULT_NOTE_FILTERS = {
  type: "all",
  keyword: "",
  sort: "updated",
} as const satisfies NoteFilters;

export interface NoteFilters {
  type: NoteTypeFilter;
  keyword: string;
  sort: NoteSort;
}

export function parseNoteFilters(raw: RawSearchParams): NoteFilters {
  const type = pickOne(raw.type);
  const sort = pickOne(raw.sort);
  return {
    type: isOption(TYPE_FILTER_OPTIONS, type)
      ? type
      : DEFAULT_NOTE_FILTERS.type,
    keyword: pickOne(raw.q),
    sort: isOption(NOTE_SORT_OPTIONS, sort) ? sort : DEFAULT_NOTE_FILTERS.sort,
  };
}

// 有沒有套用任何篩選（決定沒結果時顯示「找不到符合」）
export function isNoteFiltered(filters: NoteFilters): boolean {
  return (
    filters.type !== DEFAULT_NOTE_FILTERS.type ||
    filters.keyword !== DEFAULT_NOTE_FILTERS.keyword
  );
}
