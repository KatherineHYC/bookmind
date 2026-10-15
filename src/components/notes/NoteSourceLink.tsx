import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import leafCorner from "@/assets/illustrations/deco-leaf-corner.webp";

interface NoteSourceLinkProps {
  bookId: string;
  bookTitle: string;
  bookAuthors: string[];
}

// 筆記詳情頁底部：「出自《書名》· 作者 ›」＋ 右下角葉子裝飾
export default function NoteSourceLink({
  bookId,
  bookTitle,
  bookAuthors,
}: NoteSourceLinkProps) {
  const authorText = bookAuthors.join("、");

  return (
    <footer className="mt-10">
      <hr className="border-border" />

      <Link
        href={`/books/${bookId}`}
        className="-mx-2 mt-2 flex min-h-11 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="min-w-0 flex-1 truncate">
          出自《{bookTitle}》{authorText && ` · ${authorText}`}
        </span>
        <ChevronRight className="size-4 shrink-0" aria-hidden />
      </Link>

      <div className="pointer-events-none -mr-6 flex justify-end" aria-hidden>
        <Image
          src={leafCorner}
          alt=""
          sizes="(min-width: 768px) 112px, 88px"
          className="h-auto w-22 md:w-28"
        />
      </div>
    </footer>
  );
}
