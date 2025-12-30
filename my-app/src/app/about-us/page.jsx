"use client";

import StoryHero from "@/components/AboutHero";
import StoryBlock from "@/components/AboutStoryBlock";
import PhilosophyScroll from "@/components/AboutPhilosophy";
import TeamStory from "@/components/AboutTeam";
import StoryEnd from "@/components/AboutEnd";
import StorySection from "@/components/AboutStorySection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <StorySection>
          <StoryHero />
          <div className="space-y-10">
            <StoryBlock
              title="No Grand Origin Story"
              bgColor="var(--color-pink)"
            >
              Honestly? There's no dramatic lifelong passion here—just two
              people who discovered they're great at creating chaos, laughter,
              and competitive tension.
            </StoryBlock>

            <StoryBlock
              title="The Wrong Family Business"
              bgColor="var(--color-orange)"
            >
              Textiles and electricals? Thrilling. But we chose confusion,
              creativity, and entrepreneurship instead. No roadmap. Just vibes.
            </StoryBlock>

            <StoryBlock
              title="From Random Ideas to Real Games"
              bgColor="var(--color-green)"
            >
              Somewhere between arguing over rules and laughing at bad
              strategies, Joy Juncture was born.
            </StoryBlock>
          </div>
        </StorySection>

        <PhilosophyScroll />
        <TeamStory />
        <StoryEnd />
      </main>

      <Footer />
    </>
  );
}
