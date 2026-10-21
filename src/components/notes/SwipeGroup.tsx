"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface SwipeGroupValue {
  openId: string | null;
  setOpenId: (id: string | null) => void;
}

const SwipeGroupContext = createContext<SwipeGroupValue | null>(null);

export function useSwipeGroup() {
  const context = useContext(SwipeGroupContext);
  if (!context) {
    throw new Error("useSwipeGroup 必須放在 <SwipeGroup> 裡面使用");
  }
  return context;
}

export default function SwipeGroup({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (openId === null) return;

    function close() {
      setOpenId(null);
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Element &&
        event.target.closest("[data-swipe-card]")
      ) {
        return;
      }
      close();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("scroll", close, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", close);
    };
  }, [openId]);

  return (
    <SwipeGroupContext value={{ openId, setOpenId }}>
      {children}
    </SwipeGroupContext>
  );
}
