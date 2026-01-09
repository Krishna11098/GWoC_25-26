"use client";

import { useRouter } from "next/navigation";

export default function EventCard({ event, onClick }) {
  const router = useRouter();
  const isPastEvent = new Date(event.date) < new Date();
  const isSoldOut = event.bookedSeats >= event.totalSeats;
  const seatsAvailable = event.totalSeats - event.bookedSeats;
  const isFree = event.price === 0;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/events/${event.id}`);
    }
  };

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200"
      onClick={handleClick}
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {event.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {isPastEvent && (
            <span className="px-3 py-1 bg-gray-800 text-white text-xs font-semibold rounded-full">
              Past Event
            </span>
          )}
          {isSoldOut && (
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
              Sold Out
            </span>
          )}
          {!isPastEvent && !isSoldOut && isFree && (
            <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
              Free
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full">
            {event.category}
          </span>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
            {event.name}
          </h3>
          {!isFree && (
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                ${event.price}
              </div>
              <div className="text-xs text-gray-500">per seat</div>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {seatsAvailable}
              </div>
              <div className="text-xs text-gray-500">Seats left</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {event.coinsPerSeat || event.coinsReward || 0}
              </div>
              <div className="text-xs text-gray-500">Coins</div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
