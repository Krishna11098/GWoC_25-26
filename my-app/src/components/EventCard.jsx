"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight, Star } from "lucide-react";
import { formatDate, getCategoryColor, getCategoryGradient } from "@/lib/utils";

const EventCard = ({ event }) => {
  const progress =
    event.capacity > 0 ? (event.registered / event.capacity) * 100 : 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
    >
      {/* Featured Badge */}
      {event.isFeatured && (
        <div className="absolute left-4 top-4 z-10">
          <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-semibold text-white">
            <Star size={12} />
            <span>Featured</span>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={event.imageUrl}
          alt={event.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute right-4 top-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(
              event.category
            )}`}
          >
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-1">
            {event.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {event.shortDescription}
          </p>
        </div>

        {/* Details Grid */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-medium">{formatDate(event.date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium line-clamp-1">
                {event.location}
              </p>
            </div>
          </div>
        </div>

        {/* Community Partner */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">Community Partner</p>
          <p className="text-sm font-medium text-gray-800">
            {event.communityPartner}
          </p>
        </div>

        {/* Registration Progress */}
        <div className="mb-6">
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-gray-700">
              {event.registered}/{event.capacity} registered
            </span>
            <span className="font-semibold text-purple-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/events/${event.id}/gallery`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 text-sm font-semibold text-purple-700 transition-all hover:from-purple-100 hover:to-pink-100"
          >
            View Gallery
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700">
            Register
          </button>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-1 -z-10 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />
    </motion.div>
  );
};

export default EventCard;
