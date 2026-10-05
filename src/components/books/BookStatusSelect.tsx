"use client";

import { useOptimistic, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBookStatus } from "@/app/actions/books";
import { READING_STATUSES, STATUS_CONFIG } from "@/lib/book-status";
import { cn } from "@/lib/utils";
import type { ReadingStatus } from "@/types/book";

// 否則它只會印出原始的值 "reading"。
const STATUS_ITEMS = READING_STATUSES.map((value) => ({
  value,
  label: STATUS_CONFIG[value].label,
}));

interface BookStatusSelectProps {
  bookId: string;
  status: ReadingStatus;
}

// 閱讀狀態下拉選單：選了立刻換色，背景再去更新資料庫
export default function BookStatusSelect({
  bookId,
  status,
}: BookStatusSelectProps) {
  // useOptimistic 是「先上一份試吃的」：在 transition 進行的期間暫時顯示新值，
  // transition 一結束就自動丟掉試吃品，改回 props 的值——
  // 成功時 props 已經是新狀態（畫面不變），失敗時 props 還是舊狀態（自動退回），不用自己寫還原邏輯。
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleChange(nextStatus: ReadingStatus | null) {
    if (!nextStatus || nextStatus === optimisticStatus) return;

    setErrorMessage(null);

    startTransition(async () => {
      setOptimisticStatus(nextStatus);

      try {
        const result = await updateBookStatus(bookId, nextStatus);
        if (result.error) setErrorMessage(result.error);
      } catch {
        setErrorMessage("連線失敗，請再試一次");
      }
    });
  }

  return (
    <div>
      <Select
        items={STATUS_ITEMS}
        value={optimisticStatus}
        onValueChange={handleChange}
      >
        <SelectTrigger
          aria-label="閱讀狀態"
          aria-busy={isPending}
          className={cn("px-4", STATUS_CONFIG[optimisticStatus].className)}
        >
          <SelectValue />
        </SelectTrigger>

        {/* 選單從按鈕下方展開、靠左對齊（預設是把選中的項目疊在按鈕上） */}
        <SelectContent alignItemWithTrigger={false} align="start">
          {STATUS_ITEMS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  STATUS_CONFIG[item.value].dotClassName,
                )}
                aria-hidden
              />
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {errorMessage && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
