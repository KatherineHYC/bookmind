import Image from "next/image";
import Container from "./Container";
import Logo from "./Logo";

const ILLUSTRATION_WIDTH = 400;
const ILLUSTRATION_HEIGHT = 300;
const ILLUSTRATION_SIZES = "(min-width: 768px) 256px, 160px";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  illustration?: string;
  decoration?: "green" | "brown";
}

export default function PageHeader({
  title,
  subtitle,
  illustration,
}: PageHeaderProps) {
  return (
    <header className="pt-8 pb-6">
      <Container>
        <Logo />

        <div className="mt-6 flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-4xl font-semibold text-primary md:text-5xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-3 whitespace-pre-line text-sm/loose text-foreground md:text-base/loose">
                {subtitle}
              </p>
            )}
          </div>

          <div className="-mr-6 w-40 shrink-0 md:w-64">
            {illustration ? (
              <Image
                src={illustration}
                alt=""
                width={ILLUSTRATION_WIDTH}
                height={ILLUSTRATION_HEIGHT}
                sizes={ILLUSTRATION_SIZES}
                priority
                className="h-auto w-full"
              />
            ) : (
              <div
                className="aspect-4/3 w-full rounded-lg bg-muted"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
