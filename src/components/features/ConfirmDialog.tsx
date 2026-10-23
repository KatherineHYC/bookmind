"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  // 標題上方的圓形 icon（選填）
  icon?: React.ReactNode;
  // 說明下方的灰色小字補充（選填）
  note?: string;
  // 按鈕下方的額外動作，例如「先匯出我的資料」（選填）
  footerExtra?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  // 確認後的動作正在執行：鎖住兩顆按鈕，避免重複送出
  isPending?: boolean;
  // 動作失敗時顯示在按鈕上方的錯誤訊息
  errorMessage?: string | null;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  note,
  footerExtra,
  confirmLabel = "確認",
  cancelLabel = "取消",
  destructive = false,
  isPending = false,
  errorMessage,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    // Esc 與點擊遮罩都會觸發 onOpenChange(false)，由元件自己處理
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {icon && (
            <AlertDialogMedia
              className={cn(
                destructive
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-primary",
              )}
            >
              {icon}
            </AlertDialogMedia>
          )}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
          {note && <p className="text-xs text-muted-foreground">{note}</p>}
          {errorMessage && (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isPending}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className={
              destructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : undefined
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>

        {footerExtra && (
          <div className="flex justify-center">{footerExtra}</div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
