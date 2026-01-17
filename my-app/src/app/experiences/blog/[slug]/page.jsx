import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import SoftWaveBackground from "@/components/SoftWaveBackground";

const DETAILS_BY_SLUG = {
  "murder-mystery-primarc-pecan-ho-mumbai": {
    title: "Murder Mystery Game Night at Primarc Pecan HO, Mumbai",
    heroImage: "/gallery/Blog/Murder%20Mystery.webp",
    intro:
      "When Primarc Pecan’s Head Office in Mumbai wanted to break the monotony of a regular workday and bring their teams together, they called Joy Juncture... your go-to creators of unforgettable corporate game experiences!",
    summary:
      "And what unfolded was one of the smartest, most engaging employee activities you can host in a workplace.",
    highlightsTitle: "100 Employees. 3 Murders. Endless Clues. Zero Boredom!",
    logistics: [
      "Everyone was divided into teams of 3",
      "Each team received a custom-designed Murder Mystery Case File",
      "The objective? Step into the shoes of detectives and crack The Bloody Inheritance, a thrilling case file created by Joy Juncture",
      "What followed was 75 minutes of pure brainwork… mixed with laughter, collaboration, and a whole lot of competitive energy.",
    ],
    whyLoveTitle: "Why companies love this activity:",
    whyLovePoints: [
      "Piecing together clues",
      "Debating motives",
      "Matching timelines",
      "Discussing evidence",
      "Working as detectives, not just colleagues",
      "Teams bonded naturally through curiosity and the thrill of cracking a case together",
    ],
    formatTitle: "What makes Joy Juncture’s Murder Mystery format unique?",
    formatPoints: [
      "Completely customisable case files",
      "Designed for corporate scale (30 people to 500+ people)",
      "Self-contained game, no tech setup needed",
      "Encourages participation from even the quietest employees",
      "Blends fun with intellectual challenge",
      "Perfect for team-building, off-sites, office celebrations, leadership meets, and employee onboarding",
    ],
    trendsTitle: "Why companies are searching for activities like this?",
    trendsPoints: [
      "Smart activities that stimulate thinking",
      "Interactive formats instead of passive entertainment",
      "Experiences that bring teams closer",
      "Unique alternatives to the usual quiz/antakshari/Tambola sessions",
      "Memorable events that create long-lasting conversations",
    ],
    contactTitle: "Looking to host a corporate Game Night?",
    contactPoints: [
      "Employee engagement activities in Mumbai, Pune, Delhi, or anywhere in India & abroad",
      "Team-building experiences",
      "Smart corporate games",
      "Large-group interactive events",
      "Unique corporate workshops",
    ],
    email: "joyjuncture@gmail.com",
  },
};

export default async function BlogDetailPage({ params }) {
  // In Next.js with React Compiler, props like `params` can be Promises
  const resolvedParams = await params;

  // Robustly handle slug from dynamic segment
  const slug = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug.join("/")
    : (resolvedParams?.slug || "");
  const normalizedSlug = slug.replace(/\/+$/, "");

  const data = DETAILS_BY_SLUG[normalizedSlug];
  if (!data) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 py-10 mt-20">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Story coming soon</h1>
          <p className="mt-2 text-slate-700">We&apos;re crafting this experience. Check back shortly.</p>
          <div className="mt-6">
            <Link href="/experiences/blog" className="text-emerald-600 hover:text-emerald-700 font-medium">Back to blog</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Build card deck for scroll animation
  const cards = [
    // Card 1: Hero with title, image, and intro
    {
      content: (
        <div className="flex flex-col md:flex-row gap-6 items-start h-full">
          <div className="rounded-3xl overflow-hidden bg-slate-100 w-full md:w-[360px] flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.heroImage}
              alt={data.title}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="flex-1 space-y-4 text-slate-800 text-base md:text-lg leading-relaxed">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{data.title}</h1>
            <p>{data.intro}</p>
            <p>{data.summary}</p>
          </div>
        </div>
      ),
    },
    // Card 2: Highlights
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
    // Card 3: Why companies love this
    {
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{data.whyLoveTitle}</h2>
          <p className="text-slate-700 text-lg">This wasn&apos;t your usual &quot;team-building activity.&quot; Employees found themselves:</p>
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
    // Card 4: Format unique
    {
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{data.formatTitle}</h2>
          <ul className="space-y-3 text-slate-700 text-lg">
            {data.formatPoints.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-emerald-600 mr-3 text-2xl">⭐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    // Card 5: Trends
    {
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{data.trendsTitle}</h2>
          <p className="text-slate-700 text-lg">Corporate teams today want:</p>
          <ul className="space-y-3 text-slate-700 text-lg">
            {data.trendsPoints.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-emerald-600 mr-3 text-2xl">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    // Card 6: Contact
    {
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{data.contactTitle}</h2>
          <p className="text-slate-700 text-lg">If your company is searching for:</p>
          <ul className="space-y-3 text-slate-700 text-lg">
            {data.contactPoints.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-emerald-600 mr-3 text-2xl">📍</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
            <p className="text-slate-800 text-lg font-medium">
              📩 To book a Murder Mystery Game Night or any custom corporate activity, contact Joy Juncture
            </p>
            <a 
              href={`mailto:${data.email}`} 
              className="mt-3 inline-block text-emerald-600 hover:text-emerald-700 font-bold text-xl"
            >
              {data.email}
            </a>
          </div>
        </div>
      ),
    },
    // Card 7: Back to blog
    {
      content: (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Ready to Experience Joy?
            </h2>
            <p className="text-slate-700 text-xl max-w-2xl">
              Explore more stories and discover what makes Joy Juncture the go-to creators of unforgettable experiences.
            </p>
          </div>
          <div className="space-y-4">
            <Link 
              href="/community/blog" 
              className="inline-block px-8 py-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 font-medium text-lg transition-colors"
            >
              ← Back to Blogs
            </Link>
            <div>
              <Link 
                href="/" 
                className="inline-block px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 font-medium text-lg transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="px-5 md:px-12 pt-10 pb-16 relative" style={{ backgroundColor: 'var(--bg)' }}>
        <SoftWaveBackground height="450px" className="pointer-events-none" />
        <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 relative z-10 mt-20 md:mt-30">
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
          {cards.map((card, i) => (
            <section key={i} className="mb-10">
              <div className="rounded-3xl overflow-hidden p-8 md:p-12 border-4 shadow-2xl -translate-y-2 transition-transform hover:translate-y-0" style={{ borderColor: 'var(--dark-teal)', backgroundColor: 'rgba(122, 184, 195, 0.08)' }}>
                {card.content}
              </div>
            </section>
          ))}
        </main>
      </div>
      <Footer />
    </>
  );
}

// Help Next.js pre-know valid slugs for this page
export function generateStaticParams() {
  return [
    { slug: "murder-mystery-primarc-pecan-ho-mumbai" },
  ];
}
