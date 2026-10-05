import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "./Container";

interface FocusPageHeaderProps {
  backHref: string;
  // 沒有標題的情境：載入中、找不到資料
  title?: string;
  description?: string;
  // 右上角的操作區（例如書籍詳情頁的刪除按鈕）
  action?: React.ReactNode;
}

export default function FocusPageHeader({
  backHref,
  title,
  description,
  action,
}: FocusPageHeaderProps) {
  return (
    <header className="pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-4">
      <Container>
        <div className="flex items-center justify-between">
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

          {action}
        </div>

        {title && (
          <h1 className="mt-2 line-clamp-3 text-3xl font-semibold wrap-break-word text-primary md:text-4xl">
            {title}
          </h1>
        )}
        {description && (
          <p className="mt-2 text-sm/relaxed text-foreground">{description}</p>
        )}
      </Container>
    </header>
  );
}
