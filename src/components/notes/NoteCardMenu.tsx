"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteNoteDialog from "./DeleteNoteDialog";
import { noteEditPath } from "@/lib/note-origin";

// 書籍詳情頁筆記卡右上角的三點選單（只在滑鼠裝置出現）
export default function NoteCardMenu({ noteId }: { noteId: string }) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="筆記選項"
              className="absolute top-2 right-2 hidden size-9 text-muted-foreground pointer-fine:inline-flex"
            />
          }
        >
          <Ellipsis className="size-4" aria-hidden />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-auto min-w-32">
          <DropdownMenuItem
            onClick={() => router.push(noteEditPath(noteId, "book"))}
          >
            <Pencil aria-hidden />
            編輯
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsConfirmOpen(true)}
          >
            <Trash2 aria-hidden />
            刪除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteNoteDialog
        noteId={noteId}
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
      />
    </>
  );
}
