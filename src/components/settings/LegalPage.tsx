import FocusPageHeader from "@/components/layouts/FocusPageHeader";
import Container from "@/components/layouts/Container";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

interface LegalPageProps {
  title: string;
  updatedAt: string;
  sections: LegalSection[];
}

// 隱私政策、使用條款共用的純文字排版
export default function LegalPage({
  title,
  updatedAt,
  sections,
}: LegalPageProps) {
  return (
    <>
      <FocusPageHeader backHref="/settings" title={title} />
      <Container className="pb-12 md:max-w-2xl lg:max-w-2xl">
        <p className="text-xs text-muted-foreground">最後更新：{updatedAt}</p>

        <div className="mt-4 divide-y divide-border">
          {sections.map((section, index) => (
            <section key={section.heading} className="py-6">
              <h2 className="text-lg font-semibold text-primary">
                {index + 1}. {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 font-sans text-sm/relaxed text-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
