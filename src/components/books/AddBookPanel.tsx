"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReadingStatusPicker from "./ReadingStatusPicker";
import { addBook } from "@/app/actions/books";
import type { Book, ReadingStatus } from "@/types/book";

interface AddBookPanelProps {
  book: Book;
  isAdded: boolean;
  onAdded?: () => void;
}

export default function AddBookPanel({
  book,
  isAdded,
  onAdded,
}: AddBookPanelProps) {
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

        if (result.error) {
          setErrorMessage(result.error);
          return;
        }

        onAdded?.();
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
