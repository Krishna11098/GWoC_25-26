import HeroSection from "@/components/HeroSection";
import Subheading from "@/components/Subheading";
import ProofOfJoy from "@/components/ProofOfJoy";
import ScrollAnimation from "@/components/ScrollAnimation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";

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
    </>
  );
}
