import Image from "next/image";
import quoteIllustration from "@/assets/illustrations/deco-quote.webp";

export default function QuoteSection() {
  return (
    <section className="isolate bg-surface-sand">
      <div className="mx-auto flex w-full max-w-md items-center gap-4 px-6 py-14">
        <Image
          src={quoteIllustration}
          alt=""
          sizes="112px"
          className="w-28 shrink-0"
        />

        <blockquote>
          <p className="text-base/loose text-secondary-foreground">
            「閱讀是一場與作者的對話，
            <br />
            而筆記，是與自己的對話。」
          </p>
        </blockquote>
      </div>
    </section>
  );
}
