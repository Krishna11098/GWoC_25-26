"use client";

import { useMemo, useState, useEffect } from "react";

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

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar({ initialDate }) {
  const [viewYear, setViewYear] = useState(0);
  const [viewMonth, setViewMonth] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [viewMode, setViewMode] = useState("month"); // "month", "week", "list"
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Initialize date after hydration
  useEffect(() => {
    const date = initialDate || new Date();
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
    setIsHydrated(true);
  }, [initialDate]);

  // Simple mocked event for the 29th of the active month
  const events = useMemo(
    () => [
      {
        date: new Date(viewYear, viewMonth, 6),
        title: "Joy Juncture Game Night",
        location: "Joy Juncture Lounge + Stream",
        time: "20:00 - 23:00",
        host: "Joy Juncture Crew",
        price: "Free entry · Snacks on us",
        category: "Games & Community",
        description:
          "Squad up for casual co-op, card battles, and a surprise mini-tournament. Bring your controller; we have setups for PC, console, and board games.",
        startHour: 20, // 8pm
        endHour: 23, // 11pm
        allDay: false,
      },
    ],
    [viewYear, viewMonth]
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

  if (!isHydrated) {
    return <div className="w-full h-96 rounded-4xl animate-pulse" />;
  }

  return (
    <section className="relative w-full">
      {/* Subtle lifted border to make the calendar feel raised off the page */}
      <div
        className="absolute inset-0 rounded-4xl pointer-events-none"
        style={{
          boxShadow: "12px 20px 48px -24px rgba(0, 0, 0, 0.55)",
          transform: "translateY(6px) translateX(4px)",
        }}
      />
      <div className="relative z-10">
        {/* Header background */}
        <div className="rounded-t-3xl px-6 md:px-10 py-6 md:py-8 shadow-lg relative overflow-hidden bg-background-2 text-font-2">
          <div className="relative flex items-center justify-between">
            {/* Navigation buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevMonth}
                className="rounded-lg px-3 py-2 transition-all duration-300 transform hover:scale-105 text-lg font-bold border border-font-2 text-font-2 hover:bg-font-2/10"
                aria-label="Previous month"
              >
                ‹
              </button>
              <button
                onClick={nextMonth}
                className="rounded-lg px-3 py-2 transition-all duration-300 transform hover:scale-105 text-lg font-bold border border-font-2 text-font-2 hover:bg-font-2/10"
                aria-label="Next month"
              >
                ›
              </button>
              <button
                onClick={goToToday}
                className="rounded-lg px-4 py-2 transition-all duration-300 text-sm font-semibold border border-font-2 text-font-2 hover:bg-font-2/10"
              >
                today
              </button>
            </div>

            {/* Month/Year Title */}
            <h2 className="text-2xl md:text-3xl font-bold">
              {viewMode === "week"
                ? `${
                    MONTHS[getWeekDates[0].getMonth()]
                  } ${getWeekDates[0].getDate()} – ${getWeekDates[6].getDate()}, ${getWeekDates[6].getFullYear()}`
                : `${MONTHS[viewMonth]} ${viewYear}`}
            </h2>

            {/* View mode toggle buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("month")}
                className={`rounded-lg px-4 py-2 transition-all duration-300 text-sm font-semibold border ${
                  viewMode === "month"
                    ? "bg-font-2 text-font border-font-2"
                    : "bg-font-2/10 text-font-2 border-font-2 hover:bg-font-2/20"
                }`}
              >
                month
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`rounded-lg px-4 py-2 transition-all duration-300 text-sm font-semibold border ${
                  viewMode === "week"
                    ? "bg-font-2 text-font border-font-2"
                    : "bg-font-2/10 text-font-2 border-font-2 hover:bg-font-2/20"
                }`}
              >
                week
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-lg px-4 py-2 transition-all duration-300 text-sm font-semibold border ${
                  viewMode === "list"
                    ? "bg-font-2 text-font border-font-2"
                    : "bg-font-2/10 text-font-2 border-font-2 hover:bg-font-2/20"
                }`}
              >
                list
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid - Only show month view for now */}
        {viewMode === "month" && (
          <div className="rounded-b-3xl px-4 md:px-10 py-8 shadow-xl backdrop-blur-sm bg-font-2">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-px mb-0 p-px bg-foreground/25">
              {WEEKDAYS.map((wd) => (
                <div
                  key={wd}
                  className="text-center text-sm font-semibold uppercase tracking-widest py-3 bg-background text-foreground"
                >
                  {wd}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-px">
              {daysGrid.map((dateItem, idx) => {
                const actualDate =
                  dateItem && dateItem.date ? dateItem.date : dateItem;
                const isNextMonth = dateItem && dateItem.isNextMonth;
                const isToday = actualDate && isSameDay(actualDate, today);
                const isHovered =
                  hoveredDate &&
                  actualDate &&
                  isSameDay(actualDate, hoveredDate);
                const eventsForDate = actualDate
                  ? events.filter((e) => isSameDay(e.date, actualDate))
                  : [];

                return (
                  <div
                    key={idx}
                    className="aspect-square border border-foreground/20 bg-foreground"
                  >
                    {actualDate ? (
                      <button
                        onMouseEnter={() => setHoveredDate(actualDate)}
                        onMouseLeave={() => setHoveredDate(null)}
                        disabled={isNextMonth}
                        className={`w-full h-full rounded-none font-semibold text-sm transition-all duration-300 flex flex-col items-start justify-start p-2 ${
                          isToday
                            ? "bg-foreground text-font-2 shadow-sm"
                            : isNextMonth
                            ? "opacity-40 blur-[0.2px] cursor-default text-foreground/50"
                            : isHovered
                            ? "bg-foreground/20 text-font"
                            : "text-font hover:bg-foreground/10"
                        }`}
                      >
                        <span className="text-lg font-bold mb-1">
                          {actualDate.getDate()}
                        </span>
                        {isToday && (
                          <div className="text-[10px] font-light mb-1 text-font-2/90">
                            Today
                          </div>
                        )}
                        {eventsForDate.length > 0 && (
                          <div className="w-full mt-auto">
                            <div
                              className="text-[11px] leading-snug font-bold px-2.5 py-2.5 rounded-lg shadow-lg border border-font-2/30 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-101 flex items-center gap-1.5 bg-foreground-2 text-font-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(eventsForDate[0]);
                                setIsModalVisible(true);
                              }}
                            >
                              <svg
                                className="w-3.5 h-3.5 shrink-0"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M7.5 6.5C7.5 8.981 5.481 11 3 11V13C5.481 13 7.5 15.019 7.5 17.5H9.5C9.5 15.019 11.519 13 14 13V11C11.519 11 9.5 8.981 9.5 6.5H7.5ZM18 2C15.347 2 12.918 3 11 4.647C10.052 3.633 8.85 2.863 7.5 2.431V4.617C8.647 5.046 9.639 5.815 10.354 6.854C9.355 8.478 8 9.731 6.5 10.469V12.531C8 13.269 9.355 14.522 10.354 16.146C9.639 17.185 8.647 17.954 7.5 18.383V20.569C8.85 20.137 10.052 19.367 11 18.353C12.918 20 15.347 21 18 21C21.314 21 24 18.314 24 15S21.314 9 18 9C15.347 9 12.918 10 11 11.647C11 11.433 11 11.217 11 11V11C11 7.686 13.686 5 17 5C17.552 5 18 4.552 18 4C18 3.448 17.552 3 17 3C12.582 3 9 6.582 9 11C9 11.217 9 11.433 9 11.647C7.082 10 4.653 9 2 9V11C4.653 11 7.082 12 9 13.647C9 13.783 9 13.917 9 14.05C9 18.392 12.582 22 17 22C17.552 22 18 21.552 18 21C18 20.448 17.552 20 17 20C13.686 20 11 17.314 11 14.05C11 13.917 11 13.783 11 13.647C12.918 15 15.347 16 18 16C21.314 16 24 13.314 24 10S21.314 4 18 4V2Z" />
                              </svg>
                              <span>
                                {eventsForDate[0].time} {eventsForDate[0].title}
                              </span>
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
            <div className="rounded-b-3xl px-4 md:px-6 py-6 shadow-xl bg-background">
              {/* Footer note */}
              <div className="overflow-x-auto rounded-lg">
                <p className="text-sm px-4 py-3 flex items-center gap-2 text-font-2">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  <span>Click on any date to see upcoming events</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Week View */}
        {viewMode === "week" && (
          <div className="rounded-b-3xl px-4 md:px-10 py-8 shadow-xl bg-foreground">
            {/* Week Grid */}
            <div className="overflow-x-auto border border-foreground/20 rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-background/80">
                    <th className="border border-foreground/20 px-4 py-3 text-left text-sm font-bold w-20 text-foreground">
                      Time
                    </th>
                    {getWeekDates.map((date, idx) => (
                      <th
                        key={idx}
                        className={`border border-foreground/20 px-4 py-3 text-center font-semibold ${
                          isSameDay(date, today)
                            ? "bg-foreground/30 text-font"
                            : "bg-background/80 text-foreground"
                        }`}
                      >
                        <div className="text-xs uppercase tracking-wider">
                          {
                            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                              date.getDay()
                            ]
                          }
                        </div>
                        <div className="text-lg font-bold">
                          {date.getDate()}/
                          {String(date.getMonth() + 1).padStart(2, "0")}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, slotIdx) => (
                    <tr
                      key={slotIdx}
                      className="transition-colors hover:bg-foreground/10"
                    >
                      <td className="border border-foreground/20 px-4 py-3 text-xs font-bold w-20 bg-background text-foreground">
                        {slot}
                      </td>
                      {getWeekDates.map((date, dateIdx) => {
                        const slotHour = slotIdx - 1;
                        return (
                          <td
                            key={dateIdx}
                            className={`border border-foreground/15 px-4 py-6 text-center ${
                              isSameDay(date, today)
                                ? "bg-foreground/15"
                                : "bg-background/75"
                            }`}
                          >
                            {events
                              .filter((e) => {
                                if (!isSameDay(e.date, date)) return false;
                                if (e.allDay) return slotIdx === 0;
                                return (
                                  slotHour >= e.startHour &&
                                  slotHour < e.endHour
                                );
                              })
                              .map((evt, i) => (
                                <div
                                  key={i}
                                  className="text-xs font-bold px-4 py-3 inline-block rounded-lg shadow-lg border border-font-2/30 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105 bg-foreground-2 text-font-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(evt);
                                    setIsModalVisible(true);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <svg
                                      className="w-4 h-4 flex-shrink-0"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M7.5 6.5C7.5 8.981 5.481 11 3 11V13C5.481 13 7.5 15.019 7.5 17.5H9.5C9.5 15.019 11.519 13 14 13V11C11.519 11 9.5 8.981 9.5 6.5H7.5ZM18 2C15.347 2 12.918 3 11 4.647C10.052 3.633 8.85 2.863 7.5 2.431V4.617C8.647 5.046 9.639 5.815 10.354 6.854C9.355 8.478 8 9.731 6.5 10.469V12.531C8 13.269 9.355 14.522 10.354 16.146C9.639 17.185 8.647 17.954 7.5 18.383V20.569C8.85 20.137 10.052 19.367 11 18.353C12.918 20 15.347 21 18 21C21.314 21 24 18.314 24 15S21.314 9 18 9C15.347 9 12.918 10 11 11.647C11 11.433 11 11.217 11 11V11C11 7.686 13.686 5 17 5C17.552 5 18 4.552 18 4C18 3.448 17.552 3 17 3C12.582 3 9 6.582 9 11C9 11.217 9 11.433 9 11.647C7.082 10 4.653 9 2 9V11C4.653 11 7.082 12 9 13.647C9 13.783 9 13.917 9 14.05C9 18.392 12.582 22 17 22C17.552 22 18 21.552 18 21C18 20.448 17.552 20 17 20C13.686 20 11 17.314 11 14.05C11 13.917 11 13.783 11 13.647C12.918 15 15.347 16 18 16C21.314 16 24 13.314 24 10S21.314 4 18 4V2Z" />
                                    </svg>
                                    <span>{evt.title}</span>
                                  </div>
                                  <div className="text-[11px] font-medium mt-1">
                                    {evt.location}
                                  </div>
                                </div>
                              ))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="rounded-b-3xl px-4 md:px-10 py-12 shadow-xl bg-foreground">
            <div className="text-center py-12">
              <p className="text-2xl font-serif">
                No events to display
              </p>
            </div>
          </div>
        )}

        {/* Event modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-8 modal-shell">
            <div
              className={`absolute inset-0 bg-black/55 backdrop-blur-sm modal-overlay ${
                isModalVisible ? "overlay-enter" : "overlay-exit"
              }`}
              onClick={closeModal}
            />
            <div
              className={`relative max-w-3xl w-full rounded-[30px] border border-foreground/30 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] overflow-hidden modal-card bg-font-2 text-font ${
                isModalVisible ? "modal-enter" : "modal-exit"
              }`}
            >
              <div className="flex justify-between items-start gap-4 p-6 md:p-8">
                <div className="space-y-5 w-full">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center px-4 py-2 rounded-full shadow-lg text-sm font-semibold drop-shadow-md bg-foreground text-font-2">
                      By: {selectedEvent.host || "Unknown"}
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif leading-tight text-font">
                    {selectedEvent.title}
                  </h3>
                  <hr className="border-foreground/20" />

                  <div className="space-y-3">
                    <div className="flex items-baseline gap-3 text-lg font-semibold text-foreground">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
                      </svg>
                      <span>Date:</span>
                      <span className="font-medium text-font">
                        {formatLongDate(selectedEvent.date)}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3 text-lg font-semibold text-foreground">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                      <span>Time:</span>
                      <span className="font-medium text-font">
                        {selectedEvent.time}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3 text-lg font-semibold text-foreground">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      <span>Location:</span>
                      <span className="font-medium text-font">
                        {selectedEvent.location}
                      </span>
                    </div>
                    {selectedEvent.price && (
                      <div className="flex items-baseline gap-3 text-lg font-semibold text-foreground">
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                        </svg>
                        <span>Price:</span>
                        <span className="font-medium text-font">
                          {selectedEvent.price}
                        </span>
                      </div>
                    )}
                    {selectedEvent.category && (
                      <div className="flex items-baseline gap-3 text-lg font-semibold text-foreground">
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
                        </svg>
                        <span>Category:</span>
                        <span className="font-medium text-font">
                          {selectedEvent.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedEvent.description && (
                    <div className="mt-6">
                      <div className="rounded-2xl p-5 shadow-inner bg-background/30 border border-foreground/20">
                        <p className="text-lg font-semibold mb-2 text-foreground">
                          Description
                        </p>
                        <p className="text-base leading-relaxed text-font">
                          {selectedEvent.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={closeModal}
                  className="h-10 w-10 flex items-center justify-center rounded-full text-xl font-bold border border-foreground/30 transition-all hover:bg-background/20 text-foreground"
                  aria-label="Close event details"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
        {/* End event modal */}
      </div>
    </section>
  );
}
