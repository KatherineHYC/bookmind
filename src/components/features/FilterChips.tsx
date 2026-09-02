"use client";

import { cn } from "@/lib/utils";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterChipsProps<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function FilterChips<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterChipsProps<T>) {
  return (
    // hide-scrollbar 在 globals.css，橫向捲動但不顯示捲軸
    <div
      role="group"
      className={cn("hide-scrollbar flex gap-2 overflow-x-auto", className)}
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-muted",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
