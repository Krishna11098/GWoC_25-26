import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const DETAILS_BY_ID = {
  "murder-mystery": {
    title: "Murder Mystery Evening",
    heroImage: "/gallery/Blog/Murder%20Mystery.webp",
    intro:
      "An immersive whodunit experience with actors, clues, and team-based detective work.",
    summary:
      "Teams compete to solve a custom casefile, promoting collaboration and critical thinking.",
    highlightsTitle: "Event Highlights",
    logistics: [
      "Teams of 3-5 detectives",
      "Custom case files and props",
      "Facilitator-led briefing and debrief",
    ],
    whyLoveTitle: "Why groups love this:",
    whyLovePoints: [
      "Highly engaging format",
      "Encourages authentic collaboration",
      "Scales to large groups",
    ],
    formatTitle: "Format",
    formatPoints: [
      "Custom story, no tech required",
      "Flexible duration (60-90 mins)",
    ],
    trendsTitle: "Who it's for",
    trendsPoints: ["Corporate off-sites", "Birthday parties", "Community events"],
    contactTitle: "Book this experience",
    contactPoints: [
      "Available across multiple cities",
      "Custom themes on request",
    ],
    email: "joyjuncture@gmail.com",
  },
  "team-escape": {
    title: "Team Escape Challenge",
    heroImage: "/gallery/experiences/team-escape.jpg",
    intro: "A collaborative escape-room style challenge designed for teams.",
    summary: "Solve puzzles together under time pressure to build trust and teamwork.",
    highlightsTitle: "How it works",
    logistics: ["Puzzle stations", "Timed rounds", "Facilitator hints"],
    whyLoveTitle: "Benefits",
    whyLovePoints: ["Problem-solving", "Cross-team communication", "Fun competition"],
    formatTitle: "Setup",
    formatPoints: ["Modular stations", "Indoor/outdoor options"],
    trendsTitle: "Great for",
    trendsPoints: ["Corporate retreats", "Team-building days"],
    contactTitle: "Book us",
    contactPoints: ["Custom difficulty levels", "Multiple team support"],
    email: "joyjuncture@gmail.com",
  },
  "kit-jan": {
    title: "Monthly Engagement Kit - January",
    heroImage: "/gallery/experiences/kit-jan.jpg",
    intro: "A curated kit sent to employees with activities and goodies for team engagement.",
    summary: "Reusable modules and play prompts for remote and hybrid teams.",
    highlightsTitle: "Kit contents",
    logistics: ["Printed activities", "Digital instructions", "Themed goodies"],
    whyLoveTitle: "Why choose kits",
    whyLovePoints: ["Low-effort engagement", "Scales to distributed teams"],
    formatTitle: "Delivery",
    formatPoints: ["Bulk shipping", "Custom branding"],
    trendsTitle: "Used by",
    trendsPoints: ["HR teams", "Employee experience managers"],
    contactTitle: "Order a kit",
    contactPoints: ["Subscription options available"],
    email: "joyjuncture@gmail.com",
  },
  "carnival-zone": {
    title: "Carnival Pop-up Zone",
    heroImage: "/gallery/experiences/carnival.jpg",
    intro: "A pop-up carnival zone with games, stalls and live entertainers.",
    summary: "Custom layouts for festivals, malls, and corporate carnivals.",
    highlightsTitle: "What's included",
    logistics: ["Stalls & games", "Staffing", "Themed decor"],
    whyLoveTitle: "Perfect for",
    whyLovePoints: ["Public events", "Campus festivals"],
    formatTitle: "Scale",
    formatPoints: ["Modular zones", "Walkthrough experiences"],
    trendsTitle: "Audience",
    trendsPoints: ["Families", "Large gatherings"],
    contactTitle: "Enquire",
    contactPoints: ["Full event management"],
    email: "joyjuncture@gmail.com",
  },
  "wedding-hamper": {
    title: "Wedding Entertainment Hamper",
    heroImage: "/gallery/experiences/wedding-hamper.jpg",
    intro: "Bespoke entertainment hampers to delight wedding guests.",
    summary: "Curated activities and keepsakes for wedding celebrations.",
    highlightsTitle: "Includes",
    logistics: ["Custom game kits", "Guest engagement prompts"],
    whyLoveTitle: "Benefits",
    whyLovePoints: ["Memorable guest experiences", "Personalisation options"],
    formatTitle: "Presentation",
    formatPoints: ["Gift-ready packaging"],
    trendsTitle: "Great for",
    trendsPoints: ["Weddings", "Receptions"],
    contactTitle: "Order",
    contactPoints: ["Lead times apply"],
    email: "joyjuncture@gmail.com",
  },
};

export default async function EventStoryPage({ params }) {
  const resolvedParams = await params;
  const id = Array.isArray(resolvedParams?.id) ? resolvedParams.id.join("/") : (resolvedParams?.id || "");
  const normalized = id.replace(/\/+$/, "");

  const data = DETAILS_BY_ID[normalized];
  if (!data) {
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

  const cards = [
    {
      content: (
        <div className="flex flex-col md:flex-row gap-6 items-start h-full">
          <div className="rounded-3xl overflow-hidden bg-slate-100 w-full md:w-[360px] flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.heroImage} alt={data.title} className="w-full h-auto object-cover" />
          </div>
          <div className="flex-1 space-y-4 text-slate-800 text-base md:text-lg leading-relaxed">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{data.title}</h1>
            <p>{data.intro}</p>
            <p>{data.summary}</p>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{data.highlightsTitle}</h2>
          <ul className="space-y-3 text-slate-700 text-lg">
            {data.logistics.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-emerald-600 mr-3 text-2xl">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{data.whyLoveTitle}</h2>
          <ul className="space-y-3 text-slate-700 text-lg">
            {data.whyLovePoints.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-emerald-600 mr-3 text-2xl">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{data.contactTitle}</h2>
          <ul className="space-y-3 text-slate-700 text-lg">
            {data.contactPoints.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-emerald-600 mr-3 text-2xl">📍</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
            <p className="text-slate-800 text-lg font-medium">📩 To book or enquire, contact us</p>
            <a href={`mailto:${data.email}`} className="mt-3 inline-block text-emerald-600 hover:text-emerald-700 font-bold text-xl">{data.email}</a>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Want more experiences?</h2>
            <p className="text-slate-700 text-xl max-w-2xl">Explore other events and stories from Joy Juncture.</p>
          </div>
          <div className="space-y-4">
            <Link href="/experiences/events" className="inline-block px-8 py-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 font-medium text-lg transition-colors">← Back to Events</Link>
            <div>
              <Link href="/" className="inline-block px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 font-medium text-lg transition-colors">Home</Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 py-10 mt-20">
        {cards.map((card, i) => (
          <section key={i} className="mb-10">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 border border-slate-200">
              {card.content}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}

export function generateStaticParams() {
  return Object.keys(DETAILS_BY_ID).map((id) => ({ id }));
}
