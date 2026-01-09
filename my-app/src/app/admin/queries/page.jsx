"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { auth } from "@/lib/firebaseClient";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Support" },
  { value: "feedback", label: "Feedback" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

const statuses = [
  { value: "all", label: "All Status", color: "bg-gray-100 text-gray-800" },
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    value: "responded",
    label: "Responded",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "closed",
    label: "Closed",
    color: "bg-green-100 text-green-800 border-green-200",
  },
];

async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export default function AdminQueriesPage() {
  const router = useRouter();
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    responded: 0,
    closed: 0,
  });

  useEffect(() => {
    fetchQueries();
  }, [selectedCategory, selectedStatus]);

  useEffect(() => {
    filterAndSortQueries();
    calculateStats();
  }, [queries, searchQuery]);

  useEffect(() => {
    if (!selectedQuery) {
      setIsDetailModalOpen(false);
      setIsUpdateModalOpen(false);
      setAdminNotes("");
    }
  }, [selectedQuery]);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/admin/queries`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch queries: ${response.status}`);
      }

      const data = await response.json();

      if (data.queries) {
        setQueries(data.queries || []);
        setFilteredQueries(data.queries || []);
      } else {
        throw new Error(data.error || "Failed to load queries");
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      alert(`Failed to load queries: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortQueries = () => {
    let filtered = [...queries];

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((q) => q.status === selectedStatus);
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((q) => q.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.fullName?.toLowerCase().includes(query) ||
          q.email?.toLowerCase().includes(query) ||
          q.subject?.toLowerCase().includes(query) ||
          q.message?.toLowerCase().includes(query)
      );
    }

    setFilteredQueries(filtered);
  };

  const calculateStats = () => {
    const newStats = {
      total: queries.length,
      pending: queries.filter((q) => q.status === "pending").length,
      responded: queries.filter((q) => q.status === "responded").length,
      closed: queries.filter((q) => q.status === "closed").length,
    };
    setStats(newStats);
  };

  const handleStatusUpdate = async (queryId, newStatus) => {
    try {
      if (!queryId) {
        alert("Error: Query ID is missing");
        return;
      }

      setUpdating(queryId);

      const token = await getAuthToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/admin/queries/${queryId}`, {
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
        throw new Error(data.error || "Failed to update status");
      }

      // Update local state
      setQueries((prev) =>
        prev.map((q) =>
          q.id === queryId
            ? {
                ...q,
                status: newStatus,
                adminNotes: adminNotes || q.adminNotes,
                updatedAt: new Date(),
              }
            : q
        )
      );

      setAdminNotes("");
      alert(`Query marked as ${newStatus}`);

      // Refresh data
      await fetchQueries();

      // Close modal
      setIsUpdateModalOpen(false);
      setSelectedQuery(null);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(`Failed to update: ${error.message}`);
    } finally {
      setUpdating(null);
    }
  };

  const openDetailModal = (query) => {
    setSelectedQuery(query);
    setIsDetailModalOpen(true);
  };

  const openUpdateModal = (query) => {
    setSelectedQuery(query);
    setAdminNotes(query.adminNotes || "");
    setIsUpdateModalOpen(true);
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find((cat) => cat.value === categoryId) || categories[0];
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
      <div className="flex min-h-screen bg-background">
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-font">
                  Contact Queries
                </h1>
                <p className="text-font-2 mt-2">
                  Manage all contact form queries from users
                </p>
              </div>
              <button
                onClick={fetchQueries}
                className="px-4 py-2 bg-foreground text-font-2 rounded-lg hover:opacity-90 flex items-center gap-2"
              >
                <span>🔄</span>
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-background-2 rounded-xl border border-foreground/20 p-4">
              <div className="text-2xl font-bold text-font">{stats.total}</div>
              <div className="text-sm text-font-2">Total Queries</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-700">
                {stats.pending}
              </div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-700">
                {stats.responded}
              </div>
              <div className="text-sm text-blue-600">Responded</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-700">
                {stats.closed}
              </div>
              <div className="text-sm text-green-600">Closed</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-background-2 rounded-xl border border-foreground/20 p-6 mb-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-font-2 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, subject..."
                  className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-font-2 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-font-2 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Queries List */}
          <div className="bg-background-2 rounded-xl border border-foreground/20 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
                <p className="mt-4 text-font-2">Loading queries...</p>
              </div>
            ) : filteredQueries.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-font mb-2">
                  No queries found
                </h3>
                <p className="text-font-2">
                  {queries.length === 0
                    ? "No contact queries have been submitted yet."
                    : "No queries match your filters."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-foreground/5 border-b border-foreground/20">
                      <th className="text-left p-4 text-sm font-medium text-font-2">
                        Name
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-font-2">
                        Category
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-font-2">
                        Subject
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-font-2">
                        Status
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-font-2">
                        Submitted
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-font-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQueries.map((query) => {
                      const categoryInfo = getCategoryInfo(query.category);
                      const statusInfo = getStatusInfo(query.status);

                      return (
                        <tr
                          key={query.id}
                          className="border-b border-foreground/10 hover:bg-foreground/5"
                        >
                          <td className="p-4">
                            <div>
                              <div className="font-medium text-font">
                                {query.fullName}
                              </div>
                              <div className="text-sm text-font-2">
                                {query.email}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-medium text-font">
                              {categoryInfo.label}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-medium text-font">
                              {query.subject || "No subject"}
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
                            <div className="text-sm">
                              {formatDateTime(query.createdAt)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openDetailModal(query)}
                                className="px-3 py-1 bg-background border border-foreground/20 rounded-lg text-sm hover:bg-foreground/5"
                              >
                                View
                              </button>
                              <button
                                onClick={() => openUpdateModal(query)}
                                className="px-3 py-1 bg-foreground text-font-2 rounded-lg text-sm hover:opacity-90"
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
          </div>
        </main>
      </div>

      {/* Query Detail Modal */}
      {isDetailModalOpen && selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] bg-white overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-foreground/20 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-font">
                  {selectedQuery.subject || "No Subject"}
                </h2>
                <p className="text-font-2">From {selectedQuery.fullName}</p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-2xl leading-none text-font-2 hover:text-font"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-background-2 rounded-xl p-4">
                  <h3 className="font-bold text-font mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-font-2">Full Name:</span>
                      <span className="font-medium">
                        {selectedQuery.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-font-2">Email:</span>
                      <span className="font-medium">{selectedQuery.email}</span>
                    </div>
                    {selectedQuery.phone && (
                      <div className="flex justify-between">
                        <span className="text-font-2">Phone:</span>
                        <span className="font-medium">
                          {selectedQuery.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Query Details */}
                <div className="bg-background-2 rounded-xl p-4">
                  <h3 className="font-bold text-font mb-4">Query Details</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-font-2 mb-1">Category:</div>
                      <div className="font-medium">
                        {getCategoryInfo(selectedQuery.category).label}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-font-2 mb-1">Status:</div>
                      <div className="font-medium">
                        {getStatusInfo(selectedQuery.status).label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-background-2 rounded-xl p-4">
                  <h3 className="font-bold text-font mb-4">Message</h3>
                  <p className="text-font whitespace-pre-wrap">
                    {selectedQuery.message}
                  </p>
                </div>

                {/* Admin Notes */}
                {selectedQuery.adminNotes && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="text-sm font-medium text-amber-800 mb-1">
                      Admin Notes:
                    </div>
                    <div className="text-sm text-amber-700 whitespace-pre-wrap">
                      {selectedQuery.adminNotes}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-foreground/20 flex justify-between items-center">
              <div className="text-sm text-font-2">
                Submitted on {formatDateTime(selectedQuery.createdAt)}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    openUpdateModal(selectedQuery);
                  }}
                  className="px-4 py-2 bg-foreground text-font-2 rounded-lg hover:opacity-90"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 border border-foreground/20 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isUpdateModalOpen && selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl w-full max-w-md bg-white">
            <div className="p-6 border-b border-foreground/20">
              <h2 className="text-xl font-bold text-font">
                Update Query Status
              </h2>
              <p className="text-font-2 mt-1">{selectedQuery.subject}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-font-2 mb-2">
                  Status
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {statuses
                    .filter((s) => s.value !== "all")
                    .map((status) => {
                      const isCurrentStatus =
                        selectedQuery?.status === status.value;
                      const isUpdating = updating === selectedQuery?.id;

                      return (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() => {
                            if (!isCurrentStatus) {
                              handleStatusUpdate(
                                selectedQuery.id,
                                status.value
                              );
                            }
                          }}
                          disabled={isCurrentStatus || isUpdating}
                          className={`px-4 py-3 rounded-lg border text-center ${
                            isCurrentStatus
                              ? `${status.color} border-foreground`
                              : "border-foreground/20 hover:border-foreground/40"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {status.label}
                        </button>
                      );
                    })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-font-2 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Add any notes or comments..."
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg"
                />
              </div>

              {selectedQuery.adminNotes && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="text-sm font-medium text-amber-800 mb-1">
                    Previous Notes:
                  </div>
                  <div className="text-sm text-amber-700">
                    {selectedQuery.adminNotes}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-foreground/20 flex justify-end gap-3">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 border border-foreground/20 rounded-lg"
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
