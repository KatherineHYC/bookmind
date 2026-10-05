"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
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
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
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
      </AlertDialogContent>
    </AlertDialog>
  );
}
