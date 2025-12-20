"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Users, Sparkles, ArrowRight, Star } from "lucide-react";
import EventCard from "@/components/EventCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getFeaturedEvents } from "@/lib/events";
import { getCategoryGradient } from "@/lib/utils";

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedEvents();
  }, []);

  const loadFeaturedEvents = async () => {
    try {
      const events = await getFeaturedEvents();
      setFeaturedEvents(events);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622')] bg-cover bg-center opacity-20 mix-blend-overlay" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container relative mx-auto px-4 text-center text-white"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">
              Where Joy Meets Community
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-6 text-5xl font-bold md:text-7xl"
          >
            Spread <span className="text-yellow-300">Joy</span>,{" "}
            <span className="text-pink-300">Connect</span>,{" "}
            <span className="text-orange-300">Grow</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-2xl text-xl opacity-90"
          >
            Join unforgettable events and workshops that bring people together,
            spark creativity, and build meaningful connections in your
            community.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/events"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-purple-600 shadow-lg transition-all hover:scale-105"
            >
              Explore Events
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-4 inline-flex rounded-full bg-gradient-to-r from-purple-100 to-pink-100 p-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900">150+</div>
              <div className="text-lg text-gray-600">Events Hosted</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-4 inline-flex rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 p-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900">5,000+</div>
              <div className="text-lg text-gray-600">Happy Participants</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-4 inline-flex rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 p-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900">50+</div>
              <div className="text-lg text-gray-600">Community Partners</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Featured Events
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked experiences you won't want to miss
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 p-12 text-center text-white shadow-xl"
          >
            <h2 className="mb-4 text-4xl font-bold">Ready to Spread Joy?</h2>
            <p className="mb-8 text-xl opacity-90">
              Join our next event or become a community partner
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-purple-600 transition-transform hover:scale-105"
            >
              View All Events
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
