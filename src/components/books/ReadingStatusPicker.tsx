"use client";

import { useId, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { READING_STATUSES, STATUS_CONFIG } from "@/lib/book-status";
import { cn } from "@/lib/utils";
import type { ReadingStatus } from "@/types/book";

interface ReadingStatusPickerProps {
  value: ReadingStatus;
  onChange: (status: ReadingStatus) => void;
  disabled?: boolean;
}

const THUMB_POSITION: Record<ReadingStatus, string> = {
  want_to_read: "translate-x-0",
  reading: "translate-x-full",
  completed: "translate-x-[200%]",
};

// 三選一的閱讀狀態滑動切換（想讀 / 正在閱讀 / 已完成）
export default function ReadingStatusPicker({
  value,
  onChange,
  disabled = false,
}: ReadingStatusPickerProps) {
  const name = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function pickFromPointer(clientX: number) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;

    const ratio = (clientX - rect.left) / rect.width;
    const index = Math.min(
      READING_STATUSES.length - 1,
      Math.max(0, Math.floor(ratio * READING_STATUSES.length)),
    );
    const next = READING_STATUSES[index];
    if (next && next !== value) onChange(next);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    pickFromPointer(event.clientX);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    pickFromPointer(event.clientX);
  }

  function handlePointerEnd() {
    setIsDragging(false);
  }

  return (
    <fieldset disabled={disabled} className="disabled:opacity-60">
      <legend className="mb-2 text-sm text-muted-foreground">
        要加到哪裡？
      </legend>

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className="relative grid touch-pan-y grid-cols-3 rounded-full bg-muted p-1 select-none"
      >
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-sage-deep shadow-sm",
            "transition-transform duration-300 ease-out motion-reduce:transition-none",
            THUMB_POSITION[value],
          )}
        />

        {READING_STATUSES.map((status) => {
          const isSelected = value === status;

          return (
            <label
              key={status}
              className={cn(
                "relative z-10 flex h-10 cursor-pointer items-center justify-center rounded-full text-sm",
                "transition-colors duration-300",
                "has-focus-visible:ring-3 has-focus-visible:ring-ring/30",
                isSelected
                  ? "font-medium text-primary-foreground"
                  : "text-secondary-foreground/70 hover:text-secondary-foreground",
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
