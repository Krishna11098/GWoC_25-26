import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { db } from "@/lib/firebaseAdmin";

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
      <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 py-10 mt-20 space-y-10">
        <section className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 border border-slate-200">
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
          <section key={i} className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 border border-slate-200">
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

        <section className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 border border-slate-200">
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
      <Footer />
    </>
  );
}

function notFoundView() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 py-10 mt-20">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Story coming soon</h1>
        <p className="mt-2 text-slate-700">We&apos;re crafting this experience. Check back shortly.</p>
        <div className="mt-6">
          <Link href="/experiences/events" className="text-emerald-600 hover:text-emerald-700 font-medium">Back to events</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
