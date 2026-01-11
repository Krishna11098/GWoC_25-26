// /app/admin/experiences/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { auth } from "@/lib/firebaseClient";

const categories = [
  {
    id: "private_birthdays",
    label: "Private Birthdays",
    description: "Theme-based games & engagement",
    icon: "🎂",
    color: "bg-pink-100 text-pink-800 border-pink-200",
  },
  {
    id: "corporate_events",
    label: "Corporate Events",
    description: "Festivals, milestone celebrations, team-building",
    icon: "🏢",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "monthly_kits",
    label: "Monthly Kits",
    description: "Ready-to-play kits sent to employees",
    icon: "📦",
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "carnivals",
    label: "Carnivals & Zones",
    description: "Large-scale experience zones & activities",
    icon: "🎡",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: "weddings",
    label: "Weddings",
    description: "Custom games, entertainment hampers & interactive setups",
    icon: "💍",
    color: "bg-rose-100 text-rose-800 border-rose-200",
  },
];

const statuses = [
  { value: "all", label: "All Status", color: "bg-gray-100 text-gray-800" },
  {
    value: "unseen",
    label: "Unseen",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    value: "contacted",
    label: "Contacted",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "accepted",
    label: "Accepted",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    value: "rejected",
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-red-200",
  },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "date_asc", label: "Event Date (Asc)" },
  { value: "date_desc", label: "Event Date (Desc)" },
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
];

const budgetRanges = {
  under_25k: "Under ₹25,000",
  "25k_50k": "₹25,000 - ₹50,000",
  "50k_1l": "₹50,000 - ₹1,00,000",
  "1l_2l": "₹1,00,000 - ₹2,00,000",
  over_2l: "Over ₹2,00,000",
  custom: "Custom Budget",
};

const audienceSizes = {
  small: "Small (1-20 people)",
  medium: "Medium (21-50 people)",
  large: "Large (51-100 people)",
  very_large: "Very Large (100+ people)",
};

const eventTypes = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  both: "Both Indoor & Outdoor",
  virtual: "Virtual/Online",
};

async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export default function AdminExperiencesPage() {
  const router = useRouter();
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    unseen: 0,
    accepted: 0,
    rejected: 0,
    contacted: 0,
  });

  useEffect(() => {
    fetchExperiences();
  }, [selectedCategory, selectedStatus, sortBy]);

  useEffect(() => {
    filterAndSortExperiences();
    calculateStats();
  }, [experiences, searchQuery]);

  // Close modals if selected experience becomes null
  useEffect(() => {
    if (!selectedExperience) {
      setIsDetailModalOpen(false);
      setIsUpdateModalOpen(false);
      setAdminNotes("");
    }
  }, [selectedExperience]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `/api/admin/contact-form?status=${selectedStatus}&category=${selectedCategory}&sort=${sortBy}`,
        {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch experiences: ${response.status}`);
      }

      const data = await response.json();

      if (data.experiences) {
        setExperiences(data.experiences || []);
        setFilteredExperiences(data.experiences || []);
      } else {
        throw new Error(data.error || "Failed to load experiences");
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
      alert(`Failed to load experiences: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortExperiences = () => {
    let filtered = [...experiences];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exp) =>
          exp.fullName?.toLowerCase().includes(query) ||
          exp.email?.toLowerCase().includes(query) ||
          exp.eventTitle?.toLowerCase().includes(query) ||
          exp.phone?.includes(query) ||
          exp.companyName?.toLowerCase().includes(query)
      );
    }

    // Client-side sorting for name sorting
    if (sortBy === "name_asc") {
      filtered.sort((a, b) =>
        (a.fullName || "").localeCompare(b.fullName || "")
      );
    } else if (sortBy === "name_desc") {
      filtered.sort((a, b) =>
        (b.fullName || "").localeCompare(a.fullName || "")
      );
    }

    setFilteredExperiences(filtered);
  };

  const calculateStats = () => {
    const newStats = {
      total: experiences.length,
      unseen: experiences.filter((exp) => exp.status === "unseen").length,
      accepted: experiences.filter((exp) => exp.status === "accepted").length,
      rejected: experiences.filter((exp) => exp.status === "rejected").length,
      contacted: experiences.filter((exp) => exp.status === "contacted").length,
    };
    setStats(newStats);
  };

  const handleStatusUpdate = async (experienceId, newStatus) => {
    try {
      // Validate experience ID
      if (!experienceId) {
        console.error("Experience ID is required");
        alert("Error: Experience ID is missing. Please refresh and try again.");
        return;
      }

      setUpdating(experienceId);

      const token = await getAuthToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/admin/contact-form/${experienceId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Update error response:", {
          status: response.status,
          data,
        });
        throw new Error(data.error || "Failed to update status");
      }

      // Update local state
      setExperiences((prev) =>
        prev.map((exp) =>
          exp.id === experienceId
            ? {
                ...exp,
                status: newStatus,
                adminNotes: adminNotes || exp.adminNotes,
                updatedAt: new Date(),
              }
            : exp
        )
      );

      setAdminNotes("");
      alert(`Experience marked as ${newStatus}`);

      // Refresh data
      await fetchExperiences();

      // Close modal to prevent stale data issues
      setIsUpdateModalOpen(false);
      setSelectedExperience(null);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(`Failed to update: ${error.message}`);
    } finally {
      setUpdating(null);
    }
  };

  const openDetailModal = (experience) => {
    setSelectedExperience(experience);
    setIsDetailModalOpen(true);
  };

  const openUpdateModal = (experience) => {
    setSelectedExperience(experience);
    setAdminNotes(experience.adminNotes || "");
    setIsUpdateModalOpen(true);
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId) || categories[0];
  };

  const getStatusInfo = (status) => {
    return statuses.find((s) => s.value === status) || statuses[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy, hh:mm a");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-white">
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Contact Form Requests
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage contact form requests submitted by users
                </p>
              </div>
              <button
                onClick={fetchExperiences}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300 flex items-center gap-2"
              >
                <span>🔄</span>
                Refresh
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="text-2xl font-bold text-yellow-700">
                  {stats.unseen}
                </div>
                <div className="text-sm text-yellow-600">Unseen</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-700">
                  {stats.accepted}
                </div>
                <div className="text-sm text-green-600">Accepted</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="text-2xl font-bold text-red-700">
                  {stats.rejected}
                </div>
                <div className="text-sm text-red-600">Rejected</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-700">
                  {stats.contacted}
                </div>
                <div className="text-sm text-blue-600">Contacted</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, event..."
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Experiences List */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading experiences...</p>
              </div>
            ) : filteredExperiences.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No experiences found
                </h3>
                <p className="text-gray-600">
                  {experiences.length === 0
                    ? "No experience requests have been submitted yet."
                    : "No experiences match your filters."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Name
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Category
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Event
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Date
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Submitted
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExperiences.map((experience) => {
                      const categoryInfo = getCategoryInfo(experience.category);
                      const statusInfo = getStatusInfo(experience.status);

                      return (
                        <tr
                          key={experience.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {experience.fullName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {experience.email}
                              </div>
                              <div className="text-sm text-gray-600">
                                {experience.phone}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {categoryInfo.icon}
                              </span>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {categoryInfo.label}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {experience.companyName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {experience.eventTitle}
                              </div>
                              <div className="text-sm text-gray-600">
                                {experience.venue}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-gray-900">
                              {formatDate(experience.eventDate)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {experience.eventTime}
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} border`}
                            >
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-600">
                              {formatDateTime(experience.submittedAt)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openDetailModal(experience)}
                                className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg text-sm hover:bg-gray-200"
                              >
                                View
                              </button>
                              <button
                                onClick={() => openUpdateModal(experience)}
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                              >
                                Update
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredExperiences.length > 0 && (
              <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {filteredExperiences.length} of {experiences.length}{" "}
                  experiences
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Experience Detail Modal */}
      {isDetailModalOpen && selectedExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedExperience.eventTitle}
                </h2>
                <p className="text-gray-600">
                  Submitted by {selectedExperience.fullName}
                </p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
              ></button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Client Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium text-gray-900">
                          {selectedExperience.fullName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">
                          {selectedExperience.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-900">
                          {selectedExperience.phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company:</span>
                        <span className="font-medium text-gray-900">
                          {selectedExperience.companyName || "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Designation:</span>
                        <span className="font-medium text-gray-900">
                          {selectedExperience.designation || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Event Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Category:</span>
                        <span className="font-medium">
                          {getCategoryInfo(selectedExperience.category).label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Event Date:</span>
                        <span className="font-medium">
                          {formatDate(selectedExperience.eventDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Time:</span>
                        <span className="font-medium">
                          {selectedExperience.eventTime || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Duration:</span>
                        <span className="font-medium">
                          {selectedExperience.eventDuration || "Not specified"}{" "}
                          hours
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Venue:</span>
                        <span className="font-medium">
                          {selectedExperience.venue}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Has Venue:</span>
                        <span className="font-medium">
                          {selectedExperience.hasVenue === "yes"
                            ? "Yes"
                            : selectedExperience.hasVenue === "no"
                            ? "No"
                            : "Needs Help"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Requirements
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Event Type:</span>
                        <span className="font-medium">
                          {eventTypes[selectedExperience.eventType] ||
                            "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Audience Size:</span>
                        <span className="font-medium">
                          {audienceSizes[selectedExperience.audienceSize] ||
                            "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Budget Range:</span>
                        <span className="font-medium">
                          {budgetRanges[selectedExperience.budgetRange] ||
                            "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Preferred Games:</span>
                        <span className="font-medium text-right">
                          {selectedExperience.preferredGames || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">
                          Theme Preferences:
                        </span>
                        <span className="font-medium">
                          {selectedExperience.themePreferences ||
                            "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Special Requirements
                    </h3>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedExperience.specialRequirements ||
                        "No special requirements"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Additional Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-gray-700 mb-1">
                          How they heard about us:
                        </div>
                        <div className="font-medium capitalize">
                          {selectedExperience.howHeard || "Not specified"}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-700 mb-1">Comments:</div>
                        <div className="font-medium whitespace-pre-wrap">
                          {selectedExperience.comments ||
                            "No additional comments"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Submitted on {formatDateTime(selectedExperience.submittedAt)}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    openUpdateModal(selectedExperience);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isUpdateModalOpen && selectedExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Update Experience Status
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedExperience.eventTitle}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {statuses
                    .filter((s) => s.value !== "all")
                    .map((status) => {
                      const isCurrentStatus =
                        selectedExperience?.status === status.value;
                      const isUpdating = updating === selectedExperience?.id;
                      const hasValidId = selectedExperience?.id;

                      return (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() => {
                            if (!hasValidId) {
                              alert(
                                "Error: Experience ID is missing. Please refresh and try again."
                              );
                              return;
                            }
                            if (!isCurrentStatus) {
                              handleStatusUpdate(
                                selectedExperience.id,
                                status.value
                              );
                            }
                          }}
                          disabled={
                            isCurrentStatus || isUpdating || !hasValidId
                          }
                          className={`px-4 py-3 rounded-lg border text-center ${
                            isCurrentStatus
                              ? `${status.color} border-gray-300`
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {status.label}
                        </button>
                      );
                    })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Add any notes or comments..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {selectedExperience.adminNotes && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="text-sm font-medium text-amber-800 mb-1">
                    Previous Notes:
                  </div>
                  <div className="text-sm text-amber-700">
                    {selectedExperience.adminNotes}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
