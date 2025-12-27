"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Download, Share2 } from "lucide-react";

const GalleryLightbox = ({ images, selectedIndex, onClose, onNavigate }) => {
  if (!images || images.length === 0) return null;

  const currentImage = images[selectedIndex];

  const goToPrevious = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1;
    onNavigate(newIndex);
  };

  const goToNext = () => {
    const newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0;
    onNavigate(newIndex);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = currentImage;
    link.download = `joy-juncture-image-${selectedIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Joy Juncture Event Image",
          text: "Check out this image from Joy Juncture!",
          url: currentImage,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(currentImage);
      alert("Image URL copied to clipboard!");
    }
  };

  return (
    <AnimatePresence>
      {selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute right-6 top-6 z-10 text-white hover:text-gray-300"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-6 top-1/2 z-10 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <ChevronLeft className="h-12 w-12" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-6 top-1/2 z-10 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <ChevronRight className="h-12 w-12" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-6 right-6 z-10 flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm hover:bg-white/30"
              title="Download"
            >
              <Download className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm hover:bg-white/30"
              title="Share"
            >
              <Share2 className="h-6 w-6" />
            </button>
          </div>

          {/* Image */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-h-[80vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt={`Gallery image ${selectedIndex + 1}`}
              className="max-h-[80vh] max-w-full object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryLightbox;
