"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function CopyEmailButton({ email }: { email: string }) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("已複製信箱");
    } catch {
      toast.error("無法複製，請長按信箱手動複製");
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label="複製信箱"
      className="size-11 shrink-0"
    >
      <Copy className="size-5" />
    </Button>
  );
}
