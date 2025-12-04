import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import LearningSection from "@/components/LearningSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <LearningSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
