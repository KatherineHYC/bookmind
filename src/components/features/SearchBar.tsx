"use client";

import { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  defaultValue?: string;
  onSubmit: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  defaultValue = "",
  onSubmit,
  placeholder = "搜尋書名、作者或 ISBN",
  className,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const isComposingRef = useRef(false);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !isComposingRef.current) {
      onSubmit(value.trim());
    }
  }
  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />

      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => (isComposingRef.current = true)}
        onCompositionEnd={() => (isComposingRef.current = false)}
        placeholder={placeholder}
        className="h-11 rounded-full bg-muted pl-10 pr-10 [&::-webkit-search-cancel-button]:appearance-none"
      />

      {/* 有輸入內容才出現清除按鈕 */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            onSubmit("");
          }}
          aria-label="清除搜尋"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
