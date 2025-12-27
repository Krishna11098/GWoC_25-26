"use client";

import { useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const palette = {
  background: "var(--color-background)",
  backgroundSoft: "var(--color-background-2)",
  foreground: "var(--color-foreground)",
  foregroundBold: "var(--color-foreground-2)",
  panel: "#dfeadf",
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar({ initialDate = new Date(), events: externalEvents = [] }) {
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [viewMode, setViewMode] = useState("month"); // "month", "week", "list"
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Transform external events to calendar format
  const events = useMemo(
    () => externalEvents.map(event => {
      const eventDate = event.date ? new Date(event.date) : null;
      if (!eventDate || isNaN(eventDate.getTime())) return null;

      // Parse start time
      const [startHours, startMinutes] = (event.eventStartTime || "09:00").split(":").map(Number);
      const duration = event.duration || 60;
      const endHours = startHours + Math.floor(duration / 60);
      const endMinutes = startMinutes + (duration % 60);
      
      const formatTime = (h, m) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const timeString = `${formatTime(startHours, startMinutes)} - ${formatTime(endHours, endMinutes)}`;

      return {
        date: eventDate,
        title: event.title || "Untitled Event",
        location: event.location || "TBD",
        time: timeString,
        host: event.createdBy || "Event Host",
        price: "Free entry",
        category: event.category || "general",
        description: event.description || "No description available.",
        startHour: startHours,
        endHour: endHours,
        allDay: false,
      };
    }).filter(Boolean),
    [externalEvents]
  );

  const daysGrid = useMemo(() => {
    const totalDays = getDaysInMonth(viewYear, viewMonth);
    const firstWeekday = getFirstDayOfMonth(viewYear, viewMonth);
    const cells = [];

    // Previous month's trailing days
    for (let i = 0; i < firstWeekday; i++) {
      cells.push(null);
    }
    // Current month's days
    for (let d = 1; d <= totalDays; d++) {
      cells.push(new Date(viewYear, viewMonth, d));
    }
    // Next month's leading days to fill the grid
    let nextMonthDay = 1;
    while (cells.length % 7 !== 0) {
      const nextDate = new Date(viewYear, viewMonth + 1, nextMonthDay);
      cells.push({ date: nextDate, isNextMonth: true });
      nextMonthDay++;
    }
    return cells;
  }, [viewYear, viewMonth]);

  const today = useMemo(() => new Date(), []);

  const isSameDay = (a, b) => {
    // Handle null/undefined
    if (!a || !b) return false;
    
    // Extract actual Date object if wrapped
    const dateA = a.date ? a.date : a;
    const dateB = b.date ? b.date : b;
    
    // Check if both are valid dates
    if (!(dateA instanceof Date) || !(dateB instanceof Date)) return false;
    
    return (
      dateA.getDate() === dateB.getDate() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getFullYear() === dateB.getFullYear()
    );
  };

  const prevMonth = () => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const nextMonth = () => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const goToToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  };

  // Get current week dates
  const getWeekDates = useMemo(() => {
    const now = new Date(viewYear, viewMonth, 1);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start from Sunday
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  }, [viewYear, viewMonth]);

  // Get time slots for week view
  const timeSlots = useMemo(() => {
    const slots = ["all-day"];
    for (let i = 0; i < 24; i++) {
      const hour = i % 12 || 12;
      const period = i < 12 ? "am" : "pm";
      slots.push(`${hour}${period}`);
    }
    return slots;
  }, []);

  const formatLongDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedEvent(null), 420);
  };

  return (
    <section className="relative w-full">
      {/* Subtle lifted border to make the calendar feel raised off the page */}
      <div
        className="absolute inset-0 rounded-[32px] pointer-events-none"
        style={{
          boxShadow: "12px 20px 48px -24px rgba(0, 0, 0, 0.55)",
          transform: "translateY(6px) translateX(4px)",
          background: `linear-gradient(180deg, ${palette.background}33, transparent)`
        }}
      />
      <div className="relative z-10">
      {/* Header with gradient background */}
      <div
        className="rounded-t-3xl px-6 md:px-10 py-6 md:py-8 text-white shadow-lg relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${palette.foregroundBold}, ${palette.foreground})`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_30%)] pointer-events-none" />
        <div className="relative flex items-center justify-between">
          {/* Navigation buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="bg-white/15 hover:bg-white/25 rounded-lg px-3 py-2 transition-all duration-300 transform hover:scale-105 text-lg font-bold border border-white/50"
              aria-label="Previous month"
            >
              ‹
            </button>
            <button
              onClick={nextMonth}
              className="bg-white/15 hover:bg-white/25 rounded-lg px-3 py-2 transition-all duration-300 transform hover:scale-105 text-lg font-bold border border-white/50"
              aria-label="Next month"
            >
              ›
            </button>
            <button
              onClick={goToToday}
              className="bg-black/15 hover:bg-black/25 rounded-lg px-4 py-2 transition-all duration-300 text-sm font-semibold border border-white/40"
            >
              today
            </button>
          </div>

          {/* Month/Year Title */}
          <h2 className="text-2xl md:text-3xl font-bold">
            {viewMode === "week" 
              ? `${MONTHS[getWeekDates[0].getMonth()]} ${getWeekDates[0].getDate()} – ${getWeekDates[6].getDate()}, ${getWeekDates[6].getFullYear()}`
              : `${MONTHS[viewMonth]} ${viewYear}`
            }
          </h2>

          {/* View mode toggle buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("month")}
              className={`rounded-lg px-4 py-2 transition-all duration-300 text-sm font-semibold border ${
                viewMode === "month"
                  ? "bg-white text-[var(--color-foreground-2)] border-white"
                  : "bg-white/10 text-white border-white/40 hover:bg-white/20"
              }`}
            >
              month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`rounded-lg px-4 py-2 transition-all duration-300 text-sm font-semibold border ${
                viewMode === "week"
                  ? "bg-white text-[var(--color-foreground-2)] border-white"
                  : "bg-white/10 text-white border-white/40 hover:bg-white/20"
              }`}
            >
              week
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg px-4 py-2 transition-all duration-300 text-sm font-semibold border ${
                viewMode === "list"
                  ? "bg-white text-[var(--color-foreground-2)] border-white"
                  : "bg-white/10 text-white border-white/40 hover:bg-white/20"
              }`}
            >
              list
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid - Only show month view for now */}
      {viewMode === "month" && (
        <div
          className="rounded-b-3xl px-4 md:px-10 py-8 shadow-xl backdrop-blur-sm"
          style={{
            background: `linear-gradient(180deg, ${palette.backgroundSoft}, ${palette.panel})`,
          }}
        >
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-px mb-0 bg-gradient-to-r from-[var(--color-foreground)]/25 to-[var(--color-foreground-2)]/25 p-px">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className="text-center text-sm font-semibold text-[var(--color-foreground-2)] uppercase tracking-widest bg-[var(--color-background)]/80 py-3"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-px bg-gradient-to-b from-[var(--color-foreground)]/18 to-[var(--color-foreground-2)]/22">
          {daysGrid.map((dateItem, idx) => {
            const actualDate = dateItem && dateItem.date ? dateItem.date : dateItem;
            const isNextMonth = dateItem && dateItem.isNextMonth;
            const isToday = actualDate && isSameDay(actualDate, today);
            const isHovered = hoveredDate && actualDate && isSameDay(actualDate, hoveredDate);
            const eventsForDate = actualDate
              ? events.filter((e) => isSameDay(e.date, actualDate))
              : [];

            return (
              <div
                key={idx}
                className="aspect-square bg-[var(--color-background)]/70 border"
                style={{ borderColor: `${palette.foreground}33` }}
              >
                {actualDate ? (
                  <button
                    onMouseEnter={() => setHoveredDate(actualDate)}
                    onMouseLeave={() => setHoveredDate(null)}
                    disabled={isNextMonth}
                    className={`w-full h-full rounded-none font-semibold text-sm transition-all duration-300 flex flex-col items-start justify-start p-2 ${
                      isToday
                        ? "bg-gradient-to-br from-[var(--color-foreground-2)] to-[var(--color-foreground)] text-white shadow-sm"
                        : isNextMonth
                          ? "bg-[var(--color-background)]/50 text-gray-400 opacity-40 blur-[0.2px] cursor-default"
                          : isHovered
                            ? "bg-[var(--color-foreground)]/22 text-slate-900"
                            : "bg-[var(--color-background)]/80 text-slate-800 hover:bg-[var(--color-background)]"
                    }`}
                  >
                    <span className="text-lg font-bold mb-1">{actualDate.getDate()}</span>
                    {isToday && (
                      <div className="text-[10px] font-light text-white/85 mb-1">
                        Today
                      </div>
                    )}
                    {eventsForDate.length > 0 && (
                      <div className="w-full mt-auto">
                        <div 
                          className="text-[11px] leading-snug font-bold text-white px-2.5 py-2.5 rounded-lg shadow-lg border border-white/30 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(eventsForDate[0]);
                            setIsModalVisible(true);
                          }}
                          style={{ 
                            background: 'linear-gradient(135deg, var(--color-foreground-2), var(--color-foreground))',
                            minHeight: '38px'
                          }}
                        >
                          🎲 {eventsForDate[0].time} {eventsForDate[0].title}
                        </div>
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            );
          })}
        </div>
        <div
          className="rounded-b-3xl px-4 md:px-6 py-6 shadow-xl"
          style={{
            background: `linear-gradient(180deg, ${palette.panel}, ${palette.background})`,
          }}
        >
          {/* Footer note */}
          <div className="overflow-x-auto rounded-lg">
            <p className="text-slate-700 text-sm px-4 py-3">
              ✨ Click on any date to see upcoming events
            </p>
          </div>
        </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === "week" && (
        <div
          className="rounded-b-3xl px-4 md:px-10 py-8 shadow-xl"
          style={{
            background: `linear-gradient(180deg, ${palette.backgroundSoft}, ${palette.panel})`,
          }}
        >
          {/* Week Grid */}
          <div
            className="overflow-x-auto border rounded-lg"
            style={{ borderColor: `${palette.foreground}44` }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--color-background)]/80">
                  <th
                    className="border px-4 py-3 text-left text-sm font-bold text-slate-900 w-20"
                    style={{ borderColor: `${palette.foreground}33` }}
                  >
                    Time
                  </th>
                  {getWeekDates.map((date, idx) => (
                    <th
                      key={idx}
                      className={`border px-4 py-3 text-center font-semibold ${
                        isSameDay(date, today)
                          ? "bg-[var(--color-foreground)]/30 text-slate-900"
                          : "bg-[var(--color-background)]/80 text-slate-800"
                      }`}
                      style={{ borderColor: `${palette.foreground}33` }}
                    >
                      <div className="text-xs uppercase tracking-wider">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]}
                      </div>
                      <div className="text-lg font-bold">
                        {date.getDate()}/{String(date.getMonth() + 1).padStart(2, "0")}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, slotIdx) => (
                  <tr
                    key={slotIdx}
                    className="hover:bg-[var(--color-foreground)]/12 transition-colors"
                  >
                    <td
                      className="border px-4 py-3 text-xs font-bold text-slate-900 w-20"
                      style={{
                        borderColor: `${palette.foreground}33`,
                        backgroundColor: `${palette.backgroundSoft}`,
                      }}
                    >
                      {slot}
                    </td>
                    {getWeekDates.map((date, dateIdx) => (
                      <td
                        key={dateIdx}
                        className={`border px-4 py-6 text-center ${
                          isSameDay(date, today)
                            ? "bg-[var(--color-foreground)]/15"
                            : "bg-[var(--color-background)]/75"
                        }`}
                        style={{ borderColor: `${palette.foreground}25` }}
                      >
                        {events
                          .filter((e) => {
                            if (!isSameDay(e.date, date)) return false;
                            // slotIdx 0 is 'all-day', slots 1..24 are 0..23 hours
                            const slotHour = slotIdx - 1;
                            if (e.allDay) return slotIdx === 0;
                            // Show event in all slots from startHour to endHour (exclusive)
                            return slotHour >= e.startHour && slotHour < e.endHour;
                          })
                          .map((evt, i) => (
                            <div
                              key={i}
                              className="text-xs font-bold text-white px-4 py-3 inline-block rounded-lg shadow-lg border border-white/30 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(evt);
                                setIsModalVisible(true);
                              }}
                              style={{ 
                                background: 'linear-gradient(135deg, var(--color-foreground-2), var(--color-foreground))',
                                minHeight: '50px'
                              }}
                            >
                              🎲 {evt.title}
                              <div className="text-[11px] font-medium text-white/95 mt-1">{evt.location}</div>
                            </div>
                          ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div
          className="rounded-b-3xl px-4 md:px-10 py-12 shadow-xl"
          style={{
            background: `linear-gradient(180deg, ${palette.backgroundSoft}, ${palette.panel})`,
          }}
        >
          <div className="text-center py-12">
            <p className="text-2xl font-serif text-slate-800">No events to display</p>
          </div>
        </div>
      )}

      {/* Event modal */}
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
      {/* End event modal */}
      
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
        .modal-exit { animation: boxOut 320ms ease forwards; transform-origin: center; will-change: transform, opacity; }

        @media (prefers-reduced-motion: reduce) {
          .overlay-enter, .overlay-exit, .modal-enter, .modal-exit { animation: none; }
        }
      `}</style>
      </div>
    </section>
  );
}
