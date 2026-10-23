"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ChevronRight, Share, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/features/ConfirmDialog";
import SettingsCard from "./SettingsCard";
import { useDataExport } from "./useDataExport";
import { clearAllData } from "@/app/actions/profile";

const CLEAR_FAILED = "清除失敗，請稍後再試";

interface ClearDataCardProps {
  bookCount: number;
  noteCount: number;
}

// 「將刪除 12 本書、48 則筆記與個人設定」；數量是 0 的項目就不提
function buildDescription(bookCount: number, noteCount: number): string {
  const counted = [
    bookCount > 0 ? `${bookCount} 本書` : null,
    noteCount > 0 ? `${noteCount} 則筆記` : null,
  ].filter((part) => part !== null);

  const targets =
    counted.length > 0 ? `${counted.join("、")}與個人設定` : "個人設定";

  return `將刪除 ${targets}，且無法復原。`;
}

// 清除本機資料：整張卡就是按鈕，所以整張都是 Client Component
export default function ClearDataCard({
  bookCount,
  noteCount,
}: ClearDataCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClearing, startTransition] = useTransition();
  const { isExporting, runExport } = useDataExport();

  // 清除中或匯出中，確認框裡的按鈕都要鎖住
  const isBusy = isClearing || isExporting;

  function handleOpenChange(nextOpen: boolean) {
    if (isBusy) return;
    setIsOpen(nextOpen);
  }

  function handleConfirm() {
    startTransition(async () => {
      try {
        const result = await clearAllData();

        if ("error" in result) {
          toast.error(result.error);
        } else {
          // 成功後 action 裡的 revalidatePath 會讓整頁重新拿資料，卡片數字自動歸零
          toast.success("已清除所有資料");
        }
      } catch {
        toast.error(CLEAR_FAILED);
      } finally {
        setIsOpen(false);
      }
    });
  }

  return (
    <>
      <SettingsCard>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-colors hover:bg-muted/50"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Trash2 className="size-5" strokeWidth={1.5} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-destructive">
              清除本機資料
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">
              清除此裝置上的所有資料，無法復原
            </span>
          </span>
          <ChevronRight
            className="size-5 shrink-0 text-muted-foreground"
            aria-hidden
          />
        </button>
      </SettingsCard>

      <ConfirmDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        icon={<Trash2 strokeWidth={1.5} aria-hidden />}
        title="清除所有資料？"
        description={buildDescription(bookCount, noteCount)}
        confirmLabel={isClearing ? "清除中…" : "清除"}
        destructive
        isPending={isBusy}
        onConfirm={handleConfirm}
        footerExtra={
          // 沒有東西可匯出時，就不顯示這條逃生出口
          bookCount > 0 && (
            <Button
              variant="link"
              disabled={isBusy}
              onClick={() => runExport()}
              className="underline"
            >
              <Share aria-hidden />
              {isExporting ? "匯出中…" : "先匯出我的資料"}
            </Button>
          )
        }
      />
    </>
  );
}
