"use client";

import { useState } from "react";
import { FileText, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/features/ConfirmDialog";
import { useDataExport } from "./useDataExport";

interface ExportDataButtonProps {
  bookCount: number;
  noteCount: number;
}

// 「匯出我的資料」按鈕：先跳說明確認框，按「匯出」才真的開始整理
export default function ExportDataButton({
  bookCount,
  noteCount,
}: ExportDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isExporting, runExport } = useDataExport();

  // 筆記一定掛在某本書底下，所以「沒有書」就等於「什麼都沒有」
  const hasData = bookCount > 0;

  function handleOpenChange(nextOpen: boolean) {
    // 整理中不讓視窗被關掉（Esc、點遮罩都會走到這裡）
    if (isExporting) return;
    setIsOpen(nextOpen);
  }

  function handleConfirm() {
    // 成功或失敗都關掉確認框，結果交給 Toast 說
    runExport(() => setIsOpen(false));
  }

  return (
    <>
      <Button
        size="lg"
        className="mt-4 w-full"
        disabled={!hasData}
        onClick={() => setIsOpen(true)}
      >
        <Share aria-hidden />
        匯出我的資料
      </Button>
      {!hasData && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          還沒有書籍或筆記可以匯出
        </p>
      )}

      <ConfirmDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        icon={<FileText strokeWidth={1.5} aria-hidden />}
        title="匯出我的資料"
        description={`將 ${bookCount} 本書、${noteCount} 則筆記整理成一份 Markdown 檔（.md），可用任何筆記 app 開啟。`}
        note="匯出的檔案無法再匯回 BookMind。"
        confirmLabel={isExporting ? "整理中…" : "匯出"}
        isPending={isExporting}
        onConfirm={handleConfirm}
      />
    </>
  );
}
