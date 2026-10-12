"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import BookCover from "./BookCover";
import AddBookPanel from "./AddBookPanel";
import type { Book } from "@/types/book";

interface BookPreviewSheetProps {
  book: Book | null;
  open: boolean;
  isAdded: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookPreviewSheet({
  book,
  open,
  isAdded,
  onOpenChange,
}: BookPreviewSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[90dvh] w-full max-w-md gap-0 overflow-y-auto rounded-t-3xl pb-[env(safe-area-inset-bottom)]"
      >
        {book && (
          <BookPreviewBody
            book={book}
            isAdded={isAdded}
            onAdded={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

interface BookPreviewBodyProps {
  book: Book;
  isAdded: boolean;
  onAdded: () => void;
}

function BookPreviewBody({ book, isAdded, onAdded }: BookPreviewBodyProps) {
  const year = book.publishedDate.slice(0, 4);

  // 沒有資料的欄位直接不顯示，不要出現一排「—」
  const details = [
    { label: "出版社", value: book.publisher },
    { label: "出版年", value: year },
    { label: "頁數", value: book.pageCount ? `${book.pageCount} 頁` : "" },
    { label: "ISBN", value: book.isbn13 ?? book.isbn10 ?? "" },
  ].filter((item) => item.value);

  return (
    <>
      <SheetHeader className="flex-row items-start gap-4 pt-8 pr-12">
        <div className="w-24 shrink-0">
          <BookCover coverUrl={book.coverUrl} title={book.title} size="sm" />
        </div>
        <div className="min-w-0 flex-1">
          <SheetTitle className="line-clamp-3 text-lg/7 font-semibold wrap-break-word">
            {book.title}
          </SheetTitle>
          <SheetDescription className="mt-1 text-sm wrap-break-word">
            {book.authors.join("、") || "作者不詳"}
          </SheetDescription>
        </div>
      </SheetHeader>

      <div className="flex flex-col gap-5 px-6">
        {details.length > 0 && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            {details.map((item) => (
              <div key={item.label} className="contents">
                <dt className="text-muted-foreground">{item.label}</dt>
                <dd className="wrap-break-word">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {book.description && (
          <section aria-label="簡介">
            <p className="line-clamp-6 text-sm/relaxed whitespace-pre-line text-muted-foreground">
              {book.description}
            </p>
          </section>
        )}
      </div>

      <div className="p-6">
        <AddBookPanel book={book} isAdded={isAdded} onAdded={onAdded} />
      </div>
    </>
  );
}
