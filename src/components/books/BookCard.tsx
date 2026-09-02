"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { deleteBook, updateBookStatus } from "@/app/actions/books";
import type { BookListItem, ReadingStatus } from "@/types/book";

const STATUS_LABEL: Record<ReadingStatus, string> = {
  want_to_read: "想讀",
  reading: "正在讀",
  completed: "已讀",
};

interface BookCardProps {
  book: BookListItem;
}

export default function BookCard({ book }: BookCardProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleStatusChange(status: ReadingStatus) {
    setError(null);
    startTransition(async () => {
      const result = await updateBookStatus(book.id, status);
      if (result?.error) setError(result.error);
    });
  }

  function handleDelete() {
    if (!confirm(`確定要刪除《${book.title}》嗎？`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteBook(book.id);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex gap-3 border rounded-lg p-3 items-start">
      <div className="w-12 h-16 bg-gray-100 rounded shrink-0 overflow-hidden relative">
        {book.coverUrl && (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            sizes="48px"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{book.title}</p>
        <p className="text-xs text-gray-500 truncate">
          {book.authors.join("、") || "作者不詳"}
        </p>

        <select
          value={book.status}
          onChange={(e) => handleStatusChange(e.target.value as ReadingStatus)}
          disabled={isPending}
          className="mt-2 text-xs border rounded px-2 py-1"
        >
          {(Object.keys(STATUS_LABEL) as ReadingStatus[]).map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>

        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs text-gray-400 hover:text-red-600 shrink-0"
      >
        刪除
      </button>
    </div>
  );
}
