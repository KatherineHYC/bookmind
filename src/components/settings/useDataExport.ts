import { useTransition } from "react";
import { toast } from "sonner";
import { exportData } from "@/app/actions/export";
import { downloadTextFile } from "@/lib/download-file";

const EXPORT_FAILED = "匯出失敗，請稍後再試";

export function useDataExport() {
  const [isExporting, startTransition] = useTransition();

  // onSettled：不管成功或失敗，結束後都會呼叫（用來關掉確認框）
  function runExport(onSettled?: () => void) {
    startTransition(async () => {
      try {
        const result = await exportData();

        if ("error" in result) {
          toast.error(result.error);
        } else {
          downloadTextFile(result.fileName, result.content, "text/markdown");
          toast.success(
            `已匯出 ${result.bookCount} 本書、${result.noteCount} 則筆記`,
          );
        }
      } catch {
        // 斷網、伺服器出錯等，連 action 都沒回來的情況
        toast.error(EXPORT_FAILED);
      } finally {
        onSettled?.();
      }
    });
  }

  return { isExporting, runExport };
}
