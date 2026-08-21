import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import QuoteSection from "@/components/landing/QuoteSection";
import Footer from "@/components/layouts/Footer";

export default function Home() {
  return (
    <>
      <main className="bg-background">
        <HeroSection />
        <FeaturesSection />
        <QuoteSection />
      </main>
      <Footer />
    </>
  );
}
