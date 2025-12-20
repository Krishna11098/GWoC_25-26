"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  LogOut,
  Calendar,
  Users,
  TrendingUp,
  Package,
} from "lucide-react";
import AdminEventCard from "@/components/AdminEventCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Toast from "@/components/Toast";
import { useAuth } from "@/context/AuthContext";
import { getAllEvents, deleteEvent } from "@/lib/events";
import { logout } from "@/lib/auth";

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
      return;
    }
    loadEvents();
  }, [user, router]);

  const loadEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      showToast("Error loading events", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      await deleteEvent(eventToDelete);
      setEvents(events.filter((e) => e.id !== eventToDelete));
      showToast("Event deleted successfully", "success");
    } catch (error) {
      showToast("Error deleting event", "error");
    } finally {
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const stats = {
    totalEvents: events.length,
    totalCapacity: events.reduce(
      (sum, event) => sum + (event.capacity || 0),
      0
    ),
    totalRegistered: events.reduce(
      (sum, event) => sum + (event.registered || 0),
      0
    ),
    featuredEvents: events.filter((event) => event.isFeatured).length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage events and workshops</p>
              {user && (
                <p className="mt-1 text-sm text-gray-500">
                  Logged in as: {user.email}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/admin/create")}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-semibold text-white hover:opacity-90"
              >
                <Plus className="h-5 w-5" />
                New Event
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold">{stats.totalCapacity}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Registered</p>
                <p className="text-2xl font-bold">{stats.totalRegistered}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3">
                <Calendar className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Featured Events</p>
                <p className="text-2xl font-bold">{stats.featuredEvents}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Events List */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            All Events ({events.length})
          </h2>
          <p className="text-gray-600">Manage your events and workshops</p>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {events.map((event) => (
              <AdminEventCard
                key={event.id}
                event={event}
                onEdit={() => router.push(`/admin/edit/${event.id}`)}
                onDelete={() => {
                  setEventToDelete(event.id);
                  setShowDeleteModal(true);
                }}
                onView={() => router.push(`/events/${event.id}/gallery`)}
              />
            ))}
          </AnimatePresence>
        </div>

        {events.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No events yet
            </h3>
            <p className="mb-6 text-gray-600">
              Create your first event to get started
            </p>
            <button
              onClick={() => router.push("/admin/create")}
              className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white"
            >
              Create First Event
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Delete Event
              </h3>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete this event? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                >
                  Delete Event
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
