"use client";

import { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventsCalendar from "@/components/Calendar";

import {
  Calendar as CalendarIcon,
  MapPin,
  User,
  Clock,
  Coins,
  Palette,
  X,
} from "lucide-react";

const palette = {
  background: "var(--color-bg)",
  backgroundSoft: "var(--color-green)",
  foreground: "var(--color-font)",
  foregroundBold: "var(--color-orange)",
  panel: "var(--color-pink)",
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
    .map((event) => {
      const dateValue = event.date ? new Date(event.date) : null;
      const isValid =
        dateValue instanceof Date && !Number.isNaN(dateValue.getTime());
      return { ...event, dateValue: isValid ? dateValue : null };
    })
    .filter((event) => event.dateValue !== null);
}

function formatDate(date) {
  if (!date) return "TBD";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
      .catch((err) => setLoadError(err.message));
  }, []);

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedEvent(null), 400);
  };

  const handleEventClick = (event) => {
    const [sh, sm] = (event.eventStartTime || "09:00")
      .split(":")
      .map(Number);

    const duration = event.duration || 60;
    const eh = sh + Math.floor(duration / 60);
    const em = sm + (duration % 60);

    const fmt = (h, m) =>
      `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

    setSelectedEvent({
      ...event,
      date: event.dateValue,
      time: `${fmt(sh, sm)} - ${fmt(eh, em)}`,
      host: "Event Host",
      price: "Free entry",
    });

    setIsModalVisible(true);
  };

  const parsed = parseEvents(eventsFromDb);
  const now = new Date();

  const upcomingEvents = parsed
    .filter((e) => e.dateValue >= now)
    .sort((a, b) => a.dateValue - b.dateValue);

  const previousEvents = parsed
    .filter((e) => e.dateValue < now)
    .sort((a, b) => b.dateValue - a.dateValue);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 py-10 mt-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Events Calendar
        </h1>

        <p className="mb-8 opacity-80">
          Browse dates and see upcoming events.
        </p>

        {loadError && (
          <div className="mb-6 text-red-600">{loadError}</div>
        )}

        <EventsCalendar
          events={eventsFromDb}
          onEventClick={handleEventClick}
        />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="border p-6 rounded-3xl">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
              <CalendarIcon size={20} /> Upcoming Events
            </h2>

            {upcomingEvents.length === 0 ? (
              <p>No upcoming events.</p>
            ) : (
              upcomingEvents.map((event, i) => (
                <div
                  key={event.id ?? i}
                  onClick={() => handleEventClick(event)}
                  className="cursor-pointer border rounded-xl p-3 mb-3 hover:shadow"
                >
                  <strong>{event.title}</strong>
                  <div className="text-sm">
                    {formatDate(event.dateValue)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border p-6 rounded-3xl">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
              <MapPin size={20} /> Past Events
            </h2>

            {previousEvents.length === 0 ? (
              <p>No past events.</p>
            ) : (
              previousEvents.slice(0, 5).map((event, i) => (
                <div
                  key={event.id ?? i}
                  onClick={() => handleEventClick(event)}
                  className="cursor-pointer border rounded-xl p-3 mb-3 hover:shadow"
                >
                  <strong>{event.title}</strong>
                  <div className="text-sm">
                    {formatDate(event.dateValue)}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-bold mb-4">
              {selectedEvent.title}
            </h2>

            <p className="mb-2">
              <CalendarIcon size={16} />{" "}
              {formatLongDate(selectedEvent.date)}
            </p>

            <p className="mb-2">
              <Clock size={16} /> {selectedEvent.time}
            </p>

            <p className="mb-2">
              <MapPin size={16} /> {selectedEvent.location}
            </p>

            {selectedEvent.description && (
              <p className="mt-4">{selectedEvent.description}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
