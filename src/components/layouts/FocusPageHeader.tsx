import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "./Container";

interface FocusPageHeaderProps {
  title: string;
  description?: string;
  backHref: string;
}

export default function FocusPageHeader({
  title,
  description,
  backHref,
}: FocusPageHeaderProps) {
  return (
    <header className="pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-4">
      <Container>
        <Button
          render={<Link href={backHref} replace />}
          nativeButton={false}
          variant="ghost"
          size="icon"
          aria-label="返回"
          className="-ml-3 size-11"
        >
          <ChevronLeft className="size-6" />
        </Button>

        <h1 className="mt-2 text-3xl font-semibold text-primary md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm/relaxed text-foreground">{description}</p>
        )}
      </Container>
    </header>
  );
}
