import HeroSection from "@/components/HeroSection";
import Subheading from "@/components/Subheading";
import ProofOfJoy from "@/components/ProofOfJoy";
import ScrollAnimation from "@/components/ScrollAnimation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import Walletsystem from "@/components/Walletsystem";
import ParallaxSection from "@/components/ParallaxSection";
import FadeInSection from "@/components/FadeInSection";
import CTASection from "@/components/CTASection";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <Subheading />
      <ScrollAnimation />
      <ProofOfJoy />
      <CTASection />
      <FAQ />
      <Footer />
      <BackToTop />

      {/* <FadeInSection yOffset={80}>
        <HeroSection />
      </FadeInSection>
      <FadeInSection yOffset={80}>
        <Subheading />
      </FadeInSection>
      <FadeInSection yOffset={80}>
        <ScrollAnimation />
      </FadeInSection>
      <FadeInSection yOffset={80}>
        <ProofOfJoy />
      </FadeInSection>
      <FadeInSection yOffset={80}>
        <Walletsystem />
      </FadeInSection>
      <FadeInSection yOffset={80}>
        <FAQ />
      </FadeInSection>
      <FadeInSection>
        <Footer/>
      </FadeInSection> */}
    </>
  );
}
