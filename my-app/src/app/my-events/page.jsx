"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/firebaseClient";
import { userFetch } from "@/lib/userFetch";

export default function MyEventsPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, attended, registered

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
        return;
      }
      setAuthUser(firebaseUser);
      fetchEvents();
    });

    return () => unsubscribe();
  }, [router]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await userFetch(`/api/user/profile`);
      const data = await res.json();

      // Process events and ensure attended status is calculated correctly
      const processedEvents = (data.userEvents || []).map((event) => {
        // Parse event date
        let eventDate = null;
        if (event.date || event.eventDate) {
          const dateValue = event.date || event.eventDate;
          try {
            if (typeof dateValue === "string") {
              eventDate = new Date(dateValue);
            } else if (typeof dateValue === "number") {
              eventDate = new Date(dateValue);
            } else if (dateValue && dateValue.seconds) {
              eventDate = new Date(dateValue.seconds * 1000);
            } else if (dateValue instanceof Date) {
              eventDate = dateValue;
            }
          } catch (e) {
            console.error("Error parsing event date:", e);
          }
        }

        // Calculate attended status: event is attended if current date > event date
        const now = new Date();
        const isEventPassed = eventDate && eventDate < now;
        const attendedStatus = isEventPassed || event.attended;

        return {
          ...event,
          attended: attendedStatus,
        };
      });

      setEvents(processedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    try {
      if (!dateValue) return "N/A";
      let date;
      if (typeof dateValue === "string") {
        date = new Date(dateValue);
      } else if (typeof dateValue === "number") {
        date = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        date = dateValue;
      } else if (dateValue.seconds) {
        date = new Date(dateValue.seconds * 1000);
      } else {
        return "N/A";
      }
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (_) {
      return "N/A";
    }
  };

  const getFilteredEvents = () => {
    if (filter === "attended") {
      return events.filter((e) => e.attended);
    } else if (filter === "registered") {
      return events.filter((e) => !e.attended);
    }
    return events;
  };

  const filteredEvents = getFilteredEvents();

  const stats = {
    total: events.length,
    attended: events.filter((e) => e.attended).length,
    registered: events.filter((e) => !e.attended).length,
    free: events.filter((e) => {
      const price = e.price || e.pricePerSeat || 0;
      return price === 0 || !price;
    }).length,
    paid: events.filter((e) => {
      const price = e.price || e.pricePerSeat || 0;
      return price > 0;
    }).length,
  };

  if (!authUser) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-12 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-2"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-gray-900">My Events</h1>
            <p className="text-gray-600 mt-2">
              Track all your event registrations and attendance
            </p>
          </div>

          {/* Stats Cards */}
          {!loading && events.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
              <StatCard label="Total Events" value={stats.total} icon="📋" />
              <StatCard label="Attended" value={stats.attended} icon="✓" />
              <StatCard label="Registered" value={stats.registered} icon="📝" />
              <StatCard label="Free Events" value={stats.free} icon="🎉" />
              <StatCard label="Paid Events" value={stats.paid} icon="💳" />
            </div>
          )}

          {/* Filter Tabs */}
          {!loading && events.length > 0 && (
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <FilterTab
                label="All Events"
                count={stats.total}
                active={filter === "all"}
                onClick={() => setFilter("all")}
              />
              <FilterTab
                label="Attended"
                count={stats.attended}
                active={filter === "attended"}
                onClick={() => setFilter("attended")}
              />
              <FilterTab
                label="Registered"
                count={stats.registered}
                active={filter === "registered"}
                onClick={() => setFilter("registered")}
              />
            </div>
          )}

          {/* Events List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading your events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="text-6xl mb-4">🎪</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {filter === "all"
                  ? "No events yet"
                  : filter === "attended"
                  ? "No attended events"
                  : "No registered events"}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === "all"
                  ? "Start registering for events to see them here!"
                  : "Register for events and attend them to see them here!"}
              </p>
              <button
                onClick={() => router.push("/events")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Explore Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event, idx) => (
                <EventCard key={idx} event={event} formatDate={formatDate} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center shadow-sm">
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-600 mt-1">{label}</p>
    </div>
  );
}

function FilterTab({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-medium border-b-2 transition-all ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-600 hover:text-gray-900"
      }`}
    >
      {label}
      <span className="ml-2 text-sm">({count})</span>
    </button>
  );
}

function EventCard({ event, formatDate }) {
  // Handle flexible field names for events
  const eventName = event.eventName || event.title || event.name || "Event";
  const eventDate = event.eventDate || event.date;
  const eventPrice = event.price || event.pricePerSeat || 0;
  const eventDescription = event.description || event.desc;
  const registeredDate =
    event.registeredAt || event.bookedAt || event.createdAt;

  // Determine ticket type: Paid or Free
  const ticketType = eventPrice > 0 ? "Paid" : "Free";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Event Header */}
      <div className="p-6 border-b border-gray-200 bg-blue-50">
        <div className="flex justify-between items-start gap-4 flex-wrap md:flex-nowrap">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              {eventName}
            </h3>
          </div>
          <div className="flex gap-4 md:gap-6">
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-600 uppercase font-medium mb-1">
                Price
              </p>
              <p className="text-lg font-bold text-gray-900">
                {eventPrice > 0 ? `₹${Number(eventPrice).toFixed(2)}` : "Free"}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-600 uppercase font-medium mb-1">
                Status
              </p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  event.attended
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {event.attended ? "✓ Attended" : "📝 Registered"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Key Information */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
              Event Date
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {eventDate ? formatDate(eventDate) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
              Registered
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {registeredDate ? formatDate(registeredDate) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
              Ticket Type
            </p>
            <p className="text-sm font-semibold text-gray-900">{ticketType}</p>
          </div>
        </div>
      </div>

      {/* Event Description */}
      {eventDescription && (
        <div className="p-6 bg-gray-50">
          <p className="text-sm text-gray-700 line-clamp-2">
            {eventDescription}
          </p>
        </div>
      )}
    </div>
  );
}
