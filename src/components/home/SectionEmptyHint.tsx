import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionEmptyHintProps {
  message: string;
  linkLabel: string;
  href: string;
}

export default function SectionEmptyHint({
  message,
  linkLabel,
  href,
}: SectionEmptyHintProps) {
  return (
    <div className="rounded-lg border border-dashed border-border px-4 py-5 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Link
        href={href}
        className="mt-2 inline-flex items-center gap-0.5 text-sm text-primary underline-offset-4 hover:underline"
      >
        {linkLabel}
        <ChevronRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
