"use client";

import { useState } from "react";

export default function EventFilters({ filters, onFilterChange, categories }) {
  const [searchQuery, setSearchQuery] = useState(filters.search || "");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onFilterChange("search", value);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange("category", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange("type", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Types</option>
            <option value="free">Free Events</option>
            <option value="paid">Paid Events</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <select
            value={filters.date}
            onChange={(e) => onFilterChange("date", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Dates</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past Events</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.category !== "all" && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            {filters.category}
            <button
              onClick={() => onFilterChange("category", "all")}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        )}

        {filters.type !== "all" && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            {filters.type === "free" ? "Free Events" : "Paid Events"}
            <button
              onClick={() => onFilterChange("type", "all")}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </span>
        )}

        {filters.date !== "all" && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
            {filters.date === "upcoming" ? "Upcoming" : "Past Events"}
            <button
              onClick={() => onFilterChange("date", "all")}
              className="ml-2 text-purple-600 hover:text-purple-800"
            >
              ×
            </button>
          </span>
        )}

        {filters.search && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
            Search: {filters.search}
            <button
              onClick={() => {
                setSearchQuery("");
                onFilterChange("search", "");
              }}
              className="ml-2 text-yellow-600 hover:text-yellow-800"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
