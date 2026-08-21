import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  return (
    <section className="isolate">
      <div className="mx-auto w-full max-w-md px-6 py-9 text-center">
        <h1 className="text-6xl/tight font-semibold text-primary">BookMind</h1>

        <h2 className="mt-7 whitespace-nowrap text-2xl/loose font-medium tracking-wider text-foreground">
          將字裡行間的靈感記錄下來
        </h2>

        <p className="mt-6 text-base/loose text-muted-foreground">
          一本書，一個想法，
          <br />
          都是你成長的養分。
        </p>

        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-8 h-12 px-10 text-sm",
          )}
        >
          開始記錄 →
        </Link>
      </div>
    </section>
  );
}
