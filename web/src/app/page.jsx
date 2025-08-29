import { Header } from "../components/Header/Header";
import { HeroSection } from "../components/HeroSection/HeroSection";
import { FeaturesSection } from "../components/FeaturesSection/FeaturesSection";
import { HowItWorksSection } from "../components/HowItWorksSection/HowItWorksSection";
import { CtaSection } from "../components/CtaSection/CtaSection";
import { Footer } from "../components/Footer/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
