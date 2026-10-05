"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import FilterChips from "@/components/features/FilterChips";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/features/SearchBar";
import SortSelect from "@/components/features/SortSelect";
import {
  STATUS_FILTER_OPTIONS,
  SORT_OPTIONS,
  type BookFilters,
} from "@/lib/book-filters";

export default function BookToolbar({ filters }: { filters: BookFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  return (
    <div className="mb-4 space-y-3">
      {/* 第一排：搜尋框 + 新增按鈕 */}
      <div className="flex items-center gap-3">
        <SearchBar
          defaultValue={filters.keyword}
          onSubmit={(keyword) => updateParams({ q: keyword })}
          className="min-w-0 flex-1"
        />

        <Button
          render={<Link href="/books/new" />}
          nativeButton={false}
          className="h-11 px-4"
        >
          <Plus data-icon="inline-start" aria-hidden />
          新增書籍
        </Button>
      </div>
      {/* 第二排：篩選 + 排序 */}
      <div className="flex items-center gap-3">
        <FilterChips
          options={[...STATUS_FILTER_OPTIONS]}
          value={filters.status}
          onChange={(value) =>
            updateParams({ status: value === "all" ? "" : value })
          }
          className="min-w-0 flex-1"
        />
        <SortSelect
          options={[...SORT_OPTIONS]}
          value={filters.sort}
          onChange={(value) =>
            updateParams({ sort: value === "newest" ? "" : value })
          }
        />
      </div>
    </div>
  );
}
