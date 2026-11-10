"use client";

import { Toaster } from "sonner";
import { CircleAlert, CircleCheck } from "lucide-react";

const BOTTOM_OFFSET = "calc(4rem + env(safe-area-inset-bottom) + 0.75rem)";

export default function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      offset={{ bottom: BOTTOM_OFFSET }}
      mobileOffset={{ bottom: BOTTOM_OFFSET, left: "1rem", right: "1rem" }}
      duration={3000}
      icons={{
        success: <CircleCheck className="size-5" aria-hidden />,
        error: <CircleAlert className="size-5 text-destructive" aria-hidden />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 font-sans text-sm shadow-lg",
          success: "bg-primary text-primary-foreground",
          error: "bg-muted text-muted-foreground",
          icon: "shrink-0",
          // min-w-0 讓長訊息可以在 flex 裡被壓縮，內層的 truncate 才會生效
          content: "min-w-0 flex-1",
          title: "min-w-0",
          actionButton:
            "shrink-0 cursor-pointer rounded-full bg-primary-foreground/15 px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors hover:bg-primary-foreground/25",
        },
      }}
    />
  );
}
