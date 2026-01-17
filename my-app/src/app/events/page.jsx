"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Calendar from "@/components/Calendar";
import EventService from "@/app/lib/eventService";
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
} from "lucide-react";

function parseEvents(events) {
  return events
    .map((event) => {
      const isActive = event.active !== false;
      if (!isActive) return null;

      let dateValue = null;
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
        } catch (dateError) {
          console.error(`Date parsing error for ${event.id}:`, dateError);
        }
      }

      const isValidDate = dateValue instanceof Date && !isNaN(dateValue.getTime());
      if (!isValidDate) return null;

      const title = event.title || event.name || "Untitled Event";
      const description = event.description || event.fullDescription || "No description available.";
      const location = event.location || event.venue || "Location TBD";
      const price = event.price || event.pricePerSeat || 0;
      const category = event.category || "general";
      const startTime = event.startTime || event.eventStartTime || "10:00";
      const duration = event.duration || 60;
      const totalSeats = event.totalSeats || 50;
      const bookedSeats = event.bookedSeats || 0;
      const availableSeats = totalSeats - bookedSeats;
      const image = event.image || event.imageUrl || null;

      return {
        id: event.id,
        title,
        description,
        category,
        dateValue,
        location,
        venue: location,
        price,
        startTime,
        duration,
        totalSeats,
        bookedSeats,
        availableSeats,
        image,
      };
    })
    .filter((event) => event !== null);
}

export default function EventsPage() {
  const router = useRouter();
  const [eventsFromDb, setEventsFromDb] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const events = await EventService.getAllEvents();
      setEventsFromDb(events);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const parsed = parseEvents(eventsFromDb);
  const now = new Date();

  const upcomingEvents = parsed
    .filter((event) => event.dateValue >= now)
    .sort((a, b) => a.dateValue - b.dateValue);

  const previousEvents = parsed
    .filter((event) => event.dateValue < now)
    .sort((a, b) => b.dateValue - a.dateValue);

  const addToGoogleCalendar = (event) => {
    const startDate = new Date(event.dateValue);
    const [startH, startM] = (event.startTime || "10:00").split(':').map(Number);
    startDate.setHours(startH, startM, 0);

    const endDate = new Date(startDate.getTime() + (event.duration || 120) * 60000);

    const formatGCalDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const startStr = formatGCalDate(startDate);
    const endStr = formatGCalDate(endDate);

    const title = encodeURIComponent(event.title || "Event");
    const details = encodeURIComponent(event.description || "");
    const location = encodeURIComponent(event.venue || "");

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}&trp=false`;

    window.open(url, '_blank');
  };

  const displayedEvents = selectedCategory === 'upcoming'
    ? upcomingEvents
    : selectedCategory === 'previous'
      ? previousEvents
      : [];

  return (
    <>
      <Navbar />
      <main className="w-full py-10 relative min-h-screen bg-[#f5f5f0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-16 relative z-10 mt-32">

            {/* Calendar Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full"
            >
              <Calendar events={eventsFromDb} />
            </motion.div>

            {/* Category Selection Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-8"
            >
              <h2 className="text-2xl font-bold text-gray-700">Select Event Type</h2>
              <div className="flex flex-wrap gap-6 justify-center">
                <button
                  onClick={() => setSelectedCategory('upcoming')}
                  className={`px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 ${selectedCategory === 'upcoming'
                      ? 'bg-[var(--dark-teal)] text-white shadow-2xl scale-105'
                      : 'bg-white text-gray-800 border-3 border-gray-300 hover:border-[var(--dark-teal)] shadow-lg'
                    }`}
                >
                  Upcoming Events
                </button>
                <button
                  onClick={() => setSelectedCategory('previous')}
                  className={`px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 ${selectedCategory === 'previous'
                      ? 'bg-[var(--dark-teal)] text-white shadow-2xl scale-105'
                      : 'bg-white text-gray-800 border-3 border-gray-300 hover:border-[var(--dark-teal)] shadow-lg'
                    }`}
                >
                  Previous Events
                </button>
              </div>
            </motion.div>

            {/* Events Display */}
            <AnimatePresence mode="wait">
              {selectedCategory && (
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {/* Header with count */}
                  <div className="mb-12">
                    <h2 className="text-5xl md:text-6xl font-bold mb-2">
                      <span className="text-gray-800 uppercase tracking-tight">{selectedCategory === 'upcoming' ? 'UPCOMING' : 'PREVIOUS'}</span>
                    </h2>
                    <h3 className="text-6xl md:text-7xl font-serif italic text-gray-800 mb-6" style={{
                      background: 'linear-gradient(to right, #FFD700 0%, #FFD700 100%)',
                      backgroundPosition: '0 85%',
                      backgroundSize: '100% 30%',
                      backgroundRepeat: 'no-repeat',
                      paddingBottom: '8px'
                    }}>
                      EVENTS
                    </h3>
                    <p className="text-gray-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[var(--dark-teal)] rounded-full"></span>
                      {displayedEvents.length} EVENTS SCHEDULED
                    </p>
                    <div className="w-full h-1 bg-gray-800 mt-6"></div>
                  </div>

                  {isLoading ? (
                    <div className="space-y-8">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-3xl"></div>
                      ))}
                    </div>
                  ) : displayedEvents.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
                      <CalendarIcon size={64} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-xl text-gray-500">No {selectedCategory} events found</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {displayedEvents.map((event, index) => {
                        const registrationPercentage = (event.bookedSeats / event.totalSeats) * 100;

                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-black hover:shadow-2xl transition-all duration-300"
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                              {/* Event Image */}
                              <div className="lg:col-span-4 relative">
                                {event.image ? (
                                  <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover min-h-[300px] lg:min-h-[400px]"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-[var(--light-orange)] to-[var(--light-pink)] min-h-[300px] lg:min-h-[400px] flex items-center justify-center">
                                    <CalendarIcon size={80} className="text-white opacity-50" />
                                  </div>
                                )}
                                <div className="absolute top-4 left-4">
                                  <span className="px-4 py-2 bg-[var(--green)] text-white rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                                    {selectedCategory === 'upcoming' ? 'UPCOMING' : 'PAST'}
                                  </span>
                                </div>
                              </div>

                              {/* Event Details */}
                              <div className="lg:col-span-8 p-8 lg:p-12 flex flex-col">
                                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
                                  {event.title}
                                </h3>

                                <p className="text-gray-600 text-base mb-8 leading-relaxed">
                                  {event.description}
                                </p>

                                {/* Info Boxes */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                  <div className="border-2 border-gray-800 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-2 uppercase tracking-wide">
                                      <CalendarIcon size={14} />
                                      DATE
                                    </div>
                                    <div className="font-bold text-gray-900 text-lg">
                                      {event.dateValue.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                      })}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {event.startTime}
                                    </div>
                                  </div>

                                  <div className="border-2 border-gray-800 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-2 uppercase tracking-wide">
                                      <MapPin size={14} />
                                      LOCATION
                                    </div>
                                    <div className="font-bold text-gray-900 text-sm line-clamp-2">
                                      {event.venue}
                                    </div>
                                  </div>

                                  <div className="border-2 border-gray-800 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-2 uppercase tracking-wide">
                                      <Users size={14} />
                                      CAPACITY
                                    </div>
                                    <div className="font-bold text-gray-900 text-lg">
                                      {event.totalSeats}
                                    </div>
                                  </div>

                                  <div className="border-2 border-gray-800 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-2 uppercase tracking-wide">
                                      <Users size={14} />
                                      REGISTERED
                                    </div>
                                    <div className="font-bold text-gray-900 text-lg">
                                      {event.bookedSeats}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {event.availableSeats} left
                                    </div>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-8">
                                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-800">
                                    <div
                                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                                      style={{ width: `${registrationPercentage}%` }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 mt-auto">
                                  {selectedCategory === 'upcoming' && (
                                    <>
                                      <button
                                        onClick={() => addToGoogleCalendar(event)}
                                        className="flex-1 min-w-[200px] px-6 py-4 bg-white border-3 border-gray-800 text-gray-800 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 uppercase tracking-wide"
                                      >
                                        Add to Calendar
                                      </button>
                                      <button
                                        onClick={() => router.push(`/events/${event.id}`)}
                                        className="flex-1 min-w-[200px] px-6 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all duration-200 uppercase tracking-wide shadow-lg"
                                      >
                                        Register Now
                                      </button>
                                    </>
                                  )}
                                  {selectedCategory === 'previous' && (
                                    <button
                                      onClick={() => router.push(`/events/${event.id}`)}
                                      className="w-full px-6 py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-black transition-all duration-200 uppercase tracking-wide"
                                    >
                                      View Details
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!selectedCategory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center py-32"
              >
                <CalendarIcon size={100} className="mx-auto text-gray-300 mb-6" />
                <p className="text-2xl text-gray-500 font-medium">Select a category above to view events</p>
              </motion.div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
