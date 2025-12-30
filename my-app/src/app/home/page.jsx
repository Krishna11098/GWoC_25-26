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

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Subheading />
      <ScrollAnimation />
      <ProofOfJoy />
      <FAQ />
      <Footer />

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
