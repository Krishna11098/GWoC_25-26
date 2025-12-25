import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Calendar from "@/components/Calendar";

const upcomingEvents = [
  {
    date: "Oct 6",
    title: "Joy Juncture Game Night",
    location: "Joy Juncture Lounge + Stream",
  },
];

const previousEvents = [
  {
    date: "Sep 21",
    title: "Arcade Clash Finals",
    location: "Retro Bay Arena",
  },
  {
    date: "Sep 14",
    title: "Speedrun Sunday",
    location: "Community Stream",
  },
  {
    date: "Aug 30",
    title: "Co-op Strategy Night",
    location: "Joy Juncture Lounge",
  },
  {
    date: "Aug 18",
    title: "Puzzle Sprint Meetup",
    location: "Tabletop Corner",
  },
  {
    date: "Jul 07",
    title: "Indie Spotlight Jam",
    location: "Indie Hub",
  },
];

export default function EventsCalendarPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 py-10 mt-20">
        <div className="flex flex-col gap-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground-2)]">Events Calendar</h1>
            <p className="mt-2 mb-6 text-slate-700">Browse dates; event integration can be added next.</p>
            <Calendar />
          </div>

          <aside className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl border shadow-lg bg-[#f6f7ed] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[var(--color-foreground-2)]">Upcoming Event</h2>
                  <span className="text-sm text-[var(--color-foreground)]">{upcomingEvents.length}</span>
                </div>
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-slate-600">No upcoming events.</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((event, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-[var(--color-foreground)]/15 bg-white px-4 py-3 shadow-sm flex items-center justify-between gap-3"
                      >
                        <div className="text-base font-bold text-slate-900 truncate">{event.title}</div>
                        <div className="text-sm font-semibold uppercase tracking-wide text-[var(--color-foreground-2)] whitespace-nowrap">
                          {event.date}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border shadow-lg bg-[#f6f7ed] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[var(--color-foreground-2)]">Previous Events</h2>
                  <span className="text-sm text-[var(--color-foreground)]">{previousEvents.length}</span>
                </div>
                <div className="space-y-3">
                  {previousEvents.slice(0, 5).map((event, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[var(--color-foreground)]/15 bg-white px-4 py-3 shadow-sm flex items-center justify-between gap-3"
                    >
                      <div className="text-base font-bold text-slate-900 truncate">{event.title}</div>
                      <div className="text-sm font-semibold uppercase tracking-wide text-[var(--color-foreground-2)] whitespace-nowrap">
                        {event.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
