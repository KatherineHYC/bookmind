"use client";

import { useState, useTransition } from "react";
import ConfirmDialog from "@/components/features/ConfirmDialog";
import { deleteNoteInPlace } from "@/app/actions/notes";

interface DeleteNoteDialogProps {
  noteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 書籍詳情頁的刪除筆記確認框：開關由外層決定，刪完留在原頁面
export default function DeleteNoteDialog({
  noteId,
  open,
  onOpenChange,
}: DeleteNoteDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;

    onOpenChange(nextOpen);
    if (!nextOpen) setErrorMessage(null);
  }

  function handleConfirm() {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const result = await deleteNoteInPlace(noteId);
        if (result?.error) setErrorMessage(result.error);
      } catch {
        setErrorMessage("連線失敗，請再試一次");
      }
    });
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="刪除這則筆記？"
      description="刪除後無法復原。"
      confirmLabel={isPending ? "刪除中…" : "刪除"}
      destructive
      isPending={isPending}
      errorMessage={errorMessage}
      onConfirm={handleConfirm}
    />
  );
}
