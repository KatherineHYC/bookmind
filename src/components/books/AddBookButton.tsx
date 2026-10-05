"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addBook } from "@/app/actions/books";
import type { Book } from "@/types/book";

interface AddBookButtonProps {
  book: Book;
  isAdded: boolean;
}

// 搜尋結果卡右側的操作區：加入 → 加入中 → 已加入（失敗時顯示重試）
export default function AddBookButton({ book, isAdded }: AddBookButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isAdded) {
    return (
      <span className="inline-flex h-11 shrink-0 items-center gap-1 rounded-lg bg-muted px-3 text-sm text-muted-foreground">
        <Check className="size-4" aria-hidden />
        已加入
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

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <Button
        onClick={handleAdd}
        disabled={isPending}
        aria-label={isPending ? "加入中" : `加入《${book.title}》`}
        className="h-11 min-w-16 rounded-lg px-4 disabled:opacity-100"
      >
        {isPending ? (
          <Loader2 className="size-5 animate-spin" aria-hidden />
        ) : errorMessage ? (
          "重試"
        ) : (
          "加入"
        )}
      </Button>

      {errorMessage && (
        <p
          role="alert"
          className="max-w-24 text-right text-xs/4 text-destructive"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
