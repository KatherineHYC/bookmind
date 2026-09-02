import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FABProps {
  href: string;
  label: string; // 螢幕閱讀器用
  icon?: React.ReactNode;
  className?: string;
}

export default function FAB({ href, label, icon, className }: FABProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "fixed right-5 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90",
        "bottom-[calc(4rem+env(safe-area-inset-bottom)+1rem)]",
        className,
      )}
    >
      {icon ?? <Plus className="size-6" />}
    </Link>
  );
}
