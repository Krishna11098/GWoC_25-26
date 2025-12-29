"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { FaTimes } from "react-icons/fa";

export default function ExperienceForm({
  user,
  editingExperience,
  categories,
  onClose,
}) {
  const [title, setTitle] = useState(editingExperience?.title || "");
  const [body, setBody] = useState(editingExperience?.body || "");
  const [selectedCategory, setSelectedCategory] = useState(
    editingExperience?.category?.id || ""
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const selectedCat = categories.find((c) => c.id === selectedCategory);

      const experienceData = {
        title: title.trim(),
        body: body.trim(),
        category: selectedCat
          ? {
              id: selectedCat.id,
              name: selectedCat.name,
              color: selectedCat.color,
            }
          : null,
        userId: user.uid,
        userName: user.displayName || user.email.split("@")[0],
        userEmail: user.email,
        upvotes: editingExperience?.upvotes || [],
        downvotes: editingExperience?.downvotes || [],
        reports: editingExperience?.reports || [],
        createdAt: editingExperience
          ? editingExperience.createdAt
          : serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (editingExperience) {
        await updateDoc(
          doc(db, "experiences", editingExperience.id),
          experienceData
        );
      } else {
        await addDoc(collection(db, "experiences"), experienceData);
      }

      onClose();
    } catch (error) {
      console.error("Error saving experience:", error);
      alert("Error saving experience. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingExperience ? "Edit Experience" : "Share Your Experience"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="What was your experience about?"
                maxLength={100}
                required
              />
              <p className="text-sm text-gray-500 mt-1">{title.length}/100</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        isSelected
                          ? `${category.color} border-current`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="text-xl" />
                      <span className="text-sm font-medium text-center">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Story *
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Share your experience in detail... (What made it special? What activities did you enjoy? Would you recommend it to others?)"
                maxLength={2000}
                required
              />
              <p className="text-sm text-gray-500 mt-1">{body.length}/2000</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                disabled={loading || !selectedCategory}
              >
                {loading
                  ? "Saving..."
                  : editingExperience
                  ? "Update"
                  : "Share Experience"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
