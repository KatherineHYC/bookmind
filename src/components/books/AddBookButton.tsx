"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addBook } from "@/app/actions/books";
import { cn } from "@/lib/utils";
import type { Book } from "@/types/book";

interface AddBookButtonProps {
  book: Book;
  isAdded: boolean;
  variant?: "compact" | "full";
}

// 加入書單的操作區：加入 → 加入中 → 已加入（失敗時顯示重試）
export default function AddBookButton({
  book,
  isAdded,
  variant = "compact",
}: AddBookButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFull = variant === "full";

  if (isAdded) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center bg-muted text-muted-foreground",
          isFull
            ? "h-12 w-full justify-center gap-1.5 rounded-full text-base"
            : "h-11 gap-1 rounded-lg px-3 text-sm",
        )}
      >
        <Check className="size-4" aria-hidden />
        {isFull ? "已加入書單" : "已加入"}
      </span>
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
        });

        if (result.error) setErrorMessage(result.error);
      } catch {
        setErrorMessage("連線失敗，請再試一次");
      }
    });
  }

  const idleLabel = isFull ? "加入書單" : "加入";

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col",
        isFull ? "w-full gap-2" : "items-end gap-1",
      )}
    >
      <Button
        onClick={handleAdd}
        disabled={isPending}
        aria-label={isPending ? "加入中" : `加入《${book.title}》`}
        className={cn(
          "disabled:opacity-100",
          isFull ? "h-12 w-full text-base" : "h-11 min-w-16 rounded-lg px-4",
        )}
      >
        {isPending ? (
          <Loader2 className="size-5 animate-spin" aria-hidden />
        ) : errorMessage ? (
          "重試"
        ) : (
          idleLabel
        )}
      </Button>

      {errorMessage && (
        <p
          role="alert"
          className={cn(
            "text-destructive",
            isFull ? "text-center text-sm" : "max-w-24 text-right text-xs/4",
          )}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
