// components/EventCard.jsx
"use client";

import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronRight,
  Star,
  Share2,
  Heart,
  Wrench,
  Theater,
  Book,
  Handshake,
  Trophy,
  Palette,
  Briefcase,
  PartyPopper,
  CircleDollarSign,
  User,
} from "lucide-react";
import { useState } from "react";

const EventCard = ({ event, view = "grid" }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getCategoryColor = (category) => {
    const colors = {
      workshop: "bg-blue-100 text-blue-800",
      social: "bg-green-100 text-green-800",
      educational: "bg-orange-100 text-orange-800",
      networking: "bg-purple-100 text-purple-800",
      sports: "bg-red-100 text-red-800",
      arts: "bg-yellow-100 text-yellow-800",
      conference: "bg-indigo-100 text-indigo-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      workshop: <Wrench className="h-4 w-4" />,
      social: <Theater className="h-4 w-4" />,
      educational: <Book className="h-4 w-4" />,
      networking: <Handshake className="h-4 w-4" />,
      sports: <Trophy className="h-4 w-4" />,
      arts: <Palette className="h-4 w-4" />,
      conference: <Briefcase className="h-4 w-4" />,
    };
    return icons[category] || <PartyPopper className="h-4 w-4" />;
  };

  // Grid View
  if (view === "grid") {
    return (
      <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        {/* Event Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Top Badges */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(
                event.category
              )}`}
            >
              {getCategoryIcon(event.category)}{" "}
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </span>
          </div>

          {event.featured && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold flex items-center">
                <Star className="h-3 w-3 mr-1" /> Featured
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full ${
                isLiked
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-gray-700 hover:bg-white"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-6">
          {/* Date */}
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium">{formatDate(event.date)}</span>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4 mr-2" />
            <span>{formatTime(event.date)}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{event.location}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                {event.maxAttendees
                  ? `${event.maxAttendees} spots`
                  : "Unlimited spots"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  event.price === 0
                    ? "bg-green-100 text-green-800"
                    : "bg-[#E6F1EC] text-[#3E6F5C]"
                }`}
              >
                {event.price === 0 ? "Free" : `$${event.price}`}
              </span>
              <button className="flex items-center text-blue-600 font-medium hover:text-blue-700 group/btn">
                Details
                <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  if (view === "list") {
    return (
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Event Image */}
          <div className="md:w-1/3 relative h-64 md:h-auto">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent md:hidden"></div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(
                  event.category
                )}`}
              >
                {getCategoryIcon(event.category)} {event.category}
              </span>
            </div>
          </div>

          {/* Event Details */}
          <div className="md:w-2/3 p-6">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">
                        {formatDate(event.date)}
                      </span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatTime(event.date)}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsSaved(!isSaved)}
                      className={`p-2 rounded-full ${
                        isSaved
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                      />
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {event.description}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium text-sm truncate">
                        {event.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Capacity</p>
                      <p className="font-medium text-sm">
                        {event.maxAttendees || "Unlimited"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 text-gray-400 mr-3 flex items-center justify-center">
                      <CircleDollarSign size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-medium text-sm">
                        {event.price === 0 ? "Free" : `$${event.price}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 text-gray-400 mr-3 flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Host</p>
                      <p className="font-medium text-sm truncate">
                        {event.createdBy}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <button className="px-6 py-2 bg-[#7FAF9B] text-white rounded-full font-medium hover:bg-[#6A9C87] transition-colors shadow-md hover:shadow-lg">
                    Register Now
                  </button>
                  <button className="px-6 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors">
                    Learn More
                  </button>
                </div>
                {event.featured && (
                  <div className="hidden md:flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current mr-1" />
                    <span className="text-sm font-medium">Featured Event</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Featured View
  if (view === "featured") {
    return (
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>

        <div className="relative z-10 p-8">
          {/* Featured Badge */}
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg mr-3">
              <Star className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
              Featured Experience
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image */}
            <div className="lg:w-2/5">
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Category */}
                <div className="absolute bottom-4 left-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${getCategoryColor(
                      event.category
                    )}`}
                  >
                    {getCategoryIcon(event.category)} {event.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-3/5">
              {/* Date */}
              <div className="flex items-center text-gray-600 mb-4">
                <Calendar className="h-5 w-5 mr-3" />
                <span className="text-lg font-bold">
                  {formatDate(event.date)}
                </span>
                <span className="mx-4 text-gray-400">•</span>
                <Clock className="h-5 w-5 mr-3" />
                <span className="text-lg">{formatTime(event.date)}</span>
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {event.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-8">{event.description}</p>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-bold text-gray-900">Location</span>
                  </div>
                  <p className="text-gray-700">{event.location}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-bold text-gray-900">Spots</span>
                  </div>
                  <p className="text-gray-700">
                    {event.maxAttendees
                      ? `${event.maxAttendees} available`
                      : "Open enrollment"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <div className="h-5 w-5 text-purple-600 mr-3 flex items-center justify-center">
                      <CircleDollarSign size={20} />
                    </div>
                    <span className="font-bold text-gray-900">Investment</span>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      event.price === 0 ? "text-green-600" : "text-[#3E6F5C]"
                    }`}
                  >
                    {event.price === 0 ? "Complimentary" : `$${event.price}`}
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 px-8 py-4 bg-[#7FAF9B] text-white rounded-xl font-bold text-lg hover:bg-[#6A9C87] hover:shadow-xl transition-all">
                  Secure Your Spot Now
                </button>
                <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors">
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default EventCard;
