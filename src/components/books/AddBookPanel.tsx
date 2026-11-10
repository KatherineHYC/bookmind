"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReadingStatusPicker from "./ReadingStatusPicker";
import AddedBookToast from "./AddedBookToast";
import { addBook } from "@/app/actions/books";
import { addBookPath } from "@/lib/note-origin";
import type { Book, ReadingStatus } from "@/types/book";

const LIBRARY_PATH = "/books";

interface AddBookPanelProps {
  book: Book;
  isAdded: boolean;
}

export default function AddBookPanel({ book, isAdded }: AddBookPanelProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ReadingStatus>("want_to_read");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isAdded) {
    return (
      <p className="flex h-12 items-center justify-center gap-1.5 rounded-full bg-muted text-base text-muted-foreground">
        <Check className="size-4" aria-hidden />
        已在你的書單中
      </p>
    );
  }

  function handleAdd() {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const result = await addBook({
          googleBooksId: book.googleBooksId,
          title: book.title,
          authors: book.authors,
          coverUrl: book.coverUrl,
          isbn13: book.isbn13,
          publisher: book.publisher || null,
          publishedDate: book.publishedDate || null,
          status,
        });

        if ("error" in result) {
          setErrorMessage(result.error);
          return;
        }

        // toast 掛在根 layout，先呼叫再換頁也會留在畫面上
        toast.success(
          <AddedBookToast title={book.title} duplicate={result.duplicate} />,
          {
            id: "book-added",
            action: {
              label: "繼續新增",
              onClick: () => router.push(addBookPath()),
            },
          },
        );

        // 在 transition 裡換頁，按鈕會維持載入中直到藏書頁渲染完成
        // 書本來就在書單中時不帶 added：它不會排在第一張，不播進場動畫
        router.push(
          result.duplicate
            ? LIBRARY_PATH
            : `${LIBRARY_PATH}?added=${result.id}`,
        );
      } catch {
        setErrorMessage("連線失敗，請再試一次");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <ReadingStatusPicker
        value={status}
        onChange={setStatus}
        disabled={isPending}
      />

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleAdd}
          disabled={isPending}
          aria-label={isPending ? "加入中" : undefined}
          className={cn(
            "h-12 w-full text-base disabled:opacity-100",
            "duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-8px_rgb(48_68_48/0.55)]",
            "motion-reduce:hover:translate-y-0",
          )}
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" aria-hidden />
          ) : errorMessage ? (
            "重試"
          ) : (
            "加入書單"
          )}
        </Button>

        {errorMessage && (
          <p role="alert" className="text-center text-sm text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
