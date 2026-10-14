"use client";

import { useId, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  legend: string;
  hideLegend?: boolean;
  disabled?: boolean;
  className?: string;
}

// 多選一的滑動切換：點選或按住拖曳都能切換，滑塊會跟著移動
export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  legend,
  hideLegend = false,
  disabled = false,
  className,
}: SegmentedControlProps<T>) {
  const name = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const count = options.length;
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  function pickFromPointer(clientX: number) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;

    const ratio = (clientX - rect.left) / rect.width;
    const index = Math.min(count - 1, Math.max(0, Math.floor(ratio * count)));
    const next = options[index]?.value;
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
    <fieldset
      disabled={disabled}
      className={cn("disabled:opacity-60", className)}
    >
      <legend
        className={cn(
          "mb-2 text-sm text-muted-foreground",
          hideLegend && "sr-only",
        )}
      >
        {legend}
      </legend>

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
        className="relative grid touch-pan-y rounded-full bg-muted p-1 select-none"
      >
        <span
          aria-hidden
          style={{
            width: `calc((100% - 0.5rem) / ${count})`,
            transform: `translateX(${selectedIndex * 100}%)`,
          }}
          className={cn(
            "absolute inset-y-1 left-1 rounded-full bg-sage-deep shadow-sm",
            "transition-transform duration-300 ease-out motion-reduce:transition-none",
          )}
        />

        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
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
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
