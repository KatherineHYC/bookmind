"use client";

import { useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/features/ConfirmDialog";
import { deleteBook } from "@/app/actions/books";

interface DeleteBookButtonProps {
  bookId: string;
  noteCount: number;
}

// 右上角的垃圾桶：按下先跳確認視窗，確認後才真的刪除
export default function DeleteBookButton({
  bookId,
  noteCount,
}: DeleteBookButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const description =
    noteCount > 0
      ? `這本書的 ${noteCount} 則筆記也會一併刪除，且無法復原。`
      : "刪除後無法復原。";

  function handleOpenChange(nextOpen: boolean) {
    // 刪除進行中不讓視窗被關掉（Esc、點遮罩都會走到這裡）
    if (isPending) return;

    setIsOpen(nextOpen);
    if (!nextOpen) setErrorMessage(null);
  }

  function handleConfirm() {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        // 成功時 Server Action 會直接 redirect 到 /books，所以走得到下一行就代表失敗了
        const result = await deleteBook(bookId);
        if (result?.error) setErrorMessage(result.error);
      } catch (error) {
        // 如果被這個 catch 吃掉，Next.js 就收不到「該換頁了」的訊號，還會誤顯示「連線失敗」。
        // unstable_rethrow 會認出 Next.js 自己的例外並原封不動丟回去；
        // 只有真正的錯誤（例如斷網）才會繼續往下走。
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
        aria-label="刪除這本書"
        className="-mr-3 size-11"
      >
        <Trash2 className="size-5" aria-hidden />
      </Button>

      <ConfirmDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        title="刪除這本書？"
        description={description}
        confirmLabel={isPending ? "刪除中…" : "刪除"}
        destructive
        isPending={isPending}
        errorMessage={errorMessage}
        onConfirm={handleConfirm}
      />
    </>
  );
}
