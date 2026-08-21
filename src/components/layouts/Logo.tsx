import Link from "next/link";
import { BookMarked } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 text-primary">
      <BookMarked className="size-5" />
      <span className="text-lg font-bold">BookMind</span>
    </Link>
  );
}
