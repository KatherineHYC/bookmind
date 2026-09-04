import Image from "next/image";
import { BookOpen } from "lucide-react";

interface BookCoverProps {
  coverUrl: string | null;
  title: string;
}

export default function BookCover({ coverUrl, title }: BookCoverProps) {
  return (
    <div className="relative aspect-2/3 w-full overflow-hidden rounded-md bg-muted">
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={`《${title}》封面`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover"
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-2 p-3">
          <BookOpen
            className="size-7 text-muted-foreground/60"
            strokeWidth={1.5}
          />
          <span className="line-clamp-3 text-center text-xs/relaxed text-muted-foreground">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
