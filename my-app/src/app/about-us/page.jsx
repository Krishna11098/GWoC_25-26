"use client";

import StoryHero from "@/components/AboutHero";
import StoryBlock from "@/components/AboutStoryBlock";
import PhilosophyScroll from "@/components/AboutPhilosophy";
import TeamStory from "@/components/AboutTeam";
import StoryEnd from "@/components/AboutEnd";
import StorySection from "@/components/AboutStorySection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AboutOrigin from "@/components/AboutOrigin";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <StoryHero />
        <PhilosophyScroll />
        <TeamStory />
        <AboutOrigin />
        <StoryEnd />
      </main>

      <Footer />
    </>
  );
}
