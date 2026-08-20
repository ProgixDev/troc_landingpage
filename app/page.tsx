import Contact from "@/components/Contact";
import DepthSection from "@/components/DepthSection";
import DownloadCTA from "@/components/DownloadCTA";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import StatsCounter from "@/components/StatsCounter";

/**
 * Every section below the hero is wrapped in <DepthSection>: it rises from
 * below on a 3D plane as it enters, then recedes (scale + blur) as the next
 * one comes forward. The hero owns its own parallax, so it isn't wrapped.
 */
export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative">
        <Hero />

        <DepthSection id="features">
          <FeatureCards />
        </DepthSection>

        <DepthSection>
          <StatsCounter />
        </DepthSection>

        <DepthSection id="how-it-works">
          <HowItWorks />
        </DepthSection>

        <DepthSection id="pricing">
          <Pricing />
        </DepthSection>

        <DepthSection id="contact">
          <Contact />
        </DepthSection>

        {/* Last section: nothing follows it, so it never recedes. */}
        <DepthSection noExit>
          <DownloadCTA />
        </DepthSection>
      </main>

      <Footer />
    </>
  );
}
