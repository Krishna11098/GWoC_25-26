"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";

const EventForm = ({ initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    location: initialData?.location || "",
    communityPartner: initialData?.communityPartner || "",
    shortDescription: initialData?.shortDescription || "",
    longDescription: initialData?.longDescription || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    category: initialData?.category || "workshop",
    capacity: initialData?.capacity || 20,
    imageUrl: initialData?.imageUrl || "",
    galleryImages: initialData?.galleryImages || [],
    isFeatured: initialData?.isFeatured || false,
  });

  const [galleryImage, setGalleryImage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addGalleryImage = () => {
    if (galleryImage && !formData.galleryImages.includes(galleryImage)) {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, galleryImage],
      }));
      setGalleryImage("");
    }
  };

  const removeGalleryImage = (image) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((img) => img !== image),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const sampleImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
  ];

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Basic Information */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-900">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Event Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-orange)] focus:ring-opacity-40"
              placeholder="Enter event name"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-orange)] focus:ring-opacity-40"
              placeholder="Enter event location"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Community Partner *
            </label>
            <input
              type="text"
              name="communityPartner"
              value={formData.communityPartner}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-orange)] focus:ring-opacity-40"
              placeholder="Enter community partner name"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-orange)] focus:ring-opacity-40"
            >
              <option value="workshop">Workshop</option>
              <option value="community">Community</option>
              <option value="celebration">Celebration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-900">Date & Time</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-orange)] focus:ring-opacity-40"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Time *
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-orange)] focus:ring-opacity-40"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Capacity *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-orange)] focus:ring-opacity-40"
              min="1"
              required
            />
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-900">Descriptions</h3>
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Short Description *
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows="2"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-orange)] focus:ring-opacity-40"
              placeholder="Brief description for event cards (max 150 chars)"
              maxLength={150}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.shortDescription.length}/150 characters
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Long Description *
            </label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-orange)] focus:ring-opacity-40"
              placeholder="Detailed description for event page"
              required
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-900">Images</h3>

        {/* Main Image */}
        <div className="mb-8">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Main Image URL *
          </label>
          <div className="flex gap-4">
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-orange)] focus:ring-opacity-40"
              placeholder="Enter image URL for event card"
              required
            />
            <div className="flex gap-2">
              {sampleImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, imageUrl: img }))
                  }
                  className="h-12 w-12 overflow-hidden rounded-lg border"
                >
                  <img
                    src={img}
                    alt={`Sample ${index}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {formData.imageUrl && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-600">Preview:</p>
              <div className="relative h-48 w-48 overflow-hidden rounded-lg">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Gallery Images */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Gallery Images
          </label>
          <div className="mb-4 flex gap-4">
            <input
              type="url"
              value={galleryImage}
              onChange={(e) => setGalleryImage(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-orange)] focus:ring-opacity-40"
              placeholder="Enter gallery image URL"
            />
            <button
              type="button"
              onClick={addGalleryImage}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-orange)] px-6 py-3 text-[var(--color-black)] hover:bg-[var(--color-light-orange)]"
            >
              <Plus className="h-4 w-4" />
              Add to Gallery
            </button>
          </div>

          {/* Gallery Preview */}
          {formData.galleryImages.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Gallery ({formData.galleryImages.length} images):
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {formData.galleryImages.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative overflow-hidden rounded-lg"
                  >
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="h-32 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(img)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured & Submit */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="h-5 w-5 rounded border-gray-300 text-[var(--color-dark-teal)] focus:ring-[var(--color-orange)] focus:ring-offset-1"
          />
          <span className="text-sm font-medium text-[var(--color-font)]">
            Mark as Featured Event
          </span>
        </label>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-lg bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-green)] px-8 py-3 text-lg font-semibold text-[var(--color-black)] shadow-md"
        >
          {initialData ? "Update Event" : "Create Event"}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default EventForm;
