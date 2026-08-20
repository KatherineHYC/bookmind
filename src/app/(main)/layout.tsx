import BottomNav from "@/components/layouts/BottomNav";
import Footer from "@/components/layouts/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="pb-16">
        <main>{children}</main>
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
}
