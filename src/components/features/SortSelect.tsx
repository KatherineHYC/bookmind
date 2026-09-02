"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SortOption<T extends string> {
  value: T;
  label: string;
}

interface SortSelectProps<T extends string> {
  options: SortOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function SortSelect<T extends string>({
  options,
  value,
  onChange,
  className,
}: SortSelectProps<T>) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <select
        value={value}
        // 原生 select 的值一定是字串，這裡的斷言範圍限定在 options 內
        onChange={(e) => onChange(e.target.value as T)}
        aria-label="排序方式"
        className="h-11 appearance-none rounded-full border border-border bg-card pl-4 pr-9 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  );
}
