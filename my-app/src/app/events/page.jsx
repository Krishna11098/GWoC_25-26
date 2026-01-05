"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Calendar from "@/components/Calendar";
import EventService from "@/app/lib/eventService";

const palette = {
  background: "var(--color-background)",
  backgroundSoft: "var(--color-background-2)",
  foreground: "var(--color-foreground)",
  foregroundBold: "var(--color-foreground-2)",
  panel: "#dfeadf",
};

function parseEvents(events) {
  console.log("📝 Parsing events from Firestore:", events);

  const parsed = events
    .map((event) => {
      console.log(`📝 Processing event ${event.id}:`, event);

      // Check if event should be shown (default to true if active field doesn't exist)
      const isActive = event.active !== false; // true if not set or explicitly true

      if (!isActive) {
        console.log(`⚠️ Skipping inactive event: ${event.id}`);
        return null;
      }

      let dateValue = null;

      // Handle date parsing
      if (event.date) {
        try {
          if (typeof event.date === "string") {
            dateValue = new Date(event.date);
          } else if (event.date.toDate) {
            dateValue = event.date.toDate();
          } else if (event.date.seconds) {
            dateValue = new Date(event.date.seconds * 1000);
          } else if (event.date instanceof Date) {
            dateValue = event.date;
          }

          console.log(`📅 Date for ${event.id}:`, {
            raw: event.date,
            parsed: dateValue,
            isValid: dateValue instanceof Date && !isNaN(dateValue.getTime()),
          });
        } catch (dateError) {
          console.error(`❌ Date parsing error for ${event.id}:`, dateError);
        }
      } else {
        console.log(`⚠️ No date for event ${event.id}`);
      }

      const isValidDate =
        dateValue instanceof Date && !isNaN(dateValue.getTime());

      if (!isValidDate) {
        console.log(`⚠️ Invalid date for event ${event.id}, skipping`);
        return null;
      }

      // Normalize field names - admin uses 'name', frontend expects 'title'
      const title = event.title || event.name || "Untitled Event";
      const description =
        event.description ||
        event.fullDescription ||
        "No description available.";
      const location = event.location || event.venue || "Location TBD";
      const price = event.price || event.pricePerSeat || 0;
      const category = event.category || "general";
      const organizer = event.organizer || "Host";
      const startTime = event.startTime || event.eventStartTime || "10:00";
      const duration = event.duration || 60;
      const totalSeats = event.totalSeats || 50;
      const bookedSeats = event.bookedSeats || 0;
      const availableSeats = totalSeats - bookedSeats;
      const image = event.image || event.imageUrl || null;

      return {
        id: event.id,
        title,
        name: title, // For backward compatibility
        description,
        fullDescription: description,
        category,
        date: event.date,
        dateValue,
        location,
        venue: location,
        price,
        pricePerSeat: price,
        organizer,
        host: organizer,
        startTime,
        eventStartTime: startTime,
        duration,
        totalSeats,
        bookedSeats,
        availableSeats,
        maxSeatsPerUser: event.maxSeatsPerUser || 4,
        coinsPerSeat: event.coinsPerSeat || event.coinsReward || 100,
        contactEmail: event.contactEmail || "",
        contactPhone: event.contactPhone || "",
        eventType: event.eventType || "in_person",
        image,
        active: isActive,
        seats: event.seats || {},
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      };
    })
    .filter((event) => event !== null);

  console.log(`✅ Parsed ${parsed.length} valid events`);
  return parsed;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const modalRef = useRef(null);

  useEffect(() => {
    loadEvents();
    const timer = setTimeout(() => setIsInitialLoad(false), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isModalVisible]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      console.log("📥 [DEBUG] Loading events from EventService...");
      const events = await EventService.getAllEvents();

      console.log("✅ [DEBUG] Raw events loaded:", {
        count: events.length,
        events: events.map((e) => ({
          id: e.id,
          name: e.name,
          title: e.title,
          date: e.date,
          active: e.active,
          category: e.category,
        })),
      });

      setEventsFromDb(events);
    } catch (error) {
      console.error("❌ [DEBUG] Error loading events:", error);
      setLoadError(`Failed to load events: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedEvent(null), 420);
  };

  const handleEventClick = (event) => {
    const [startHours, startMinutes] = (
      event.startTime ||
      event.eventStartTime ||
      "09:00"
    )
      .split(":")
      .map(Number);
    const duration = event.duration || 60;
    const endHours = startHours + Math.floor(duration / 60);
    const endMinutes = startMinutes + (duration % 60);
    const formatTime = (h, m) =>
      `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    const timeString = `${formatTime(startHours, startMinutes)} - ${formatTime(
      endHours,
      endMinutes
    )}`;

    setSelectedEvent({
      ...event,
      date: event.dateValue,
      time: timeString,
      host: event.host || event.organizer || "Event Host",
      price:
        event.price === 0 || event.price === "0"
          ? "Free entry"
          : `₹${event.price}`,
      availableSeats: event.availableSeats || 0,
      totalSeats: event.totalSeats || 0,
    });
    setIsModalVisible(true);
  };

  const parsed = parseEvents(eventsFromDb);
  const now = new Date();

  const upcomingEvents = parsed
    .filter((event) => event.dateValue >= now)
    .sort((a, b) => a.dateValue - b.dateValue);

  const previousEvents = parsed
    .filter((event) => event.dateValue < now)
    .sort((a, b) => b.dateValue - a.dateValue);

  // Add debug view
  const showDebugInfo = process.env.NODE_ENV === "development";

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 py-10 mt-32">
        <div className="flex flex-col gap-10">
          {/* Header Section */}
          <div className="space-y-4 transform-gpu">
            <div
              className={`transition-all duration-1000 ${
                isInitialLoad
                  ? "opacity-0 translate-y-8"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-font bg-clip-text text-transparent bg-black leading-tight">
                Events Calendar
              </h1>
              <p className="mt-3 text-lg text-font/80 max-w-2xl">
                Discover and join amazing events. Browse dates and see events
                stored in Firebase Firestore.
              </p>
            </div>

            {/* Stats & Refresh Section */}
            <div
              className={`flex flex-wrap items-center gap-4 mt-6 transition-all duration-700 delay-300 ${
                isInitialLoad
                  ? "opacity-0 translate-y-8"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <button
                onClick={loadEvents}
                disabled={isLoading}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span className="font-medium">Loading...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span className="font-medium">Refresh Events</span>
                  </>
                )}
              </button>

              {/* Stats Cards */}
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="text-xs text-gray-500 font-medium">
                    TOTAL EVENTS
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {parsed.length}
                  </div>
                </div>
                <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="text-xs text-gray-500 font-medium">
                    UPCOMING
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {upcomingEvents.length}
                  </div>
                </div>
                <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="text-xs text-gray-500 font-medium">PAST</div>
                  <div className="text-2xl font-bold text-gray-600">
                    {previousEvents.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loadError && (
            <div
              className={`p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-lg ${
                isInitialLoad ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-red-700">
                    Error Loading Events
                  </div>
                  <div className="text-sm text-red-600">{loadError}</div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Component */}
          <div
            className={`transition-all duration-1000 delay-500 ${
              isInitialLoad ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  Calendar
                </h2>
              </div>
              <Calendar events={eventsFromDb} />
            </div>
          </div>

          {/* Events Lists */}
          <aside className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Events */}
              <div
                className={`transition-all duration-700 delay-300 ${
                  isInitialLoad
                    ? "opacity-0 translate-x-8"
                    : "opacity-100 translate-x-0"
                }`}
              >
                <div className="rounded-3xl border border-gray-200/50 shadow-2xl p-6 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <h2 className="text-2xl font-bold text-gray-800">
                        Upcoming Events
                      </h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {upcomingEvents.length} events
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-semibold shadow-sm">
                        Live
                      </span>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-20 bg-gray-200/50 rounded-2xl" />
                        </div>
                      ))}
                    </div>
                  ) : upcomingEvents.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="inline-block p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
                        <div className="text-4xl">📅</div>
                      </div>
                      <p className="text-gray-600 font-medium">
                        No upcoming events scheduled
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Check back later for exciting events!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingEvents.map((event, idx) => (
                        <div
                          key={event.id ?? idx}
                          onMouseEnter={() => setHoveredEvent(event.id)}
                          onMouseLeave={() => setHoveredEvent(null)}
                          onClick={() => handleEventClick(event)}
                          className={`relative rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center justify-between gap-4 bg-white/80 backdrop-blur-sm cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300/50
                            ${hoveredEvent === event.id ? "scale-[1.02]" : ""}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-lg transition-all duration-300
                                ${
                                  event.category === "workshop"
                                    ? "bg-blue-100/80"
                                    : event.category === "seminar"
                                    ? "bg-purple-100/80"
                                    : event.category === "conference"
                                    ? "bg-green-100/80"
                                    : "bg-gray-100/80"
                                }`}
                              >
                                <span className="text-lg">
                                  {event.category === "workshop"
                                    ? "🔧"
                                    : event.category === "seminar"
                                    ? "🎓"
                                    : event.category === "conference"
                                    ? "👥"
                                    : "🎯"}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-base font-bold truncate text-gray-800 hover:text-blue-600 transition-colors duration-300">
                                  {event.title ||
                                    event.name ||
                                    "Untitled Event"}
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    {event.location ||
                                      event.venue ||
                                      "Venue TBD"}
                                  </span>
                                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                                    {event.category || "General"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-sm font-semibold uppercase tracking-wide whitespace-nowrap text-gray-700">
                              {formatDate(event.dateValue)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {event.startTime || event.eventStartTime || "TBD"}
                            </div>
                            {event.price > 0 && (
                              <div className="mt-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-xs font-semibold shadow-sm">
                                ₹{event.price}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Previous Events */}
              <div
                className={`transition-all duration-700 delay-500 ${
                  isInitialLoad
                    ? "opacity-0 translate-x-8"
                    : "opacity-100 translate-x-0"
                }`}
              >
                <div className="rounded-3xl border border-gray-200/50 shadow-2xl p-6 bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-gray-400 rounded-full" />
                      <h2 className="text-2xl font-bold text-gray-800">
                        Previous Events
                      </h2>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold shadow-sm">
                      {previousEvents.length}
                    </span>
                  </div>

                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-gray-200/30 rounded-2xl" />
                        </div>
                      ))}
                    </div>
                  ) : previousEvents.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="inline-block p-4 bg-gradient-to-r from-gray-100 to-slate-100 rounded-2xl mb-4">
                        <div className="text-4xl">📜</div>
                      </div>
                      <p className="text-gray-600 font-medium">
                        No previous events yet
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Event history will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {previousEvents.slice(0, 5).map((event, idx) => (
                        <div
                          key={event.id ?? idx}
                          onClick={() => handleEventClick(event)}
                          className="relative rounded-2xl border border-gray-200/50 p-4 shadow-sm flex items-center justify-between gap-4 bg-white/60 backdrop-blur-sm cursor-pointer transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gray-100/50">
                                <span className="text-lg">📝</span>
                              </div>
                              <div>
                                <div className="text-base font-bold truncate text-gray-700">
                                  {event.title ||
                                    event.name ||
                                    "Untitled Event"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {event.category || "General"}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-semibold uppercase tracking-wide whitespace-nowrap text-gray-600">
                            {formatDate(event.dateValue)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-8 modal-shell">
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm modal-overlay ${
              isModalVisible ? "overlay-enter" : "overlay-exit"
            }`}
            onClick={closeModal}
          />
          <div
            ref={modalRef}
            className={`relative max-w-3xl w-full rounded-2xl border shadow-xl overflow-hidden modal-card ${
              isModalVisible ? "modal-enter" : "modal-exit"
            }`}
            style={{
              background: "#ffffff",
            }}
          >
            <div className="relative p-6 md:p-8">
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                aria-label="Close event details"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-xl">
                      {selectedEvent.category === "workshop"
                        ? "🔧"
                        : selectedEvent.category === "seminar"
                        ? "🎓"
                        : selectedEvent.category === "conference"
                        ? "👥"
                        : "🎯"}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedEvent.dateValue >= new Date()
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedEvent.dateValue >= new Date()
                      ? "UPCOMING"
                      : "PAST EVENT"}
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-gray-900">
                  {selectedEvent.title || selectedEvent.name}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: "🗓️",
                      label: "Date",
                      value: formatLongDate(selectedEvent.date),
                    },
                    { icon: "⏱️", label: "Time", value: selectedEvent.time },
                    {
                      icon: "📍",
                      label: "Location",
                      value: selectedEvent.location || selectedEvent.venue,
                    },
                    { icon: "💰", label: "Price", value: selectedEvent.price },
                    { icon: "👤", label: "Host", value: selectedEvent.host },
                    {
                      icon: "💺",
                      label: "Seats",
                      value: `${selectedEvent.availableSeats} of ${selectedEvent.totalSeats} available`,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="text-sm text-gray-500">
                          {item.label}
                        </div>
                        <div className="font-medium text-gray-800">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedEvent.description && (
                  <div className="mt-4">
                    <div className="rounded-lg p-4 bg-gray-50">
                      <p className="text-sm text-gray-500 mb-2">Description</p>
                      <p className="text-gray-700">
                        {selectedEvent.description}
                      </p>
                    </div>
                  </div>
                )}

                {selectedEvent.dateValue >= new Date() && (
                  <div className="mt-6 flex gap-4">
                    {selectedEvent.availableSeats > 0 ? (
                      <a
                        href={`/events/${selectedEvent.id}`}
                        onClick={closeModal}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Book Now
                      </a>
                    ) : (
                      <button
                        disabled
                        className="px-6 py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
                      >
                        Sold Out
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes overlayIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes overlayOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes boxIn {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes boxOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
        }

        .modal-shell {
          perspective: 1600px;
        }

        .overlay-enter {
          animation: overlayIn 0.3s ease-out forwards;
        }

        .overlay-exit {
          animation: overlayOut 0.2s ease-in forwards;
        }

        .modal-enter {
          animation: boxIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .modal-exit {
          animation: boxOut 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
      `}</style>
    </>
  );
}
