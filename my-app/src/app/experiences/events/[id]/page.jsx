import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { db } from "@/lib/firebaseAdmin";
import SoftWaveBackground from "@/components/SoftWaveBackground";

export default async function EventStoryPage({ params }) {
  const resolvedParams = await params;
  const id = Array.isArray(resolvedParams?.id) ? resolvedParams.id.join("/") : (resolvedParams?.id || "");
  const normalized = id.replace(/\/+$/, "");

  const doc = await db.collection("experiences").doc(normalized).get();
  if (!doc.exists) {
    return notFoundView();
  }
  const data = doc.data();
  if (!data?.isPublished) {
    return notFoundView();
  }

  const sections = Array.isArray(data.sections) ? data.sections : [];

  return (
    <>
      <Navbar />
      <div className="px-5 md:px-12 pt-10 pb-16 relative" style={{ backgroundColor: 'var(--bg)' }}>
        <SoftWaveBackground height="450px" className="pointer-events-none" />
        <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 relative z-10 mt-20 md:mt-30 space-y-10">
          <div className="mb-14 mt-4 text-center relative">
            <div className="inline-flex flex-col items-center gap-2">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
                <span className="text-black">Experience</span>{" "}
                <span className="relative inline-block text-dark-teal drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
                  Story
                </span>
              </h1>
              <div className="h-2 bg-dark-teal rounded-full mt-6 shadow-md w-[80px]" />
            </div>
          </div>
        <section className="rounded-3xl overflow-hidden p-8 md:p-12 border-4 shadow-2xl -translate-y-2 transition-transform hover:translate-y-0" style={{ borderColor: 'var(--dark-teal)', backgroundColor: 'rgba(122, 184, 195, 0.08)' }}>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="rounded-3xl overflow-hidden bg-slate-100 w-full md:w-[360px] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.coverImage} alt={data.title} className="w-full h-auto object-cover" />
            </div>
            <div className="flex-1 space-y-4 text-slate-800 text-base md:text-lg leading-relaxed">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{data.title}</h1>
              {data.excerpt && <p>{data.excerpt}</p>}
              {data.description && <p>{data.description}</p>}
            </div>
          </div>
        </section>

        {sections.map((section, i) => (
          <section key={i} className="rounded-3xl overflow-hidden p-8 md:p-12 border-4 shadow-2xl -translate-y-2 transition-transform hover:translate-y-0" style={{ borderColor: 'var(--dark-teal)', backgroundColor: 'rgba(122, 184, 195, 0.08)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {section.image && (
                <div className="rounded-3xl overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={section.image} alt={data.title || "Experience image"} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-3 text-slate-700 text-lg">
                {section.text && <p>{section.text}</p>}
              </div>
            </div>
          </section>
        ))}

        <section className="rounded-3xl overflow-hidden p-8 md:p-12 border-4 shadow-2xl -translate-y-2 transition-transform hover:translate-y-0" style={{ borderColor: 'var(--dark-teal)', backgroundColor: 'rgba(122, 184, 195, 0.08)' }}>
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Want more experiences?</h2>
              <p className="text-slate-700 text-lg">Explore other events and stories from Joy Juncture.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/experiences/events" className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 font-medium text-lg transition-colors">← Back to Events</Link>
              <Link href="/" className="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 font-medium text-lg transition-colors">Home</Link>
            </div>
          </div>
        </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

function notFoundView() {
  return (
    <>
      <Navbar />
      <div className="px-5 md:px-12 pt-10 pb-16 relative" style={{ backgroundColor: 'var(--bg)' }}>
        <SoftWaveBackground height="450px" className="pointer-events-none" />
        <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 relative z-10 mt-20 md:mt-30">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-dark-teal drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">Story coming soon</h1>
            <p className="mt-4 text-lg text-slate-700">We&apos;re crafting this experience. Check back shortly.</p>
            <div className="mt-8">
              <Link href="/experiences/events" className="inline-block px-6 py-3 bg-orange text-white rounded-full hover:opacity-90 font-medium transition-opacity">Back to events</Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
