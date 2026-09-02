"use client";

import { useState } from "react";
import StatusBadge from "@/components/books/StatusBadge";
import { BookGridSkeleton } from "@/components/books/BookCardSkeleton";
import NoteTypeBadge from "@/components/notes/NoteTypeBadge";
import { NoteListSkeleton } from "@/components/notes/NoteCardSkeleton";
import EmptyState from "@/components/features/EmptyState";
import SearchBar from "@/components/features/SearchBar";
import FilterChips from "@/components/features/FilterChips";
import SortSelect from "@/components/features/SortSelect";
import ConfirmDialog from "@/components/features/ConfirmDialog";
import FAB from "@/components/layouts/FAB";
import { Button } from "@/components/ui/button";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-border py-8">
      <h2 className="mb-4 text-sm font-medium tracking-wider text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

const FILTER_OPTIONS = [
  { value: "all", label: "全部" },
  { value: "reading", label: "正在閱讀" },
  { value: "completed", label: "已完成" },
  { value: "want_to_read", label: "想讀" },
] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "最新新增" },
  { value: "title", label: "書名" },
] as const;

type FilterValue = (typeof FILTER_OPTIONS)[number]["value"];
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export default function DevUiClient() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [sort, setSort] = useState<SortValue>("newest");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastResult, setLastResult] = useState("尚未操作");

  return (
    <div className="mx-auto max-w-3xl px-6 pb-32 pt-8">
      <h1 className="text-2xl font-semibold text-primary">UI 元件驗收</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        僅限開發環境，正式站回傳 404
      </p>

      <Section title="StatusBadge">
        <div className="flex flex-wrap gap-3">
          <StatusBadge status="want_to_read" />
          <StatusBadge status="reading" />
          <StatusBadge status="completed" />
        </div>
      </Section>

      <Section title="NoteTypeBadge">
        <div className="flex flex-wrap gap-3">
          <NoteTypeBadge type="excerpt" />
          <NoteTypeBadge type="thought" />
        </div>
      </Section>

      <Section title="SearchBar">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="搜尋書名、作者或 ISBN"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          目前值：{query || "（空）"}
        </p>
      </Section>

      <Section title="FilterChips ＋ SortSelect">
        <div className="flex items-center gap-3">
          <FilterChips
            options={[...FILTER_OPTIONS]}
            value={filter}
            onChange={setFilter}
            className="flex-1"
          />
          <SortSelect
            options={[...SORT_OPTIONS]}
            value={sort}
            onChange={setSort}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          篩選：{filter}／排序：{sort}
        </p>
      </Section>

      <Section title="EmptyState（無按鈕）">
        <EmptyState title="沒有符合條件的書籍" description="換個關鍵字試試" />
      </Section>

      <Section title="EmptyState（有按鈕）">
        <EmptyState
          title="還沒有任何書籍"
          description="加入第一本書，開始你的閱讀紀錄"
          actionLabel="＋ 新增書籍"
          actionHref="/books"
        />
      </Section>

      <Section title="Skeleton：書籍 grid">
        <BookGridSkeleton count={3} />
      </Section>

      <Section title="Skeleton：筆記列表">
        <NoteListSkeleton count={2} />
      </Section>

      <Section title="ConfirmDialog">
        <Button variant="destructive" onClick={() => setDialogOpen(true)}>
          刪除書籍
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          最後結果：{lastResult}
        </p>

        <ConfirmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="確定要刪除這本書嗎？"
          description="這本書的所有筆記也會一併刪除，且無法復原。"
          confirmLabel="刪除"
          destructive
          onConfirm={() => setLastResult("已確認")}
          onCancel={() => setLastResult("已取消")}
        />
      </Section>

      <FAB href="/books" label="新增書籍" />
    </div>
  );
}
