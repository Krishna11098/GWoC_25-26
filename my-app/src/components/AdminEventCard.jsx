"use client";

import { motion } from "framer-motion";
import { Edit2, Trash2, Eye, Calendar, Users } from "lucide-react";
import { formatDate, getCategoryColor } from "@/lib/utils";

const AdminEventCard = ({ event, onEdit, onDelete, onView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {event.name}
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(
                event.category
              )}`}
            >
              {event.category}
            </span>
            {event.isFeatured && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                Featured
              </span>
            )}
          </div>

          <p className="mb-4 text-sm text-gray-600">{event.shortDescription}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {event.registered || 0}/{event.capacity || 0} registered
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Partner:</span>
              <span className="font-medium">{event.communityPartner}</span>
            </div>
          </div>
        </div>

        <div className="ml-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onView}
            className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50"
            title="View Event"
          >
            <Eye className="h-5 w-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="rounded-lg border border-blue-300 p-2 text-blue-600 hover:bg-blue-50"
            title="Edit Event"
          >
            <Edit2 className="h-5 w-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="rounded-lg border border-red-300 p-2 text-red-600 hover:bg-red-50"
            title="Delete Event"
          >
            <Trash2 className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminEventCard;
