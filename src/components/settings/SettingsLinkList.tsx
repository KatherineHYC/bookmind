import Link from "next/link";
import {
  ChevronRight,
  FileText,
  Info,
  MessageCircleMore,
  ShieldPlus,
  type LucideIcon,
} from "lucide-react";
import SettingsCard from "./SettingsCard";

const LINKS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/settings/feedback", label: "問題回報", icon: MessageCircleMore },
  { href: "/settings/privacy", label: "隱私政策", icon: ShieldPlus },
  { href: "/settings/terms", label: "使用條款", icon: FileText },
  { href: "/settings/about", label: "關於 BookMind", icon: Info },
];

// 「關於與支援」清單
export default function SettingsLinkList() {
  return (
    <section aria-labelledby="settings-support-heading">
      <h2
        id="settings-support-heading"
        className="mb-2 px-1 text-sm text-primary"
      >
        關於與支援
      </h2>
      <SettingsCard>
        <ul className="divide-y divide-border px-4">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="-mx-4 flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/50"
              >
                <Icon
                  className="size-5 shrink-0 text-muted-foreground"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span className="flex-1 text-sm">{label}</span>
                <ChevronRight
                  className="size-5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </SettingsCard>
    </section>
  );
}
