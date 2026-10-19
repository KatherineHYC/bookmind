"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import FilterChips from "@/components/features/FilterChips";
import SearchBar from "@/components/features/SearchBar";
import SortSelect from "@/components/features/SortSelect";
import { cn } from "@/lib/utils";
import {
  DEFAULT_NOTE_FILTERS,
  NOTE_SORT_OPTIONS,
  TYPE_FILTER_OPTIONS,
  type NoteFilters,
} from "@/lib/note-filters";

export default function NoteToolbar({ filters }: { filters: NoteFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isSearchOpen, setIsSearchOpen] = useState(filters.keyword !== "");
  const searchInputRef = useRef<HTMLInputElement>(null);

  function updateParams(patch: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function openSearch() {
    flushSync(() => setIsSearchOpen(true));
    searchInputRef.current?.focus();
  }

  // 收起搜尋框時一併清掉關鍵字，避免「看不到的搜尋條件」還在默默篩選列表
  function closeSearch() {
    setIsSearchOpen(false);
    if (filters.keyword) updateParams({ q: "" });
  }

  return (
    <div className="mb-4 space-y-3">
      {/* 一排：類型篩選、搜尋開關、排序 */}
      <div className="flex items-center gap-2">
        <FilterChips
          options={[...TYPE_FILTER_OPTIONS]}
          value={filters.type}
          onChange={(value) =>
            updateParams({
              type: value === DEFAULT_NOTE_FILTERS.type ? "" : value,
            })
          }
          className="min-w-0"
        />

        <button
          type="button"
          onClick={isSearchOpen ? closeSearch : openSearch}
          aria-label={isSearchOpen ? "收起搜尋" : "搜尋筆記"}
          aria-expanded={isSearchOpen}
          className={cn(
            "relative flex size-8 shrink-0 items-center justify-center rounded-full transition-colors after:absolute after:-inset-1.5",
            isSearchOpen
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-foreground hover:bg-muted",
          )}
        >
          <Search className="size-4" aria-hidden />
        </button>

        <SortSelect
          options={[...NOTE_SORT_OPTIONS]}
          value={filters.sort}
          onChange={(value) =>
            updateParams({
              sort: value === DEFAULT_NOTE_FILTERS.sort ? "" : value,
            })
          }
          className="ml-auto"
        />
      </div>

      {isSearchOpen && (
        <SearchBar
          defaultValue={filters.keyword}
          placeholder="搜尋筆記內容"
          inputRef={searchInputRef}
          onSubmit={(keyword) => updateParams({ q: keyword })}
          onClear={closeSearch}
        />
      )}
    </div>
  );
}
