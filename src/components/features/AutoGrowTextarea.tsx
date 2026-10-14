"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// 會跟著內容自動長高的多行輸入框（不出現內部捲軸）
export default function AutoGrowTextarea({
  ref,
  onChange,
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  function resize() {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  // 第一次出現時就量一次：編輯模式預填內容、或切回摘錄時重新出現，高度才會正確
  useLayoutEffect(resize, []);

  function setRefs(el: HTMLTextAreaElement | null) {
    innerRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  }

  return (
    <textarea
      ref={setRefs}
      rows={1}
      onChange={(event) => {
        resize();
        onChange?.(event);
      }}
      className={cn("resize-none overflow-hidden", className)}
      {...props}
    />
  );
}
