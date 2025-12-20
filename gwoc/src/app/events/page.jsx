"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Calendar, MapPin } from "lucide-react";
import EventCard from "@/components/EventCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getAllEvents, getEventsByCategory } from "@/lib/events";
import { getCategoryColor } from "@/lib/utils";

const categories = [
  { value: "all", label: "All Events", color: "bg-gray-100 text-gray-800" },
  {
    value: "workshop",
    label: "Workshops",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "community",
    label: "Community",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "celebration",
    label: "Celebrations",
    color: "bg-orange-100 text-orange-800",
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filtersVisible, setFiltersVisible] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory]);

  const loadEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(term) ||
          event.shortDescription.toLowerCase().includes(term) ||
          event.communityPartner.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term)
      );
    }

    setFilteredEvents(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622')] bg-cover bg-center opacity-20 mix-blend-overlay" />

        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              Events & Workshops
            </h1>
            <p className="mx-auto max-w-2xl text-xl opacity-90">
              Discover meaningful experiences that bring joy and connection to
              our community
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by name, description, or partner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-gray-300 py-3 pl-12 pr-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {filtersVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pb-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        selectedCategory === cat.value
                          ? `${cat.color} border-2 border-purple-500`
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredEvents.length} Event
                  {filteredEvents.length !== 1 ? "s" : ""} Found
                </h2>
                {(searchTerm || selectedCategory !== "all") && (
                  <p className="mt-2 text-gray-600">
                    {searchTerm && `Search: "${searchTerm}"`}
                    {searchTerm && selectedCategory !== "all" && " • "}
                    {selectedCategory !== "all" &&
                      `Category: ${
                        categories.find((c) => c.value === selectedCategory)
                          ?.label
                      }`}
                  </p>
                )}
              </div>

              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </button>
              )}
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center"
              >
                <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  No events found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
