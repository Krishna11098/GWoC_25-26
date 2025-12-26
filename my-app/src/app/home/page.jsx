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
      {/* <ParallaxSection speed={0.2}>
        <HeroSection />
      </ParallaxSection>
      <ParallaxSection speed={0.2}>
        <Subheading />
      </ParallaxSection>
      <ParallaxSection speed={0.2}>
        <ScrollAnimation />
      </ParallaxSection>
      <ParallaxSection speed={0.2}>
        <ProofOfJoy />
      </ParallaxSection>
      <ParallaxSection speed={0.2}>
        <Walletsystem />
      </ParallaxSection>
      <ParallaxSection speed={0.2}>
        <FAQ />
      </ParallaxSection> */}

      <FadeInSection yOffset={80}>
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
      </FadeInSection>
    </>
  );
}
