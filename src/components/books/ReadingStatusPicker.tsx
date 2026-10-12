"use client";

import { useId } from "react";
import { READING_STATUSES, STATUS_CONFIG } from "@/lib/book-status";
import { cn } from "@/lib/utils";
import type { ReadingStatus } from "@/types/book";

interface ReadingStatusPickerProps {
  value: ReadingStatus;
  onChange: (status: ReadingStatus) => void;
  disabled?: boolean;
}

// 三選一的閱讀狀態切換鈕（想讀 / 正在閱讀 / 已完成）
export default function ReadingStatusPicker({
  value,
  onChange,
  disabled = false,
}: ReadingStatusPickerProps) {
  const name = useId();

  return (
    <fieldset disabled={disabled}>
      <legend className="mb-2 text-sm text-muted-foreground">
        要加到哪裡？
      </legend>

      <div className="grid grid-cols-3 gap-1 rounded-full bg-muted p-1">
        {READING_STATUSES.map((status) => {
          const isSelected = value === status;

          return (
            <label
              key={status}
              className={cn(
                "flex h-10 cursor-pointer items-center justify-center rounded-full text-sm transition-colors",
                "has-focus-visible:ring-3 has-focus-visible:ring-ring/30",
                isSelected
                  ? cn("font-medium shadow-sm", STATUS_CONFIG[status].className)
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name={name}
                value={status}
                checked={isSelected}
                onChange={() => onChange(status)}
                className="sr-only"
              />
              {STATUS_CONFIG[status].label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
