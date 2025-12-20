"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
  Share2,
  Download,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import GalleryLightbox from "@/components/GalleryLightbox";
import { getEventById } from "@/lib/events";
import { formatDate } from "@/lib/utils";

export default function GalleryPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    loadEvent();
  }, [params.id]);

  const loadEvent = async () => {
    try {
      const data = await getEventById(params.id);
      setEvent(data);
    } catch (error) {
      console.error("Error loading event:", error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Event not found
          </h1>
          <p className="text-gray-600">
            The gallery you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/events")}
            className="mt-4 rounded-lg bg-purple-600 px-6 py-2 text-white"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <button
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Events
            </button>

            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              {event.name} Gallery
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-purple-500">📅</span>
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500">📍</span>
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">🤝</span>
                <span>Partner: {event.communityPartner}</span>
              </div>
            </div>

            <p className="mt-4 text-gray-700">{event.shortDescription}</p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-12">
        {event.galleryImages?.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="mb-4 text-6xl">📷</div>
            <p className="text-gray-600">No gallery images available yet.</p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {event.galleryImages?.length} Photo
                {event.galleryImages?.length !== 1 ? "s" : ""}
              </h2>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                  <Share2 className="h-4 w-4" />
                  Share Gallery
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {event.galleryImages?.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm">Click to view</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      <GalleryLightbox
        images={event.galleryImages || []}
        selectedIndex={selectedImageIndex}
        onClose={closeLightbox}
        onNavigate={setSelectedImageIndex}
      />
    </div>
  );
}
