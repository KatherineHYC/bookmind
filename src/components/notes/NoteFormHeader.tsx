import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/layouts/Container";

interface NoteFormHeaderProps {
  title: string;
  onBack: () => void;
}

// 新增／編輯筆記頁的頁首
export default function NoteFormHeader({ title, onBack }: NoteFormHeaderProps) {
  return (
    <header className="pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-2">
      <Container className="flex items-center gap-1 md:max-w-2xl lg:max-w-2xl">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="返回"
          onClick={onBack}
          className="-ml-3 size-11"
        >
          <ChevronLeft className="size-6" />
        </Button>
        <h1 className="text-lg font-medium text-foreground">{title}</h1>
      </Container>
    </header>
  );
}
