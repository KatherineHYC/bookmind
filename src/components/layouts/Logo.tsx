import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 text-primary">
      <BookOpen className="size-5" />
      <span className="text-lg font-semibold">BookMind</span>
    </Link>
  );
}
