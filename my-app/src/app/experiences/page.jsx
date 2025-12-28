import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ExperiencesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 py-10 mt-20">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground-2)]">Experiences</h1>
        <p className="mt-3 text-slate-700">Explore our curated experiences. Blog coming soon.</p>

        <div className="mt-6">
          <Link href="/experiences/blog" className="inline-block rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800">
            Go to Experiences Blog
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
