"use client";

import { useRef, useState } from "react";
import type { MouseEvent, PointerEvent, ReactNode } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { noteEditPath } from "@/lib/note-origin";
import DeleteNoteDialog from "./DeleteNoteDialog";
import { useSwipeGroup } from "./SwipeGroup";

const ACTIONS_WIDTH = 144;
const DIRECTION_THRESHOLD = 8;

type Gesture = "idle" | "pending" | "swiping" | "scrolling";

interface SwipeableNoteCardProps {
  noteId: string;
  children: ReactNode;
}

// 觸控裝置上可向左滑、露出「編輯」「刪除」的筆記卡外框
export default function SwipeableNoteCard({
  noteId,
  children,
}: SwipeableNoteCardProps) {
  const { openId, setOpenId } = useSwipeGroup();
  const isOpen = openId === noteId;

  // 拖曳中的位移；null 代表沒在拖，位置由 isOpen 決定
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const gestureRef = useRef<Gesture>("idle");
  const startRef = useRef({ x: 0, y: 0, offset: 0 });
  const offsetRef = useRef(0);
  const didSwipeRef = useRef(false);

  const restingOffset = isOpen ? -ACTIONS_WIDTH : 0;
  const offset = dragOffset ?? restingOffset;
  const isDragging = dragOffset !== null;

  function resetGesture() {
    gestureRef.current = "idle";
    setDragOffset(null);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    // 滑鼠不接手：桌機用三點選單
    if (event.pointerType === "mouse") return;

    gestureRef.current = "pending";
    didSwipeRef.current = false;
    startRef.current = {
      x: event.clientX,
      y: event.clientY,
      offset: restingOffset,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (gesture === "idle" || gesture === "scrolling") return;

    const dx = event.clientX - startRef.current.x;
    const dy = event.clientY - startRef.current.y;

    if (gesture === "pending") {
      // 移動太小，還看不出方向
      if (
        Math.abs(dx) < DIRECTION_THRESHOLD &&
        Math.abs(dy) < DIRECTION_THRESHOLD
      ) {
        return;
      }

      if (Math.abs(dy) >= Math.abs(dx)) {
        gestureRef.current = "scrolling";
        return;
      }

      gestureRef.current = "swiping";
      didSwipeRef.current = true;
      // 手指滑出卡片範圍也繼續收到事件
      event.currentTarget.setPointerCapture(event.pointerId);
      // 開始滑這張，就先收起別張
      if (openId !== null && !isOpen) setOpenId(null);
    }

    // 卡片只能在「完全收起（0）」到「完全打開（-ACTIONS_WIDTH）」之間移動
    const next = Math.min(
      0,
      Math.max(-ACTIONS_WIDTH, startRef.current.offset + dx),
    );
    offsetRef.current = next;
    setDragOffset(next);
  }

  function handlePointerUp() {
    if (gestureRef.current === "swiping") {
      // 放開時超過一半就停在打開位置，否則彈回
      if (offsetRef.current < -ACTIONS_WIDTH / 2) {
        setOpenId(noteId);
      } else if (isOpen) {
        setOpenId(null);
      }
    }
    resetGesture();
  }

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    const shouldBlock = didSwipeRef.current || openId !== null;
    if (!shouldBlock) return;

    event.preventDefault();
    event.stopPropagation();
    didSwipeRef.current = false;

    // 有卡片打開時，這次點擊只負責收起
    if (openId !== null && gestureRef.current === "idle") setOpenId(null);
  }

  function handleDeleteClick() {
    setOpenId(null);
    setIsConfirmOpen(true);
  }

  return (
    <div data-swipe-card className="relative overflow-hidden rounded-lg">
      <div
        inert={!isOpen}
        style={{ width: ACTIONS_WIDTH }}
        className={cn(
          "absolute inset-y-0 right-0 flex gap-2 pl-2",
          offset === 0 && "invisible",
        )}
      >
        <Link
          href={noteEditPath(noteId, "book")}
          className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg bg-muted text-xs font-medium text-foreground"
        >
          <Pencil className="size-5" aria-hidden />
          編輯
        </Link>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg bg-destructive text-xs font-medium text-destructive-foreground"
        >
          <Trash2 className="size-5" aria-hidden />
          刪除
        </button>
      </div>

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={resetGesture}
        onClickCapture={handleClickCapture}
        style={{ transform: `translateX(${offset}px)` }}
        className={cn(
          "relative touch-pan-y pointer-coarse:select-none",
          !isDragging &&
            "transition-transform duration-200 ease-out motion-reduce:transition-none",
        )}
      >
        {children}
      </div>

      <DeleteNoteDialog
        noteId={noteId}
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
      />
    </div>
  );
}
