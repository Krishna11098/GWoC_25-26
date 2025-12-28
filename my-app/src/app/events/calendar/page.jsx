"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Calendar from "@/components/Calendar";

const palette = {
  background: "var(--color-background)",
  backgroundSoft: "var(--color-background-2)",
  foreground: "var(--color-foreground)",
  foregroundBold: "var(--color-foreground-2)",
  panel: "#dfeadf",
};

async function fetchEvents() {
  const response = await fetch("/api/events", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to load events from the server");
  }

  const payload = await response.json();
  return payload.events ?? [];
}

function parseEvents(events) {
  return events
    .map(event => {
      const dateValue = event.date ? new Date(event.date) : null;
      const isValidDate = dateValue instanceof Date && !Number.isNaN(dateValue.getTime());

      return {
        ...event,
        dateValue: isValidDate ? dateValue : null,
      };
    })
    .filter(event => event.dateValue !== null);
}

function formatDate(date) {
  if (!date) return "TBD";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatLongDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventsCalendarPage() {
  const [eventsFromDb, setEventsFromDb] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchEvents()
      .then(setEventsFromDb)
      .catch(error => setLoadError(error.message));
  }, []);

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedEvent(null), 420);
  };

  const handleEventClick = (event) => {
    const [startHours, startMinutes] = (event.eventStartTime || "09:00").split(":").map(Number);
    const duration = event.duration || 60;
    const endHours = startHours + Math.floor(duration / 60);
    const endMinutes = startMinutes + (duration % 60);
    const formatTime = (h, m) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    const timeString = `${formatTime(startHours, startMinutes)} - ${formatTime(endHours, endMinutes)}`;

    setSelectedEvent({
      ...event,
      date: event.dateValue,
      time: timeString,
      host: "Event Host",
      price: "Free entry",
    });
    setIsModalVisible(true);
  };

  const parsed = parseEvents(eventsFromDb);
  const now = new Date();

  const upcomingEvents = parsed
    .filter(event => event.dateValue >= now)
    .sort((a, b) => a.dateValue - b.dateValue);

  const previousEvents = parsed
    .filter(event => event.dateValue < now)
    .sort((a, b) => b.dateValue - a.dateValue);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 py-10 mt-32">
        <div className="flex flex-col gap-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-font">Events Calendar</h1>
            <p className="mt-2 mb-6 text-font/80">Browse dates and see events stored in the database.</p>
            {loadError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {loadError}
              </div>
            )}
            <Calendar events={eventsFromDb} />
          </div>

          <aside className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-foreground/20 shadow-lg p-5 bg-background-2 text-foreground">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-foreground">Upcoming Events</h2>
                  <span className="text-sm text-font-2">{upcomingEvents.length}</span>
                </div>
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-font-2">No upcoming events.</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((event, idx) => (
                      <div
                        key={event.id ?? idx}
                        onClick={() => handleEventClick(event)}
                        className="rounded-2xl border border-foreground px-4 py-3 shadow-sm flex items-center justify-between gap-3 bg-background hover:bg-foreground/10 transition-all cursor-pointer"
                      >
                        <div className="text-base font-bold truncate text-font-2">{event.title || "Untitled event"}</div>
                        <div className="text-sm font-semibold uppercase tracking-wide whitespace-nowrap text-foreground">
                          {formatDate(event.dateValue)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-foreground/20 shadow-lg p-5 bg-background-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-foreground">Previous Events</h2>
                  <span className="text-sm text-font-2">{previousEvents.length}</span>
                </div>
                {previousEvents.length === 0 ? (
                  <p className="text-sm text-slate-600">No previous events yet.</p>
                ) : (
                  <div className="space-y-3">
                    {previousEvents.slice(0, 5).map((event, idx) => (
                      <div
                        key={event.id ?? idx}
                        onClick={() => handleEventClick(event)}
                        className="rounded-2xl border border-foreground px-4 py-3 shadow-sm flex items-center justify-between gap-3 bg-background hover:bg-foreground/10 transition-all cursor-pointer"
                      >
                        <div className="text-base font-bold truncate text-font-2">{event.title || "Untitled event"}</div>
                        <div className="text-sm font-semibold uppercase tracking-wide whitespace-nowrap text-foreground">
                          {formatDate(event.dateValue)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-8 modal-shell">
          <div
            className={`absolute inset-0 bg-black/55 backdrop-blur-sm modal-overlay ${isModalVisible ? 'overlay-enter' : 'overlay-exit'}`}
            onClick={closeModal}
          />
          <div
            className={`relative max-w-3xl w-full rounded-[30px] border shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] overflow-hidden modal-card ${isModalVisible ? 'modal-enter' : 'modal-exit'}`}
            style={{
              background: "linear-gradient(180deg, #fbfbf5 0%, #f4f1e6 45%, #ede8db 100%)",
              borderColor: `${palette.foreground}1f`,
            }}
          >
            <div className="flex justify-between items-start gap-4 p-6 md:p-8">
              <div className="space-y-5 w-full" style={{ color: palette.foreground }}>
                <div className="flex items-center gap-3">
                  <div
                    className="inline-flex items-center px-4 py-2 rounded-full text-white shadow-lg text-sm font-semibold drop-shadow-md"
                    style={{ background: `linear-gradient(135deg, ${palette.foregroundBold}, ${palette.foreground})` }}
                  >
                    By: {selectedEvent.host || "Unknown"}
                  </div>
                </div>
                <h3
                  className="text-3xl md:text-4xl font-serif leading-tight"
                  style={{ color: palette.foregroundBold }}
                >
                  {selectedEvent.title}
                </h3>
                <hr style={{ borderColor: `${palette.foreground}26` }} />

                <div className="space-y-3" style={{ color: palette.foreground }}>
                  <div className="flex items-baseline gap-3 text-lg font-semibold" style={{ color: palette.foregroundBold }}>
                    <span role="img" aria-label="calendar">🗓️</span>
                    <span>Date:</span>
                    <span className="font-medium" style={{ color: palette.foreground }}>{formatLongDate(selectedEvent.date)}</span>
                  </div>
                  <div className="flex items-baseline gap-3 text-lg font-semibold" style={{ color: palette.foregroundBold }}>
                    <span role="img" aria-label="clock">⏱️</span>
                    <span>Time:</span>
                    <span className="font-medium" style={{ color: palette.foreground }}>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-baseline gap-3 text-lg font-semibold" style={{ color: palette.foregroundBold }}>
                    <span role="img" aria-label="location">📍</span>
                    <span>Location:</span>
                    <span className="font-medium" style={{ color: palette.foreground }}>{selectedEvent.location}</span>
                  </div>
                  {selectedEvent.price && (
                    <div className="flex items-baseline gap-3 text-lg font-semibold" style={{ color: palette.foregroundBold }}>
                      <span role="img" aria-label="price">💰</span>
                      <span>Price:</span>
                      <span className="font-medium" style={{ color: palette.foreground }}>{selectedEvent.price}</span>
                    </div>
                  )}
                  {selectedEvent.category && (
                    <div className="flex items-baseline gap-3 text-lg font-semibold" style={{ color: palette.foregroundBold }}>
                      <span role="img" aria-label="category">🎨</span>
                      <span>Category:</span>
                      <span className="font-medium" style={{ color: palette.foreground }}>{selectedEvent.category}</span>
                    </div>
                  )}
                </div>

                {selectedEvent.description && (
                  <div className="mt-6">
                    <div
                      className="rounded-2xl p-5 shadow-inner"
                      style={{
                        background: `${palette.background}d9`,
                        border: `1px solid ${palette.foreground}1f`,
                      }}
                    >
                      <p
                        className="text-lg font-semibold mb-2"
                        style={{ color: palette.foregroundBold }}
                      >
                        Description
                      </p>
                      <p
                        className="text-base leading-relaxed"
                        style={{ color: palette.foreground }}
                      >
                        {selectedEvent.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={closeModal}
                className="h-10 w-10 flex items-center justify-center rounded-full text-xl font-bold bg-[var(--color-background)]/70 hover:bg-[var(--color-background-2)]/80 border transition-all"
                style={{ color: palette.foregroundBold, borderColor: `${palette.foreground}26` }}
                aria-label="Close event details"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes overlayOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes boxIn {
          0% { opacity: 0; transform: translateY(24px) scale(0.95); }
          60% { opacity: 1; transform: translateY(6px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes boxOut { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(12px) scale(0.98); } }

        .modal-shell { perspective: 1600px; }
        .overlay-enter { animation: overlayIn 320ms ease-out forwards; }
        .overlay-exit { animation: overlayOut 220ms ease-in forwards; }
        .modal-enter { animation: boxIn 480ms cubic-bezier(0.22, 1, 0.36, 1) forwards; transform-origin: center; will-change: transform, opacity; }
        .modal-exit { animation: boxOut 340ms cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; transform-origin: center; will-change: transform, opacity; }
      `}</style>
    </>
  );
}
