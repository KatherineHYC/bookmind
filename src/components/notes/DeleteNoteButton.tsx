"use client";

import { useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/features/ConfirmDialog";
import { deleteNote } from "@/app/actions/notes";
import type { NoteOrigin } from "@/lib/note-origin";

interface DeleteNoteButtonProps {
  noteId: string;
  origin: NoteOrigin | null;
}

// 筆記詳情頁右上角的垃圾桶：按下先跳確認視窗，確認後才真的刪除
export default function DeleteNoteButton({
  noteId,
  origin,
}: DeleteNoteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    // 刪除進行中不讓視窗被關掉
    if (isPending) return;

    setIsOpen(nextOpen);
    if (!nextOpen) setErrorMessage(null);
  }

  function handleConfirm() {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const result = await deleteNote(noteId, origin);
        if (result?.error) setErrorMessage(result.error);
      } catch (error) {
        unstable_rethrow(error);
        setErrorMessage("連線失敗，請再試一次");
      }
    });
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="刪除這則筆記"
        className="size-11"
      >
        <Trash2 className="size-5" aria-hidden />
      </Button>

      <ConfirmDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        title="刪除這則筆記？"
        description="刪除後無法復原。"
        confirmLabel={isPending ? "刪除中…" : "刪除"}
        destructive
        isPending={isPending}
        errorMessage={errorMessage}
        onConfirm={handleConfirm}
      />
    </>
  );
}
