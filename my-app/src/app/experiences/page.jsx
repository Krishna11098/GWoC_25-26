"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  where,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaFlag,
  FaShare,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaCalendar,
  FaBriefcase,
  FaBoxOpen,
  FaMusic,
  FaRing,
  FaBirthdayCake,
  FaTimes,
  FaEyeSlash,
  FaExclamationTriangle,
} from "react-icons/fa";
import LoginModal from "@/components/LoginModal";
import ExperienceForm from "@/components/ExperienceForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSettings } from "@/context/SettingsContext";

// Experience Categories
const EXPERIENCE_CATEGORIES = [
  {
    id: "private-birthdays",
    name: "Private Birthdays",
    description: "Theme-based games & engagement",
    icon: FaBirthdayCake,
    color: "bg-pink-100 text-pink-700 border-pink-200",
  },
  {
    id: "corporate-events",
    name: "Corporate Events & Team Building",
    description: "Festivals, milestone celebrations, team-building",
    icon: FaBriefcase,
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "monthly-kits",
    name: "Monthly Corporate Engagement Kits",
    description: "Ready-to-play kits sent to employees",
    icon: FaBoxOpen,
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    id: "carnivals",
    name: "Carnivals & Experience Zones",
    description: "Large-scale experience zones & activities",
    icon: FaMusic,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    id: "weddings",
    name: "Weddings & Entertainment Hampers",
    description: "Custom games, entertainment hampers & interactive setups",
    icon: FaRing,
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: "general",
    name: "General Experiences",
    description: "Other JogJuncture experiences",
    icon: FaCalendar,
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
];

export default function ExperiencesPage() {
  const { settings } = useSettings();
  const [user, loading] = useAuthState(auth);
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  // Get settings values
  const autoHideReportedContent = settings?.autoHideReportedContent !== false; // Default true
  const autoBanThreshold = settings?.autoBanReportThreshold || 3;

  // Fetch experiences in real-time
  useEffect(() => {
    const q = query(
      collection(db, "experiences"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const experiencesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExperiences(experiencesData);
      setFilteredExperiences(experiencesData);
    });
    return () => unsubscribe();
  }, []);

  // Apply filters whenever dependencies change
  useEffect(() => {
    let filtered = [...experiences];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((exp) =>
        selectedCategories.includes(exp.category?.id || "general")
      );
    }

    // AUTO-HIDE REPORTED CONTENT FILTER
    if (autoHideReportedContent) {
      filtered = filtered.filter((exp) => {
        // Always show content to the owner
        if (exp.userId === user?.uid) {
          return true;
        }

        // Don't show hidden content
        if (exp.isHidden) {
          return false;
        }

        // Check if content has too many reports
        const reportCount = exp.reports?.length || 0;
        const isHiddenByReports = reportCount >= autoBanThreshold;

        return !isHiddenByReports;
      });
    }

    // Sort filter
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt?.toDate() - a.createdAt?.toDate();
        case "oldest":
          return a.createdAt?.toDate() - b.createdAt?.toDate();
        case "most-popular":
          const aScore = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
          const bScore = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
          return bScore - aScore;
        case "most-upvoted":
          return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
        default:
          return 0;
      }
    });

    setFilteredExperiences(filtered);
  }, [
    experiences,
    selectedCategories,
    sortBy,
    autoHideReportedContent,
    autoBanThreshold,
    user,
  ]);

  // Calculate statistics about hidden content
  const getContentStats = () => {
    const hiddenByReports = experiences.filter((exp) => {
      if (exp.isHidden) return false;
      const reportCount = exp.reports?.length || 0;
      return reportCount >= autoBanThreshold;
    }).length;

    const totalHidden = experiences.filter((exp) => exp.isHidden).length;
    const visibleContent = experiences.length - totalHidden - hiddenByReports;

    return { hiddenByReports, totalHidden, visibleContent };
  };

  const contentStats = getContentStats();

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortBy("newest");
  };

  const handleVote = async (experienceId, type) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const experienceRef = doc(db, "experiences", experienceId);
    const userId = user.uid;

    try {
      // Find the current experience to check existing votes
      const currentExp = experiences.find((exp) => exp.id === experienceId);

      if (type === "upvote") {
        // Toggle logic: if already upvoted, remove it
        if (currentExp?.upvotes?.includes(userId)) {
          await updateDoc(experienceRef, {
            upvotes: arrayRemove(userId),
          });
        } else {
          // Add upvote and remove downvote if exists
          const updateData = {
            upvotes: arrayUnion(userId),
          };

          // Only add downvotes removal if user had downvoted
          if (currentExp?.downvotes?.includes(userId)) {
            updateData.downvotes = arrayRemove(userId);
          }

          await updateDoc(experienceRef, updateData);
        }
      } else {
        // Downvote toggle logic
        if (currentExp?.downvotes?.includes(userId)) {
          await updateDoc(experienceRef, {
            downvotes: arrayRemove(userId),
          });
        } else {
          // Add downvote and remove upvote if exists
          const updateData = {
            downvotes: arrayUnion(userId),
          };

          if (currentExp?.upvotes?.includes(userId)) {
            updateData.upvotes = arrayRemove(userId);
          }

          await updateDoc(experienceRef, updateData);
        }
      }

      console.log("Vote successful!");
    } catch (error) {
      console.error("Error voting:", error);
      alert("Error voting: " + error.message);
    }
  };

  const handleReport = async (experienceId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Check if user already reported this experience
    const experience = experiences.find((exp) => exp.id === experienceId);
    if (experience?.reports?.some((report) => report.reporterId === user.uid)) {
      alert("You have already reported this experience.");
      return;
    }

    try {
      // Create report document
      await addDoc(collection(db, "reports"), {
        experienceId,
        reporterId: user.uid,
        reporterEmail: user.email,
        reportedAt: serverTimestamp(),
        status: "pending",
        experienceTitle: experience?.title || "Untitled",
        userName: experience?.userName || "Unknown",
      });

      // Update experience document with report
      const newReport = {
        reporterId: user.uid,
        reportedAt: new Date().toISOString(),
        reporterEmail: user.email,
      };

      await updateDoc(doc(db, "experiences", experienceId), {
        reports: arrayUnion(newReport),
        lastReportedAt: serverTimestamp(),
      });

      // Check if content should be hidden after this report
      const updatedReportCount = (experience?.reports?.length || 0) + 1;
      if (autoHideReportedContent && updatedReportCount >= autoBanThreshold) {
        await updateDoc(doc(db, "experiences", experienceId), {
          isHidden: true,
          hiddenAt: serverTimestamp(),
          hiddenReason: `Auto-hidden: ${updatedReportCount} reports (threshold: ${autoBanThreshold})`,
        });
      }

      alert("Experience reported successfully. Admin will review it.");
    } catch (error) {
      console.error("Error reporting:", error);
      alert("Error reporting experience: " + error.message);
    }
  };

  const handleShare = (experience) => {
    const shareUrl = `${window.location.origin}/experiences/${experience.id}`;
    if (navigator.share) {
      navigator.share({
        title: experience.title,
        text: experience.body.substring(0, 100) + "...",
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  const handleDelete = async (experienceId) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await deleteDoc(doc(db, "experiences", experienceId));
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const handleEdit = (experience) => {
    if (experience.userId !== user?.uid) {
      alert("You can only edit your own experiences");
      return;
    }
    setEditingExperience(experience);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="pt-28">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Community Experiences
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Share your JogJuncture stories, connect with fellow enthusiasts,
              and discover amazing experiences from our community.
            </p>

            <button
              onClick={() =>
                user ? setShowForm(true) : setShowLoginModal(true)
              }
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full flex items-center justify-center mx-auto gap-2 transition-all duration-300 transform hover:scale-105"
            >
              <FaPlus /> Share Your Experience
            </button>
          </section>

          {/* Content Stats Bar */}
          <div className="mb-6 p-4 bg-white rounded-xl shadow">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {contentStats.visibleContent} visible experiences
                  </span>
                </div>

                {contentStats.hiddenByReports > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      {contentStats.hiddenByReports} hidden due to reports
                    </span>
                  </div>
                )}

                {contentStats.totalHidden > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      {contentStats.totalHidden} manually hidden
                    </span>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500">
                {autoHideReportedContent
                  ? `Content with ${autoBanThreshold}+ reports is automatically hidden`
                  : "All content is visible (auto-hide disabled)"}
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Filter Experiences
                </h2>
                <p className="text-gray-600">
                  Browse experiences by category or sort by popularity
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most-popular">Most Popular</option>
                  <option value="most-upvoted">Most Upvoted</option>
                  <option value="most-reported">Most Reported</option>
                </select>
              </div>
            </div>

            {/* Filter Controls */}
            {showFilters && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Categories
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    <FaTimes /> Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {EXPERIENCE_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategories.includes(category.id);

                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                          isSelected
                            ? `${category.color} border-current transform scale-[1.02]`
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected
                              ? "bg-white"
                              : category.color.split(" ")[0]
                          }`}
                        >
                          <Icon
                            className={
                              isSelected
                                ? category.color.split(" ")[1]
                                : "text-gray-600"
                            }
                          />
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-800">
                            {category.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {category.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Auto-hide info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <FaEyeSlash className="text-gray-400" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">
                        Auto-hide Reported Content
                      </h4>
                      <p className="text-xs text-gray-500">
                        {autoHideReportedContent
                          ? `Content with ${autoBanThreshold} or more reports is automatically hidden from public view`
                          : "All content is visible regardless of reports"}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          autoHideReportedContent
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {autoHideReportedContent ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Active Filters Badges */}
                {selectedCategories.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Active Filters:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((categoryId) => {
                        const category = EXPERIENCE_CATEGORIES.find(
                          (c) => c.id === categoryId
                        );
                        return (
                          <span
                            key={categoryId}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700"
                          >
                            {category?.name}
                            <button
                              onClick={() => handleCategoryToggle(categoryId)}
                              className="hover:text-purple-900"
                            >
                              <FaTimes size={12} />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Experiences Grid */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredExperiences.length} Experience
                {filteredExperiences.length !== 1 ? "s" : ""} Found
              </h2>
              <span className="text-gray-600">
                {selectedCategories.length > 0
                  ? `Showing ${selectedCategories.length} categor${
                      selectedCategories.length > 1 ? "ies" : "y"
                    }`
                  : "Showing all categories"}
              </span>
            </div>

            {filteredExperiences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredExperiences.map((experience) => {
                  const category =
                    EXPERIENCE_CATEGORIES.find(
                      (c) => c.id === experience.category?.id
                    ) || EXPERIENCE_CATEGORIES[5];
                  const Icon = category.icon;

                  // Calculate report stats
                  const reportCount = experience.reports?.length || 0;
                  const isHidden = experience.isHidden;
                  const isAutoHidden =
                    autoHideReportedContent && reportCount >= autoBanThreshold;
                  const isVisible = !isHidden && !isAutoHidden;
                  const isNearThreshold =
                    reportCount >= autoBanThreshold - 1 &&
                    reportCount < autoBanThreshold;

                  // NEW: Check if current user has reported this
                  const userReported = experience.reports?.some(
                    (report) => report.reporterId === user?.uid
                  );

                  return (
                    <div
                      key={experience.id}
                      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border ${
                        !isVisible
                          ? "border-red-200 opacity-75"
                          : isNearThreshold
                          ? "border-yellow-200"
                          : "border-gray-200"
                      } group`}
                    >
                      <div className="p-6">
                        {/* Content Status Badges - UPDATED */}
                        <div className="flex justify-between items-start mb-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${category.color}`}
                          >
                            <Icon size={12} /> {category.name}
                          </span>

                          {/* UPDATED: Report Status Badge with user reporting info */}
                          {reportCount > 0 && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                reportCount >= autoBanThreshold
                                  ? "bg-red-100 text-red-700"
                                  : userReported
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <FaFlag size={10} /> {reportCount} report
                              {reportCount !== 1 ? "s" : ""}
                              {userReported && " (you)"}
                            </span>
                          )}

                          {!isVisible && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <FaEyeSlash size={10} /> Hidden
                            </span>
                          )}

                          {/* Edit/Delete buttons for owner */}
                          {user?.uid === experience.userId && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(experience)}
                                className="text-blue-500 hover:text-blue-700 p-1"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(experience.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Warning for content with many reports */}
                        {isNearThreshold && (
                          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-xs text-yellow-700 flex items-center gap-1">
                              <FaExclamationTriangle size={12} />
                              {reportCount} report{reportCount !== 1 ? "s" : ""}{" "}
                              - {autoBanThreshold - reportCount} more until
                              hidden
                            </p>
                          </div>
                        )}

                        {!isVisible && (
                          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs text-red-700 flex items-center gap-1">
                              <FaEyeSlash size={12} />
                              {isAutoHidden
                                ? `Hidden: ${reportCount} reports exceeds threshold of ${autoBanThreshold}`
                                : "Hidden by admin"}
                            </p>
                          </div>
                        )}

                        {/* Experience Header */}
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                            {experience.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {experience.userName} •{" "}
                            {new Date(
                              experience.createdAt?.toDate()
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Experience Body */}
                        <div className="mb-6">
                          <p
                            className={`${
                              !isVisible ? "text-gray-500" : "text-gray-700"
                            } line-clamp-4`}
                          >
                            {experience.body}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <FaThumbsUp className="text-green-500" />
                              {experience.upvotes?.length || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaThumbsDown className="text-red-500" />
                              {experience.downvotes?.length || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isVisible ? "bg-green-500" : "bg-red-500"
                              } animate-pulse`}
                            ></span>
                            <span>{isVisible ? "Visible" : "Hidden"}</span>
                          </div>
                        </div>

                        {/* Action Buttons - UPDATED REPORT BUTTON */}
                        <div className="flex justify-between border-t pt-4">
                          <div className="flex gap-4">
                            <button
                              onClick={() =>
                                handleVote(experience.id, "upvote")
                              }
                              disabled={!isVisible}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                                !isVisible
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : experience.upvotes?.includes(user?.uid)
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700 hover:bg-green-50"
                              }`}
                              title={
                                !isVisible
                                  ? "Cannot vote on hidden content"
                                  : ""
                              }
                            >
                              <FaThumbsUp /> Upvote
                            </button>

                            <button
                              onClick={() =>
                                handleVote(experience.id, "downvote")
                              }
                              disabled={!isVisible}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                                !isVisible
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : experience.downvotes?.includes(user?.uid)
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700 hover:bg-red-50"
                              }`}
                              title={
                                !isVisible
                                  ? "Cannot vote on hidden content"
                                  : ""
                              }
                            >
                              <FaThumbsDown /> Downvote
                            </button>
                          </div>

                          <div className="flex gap-2">
                            {/* UPDATED: Report button with better styling and disabled state */}
                            <button
                              onClick={() => handleReport(experience.id)}
                              disabled={userReported || !isVisible}
                              className={`p-2 rounded transition-colors ${
                                userReported
                                  ? "text-orange-600 cursor-not-allowed"
                                  : !isVisible
                                  ? "text-gray-400 cursor-not-allowed"
                                  : reportCount > 0
                                  ? "text-red-500 hover:text-red-700"
                                  : "text-gray-500 hover:text-red-600"
                              }`}
                              title={
                                userReported
                                  ? "You already reported this"
                                  : !isVisible
                                  ? "Cannot report hidden content"
                                  : "Report"
                              }
                            >
                              <FaFlag />
                            </button>

                            <button
                              onClick={() => handleShare(experience)}
                              disabled={!isVisible}
                              className={`p-2 rounded transition-colors ${
                                !isVisible
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-gray-500 hover:text-purple-600"
                              }`}
                              title={
                                !isVisible
                                  ? "Cannot share hidden content"
                                  : "Share"
                              }
                            >
                              <FaShare />
                            </button>
                          </div>
                        </div>

                        {/* Report info for visible content */}
                        {isVisible && reportCount > 0 && (
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                              This content has {reportCount} report
                              {reportCount !== 1 ? "s" : ""}.
                              {isNearThreshold &&
                                ` ${
                                  autoBanThreshold - reportCount
                                } more report${
                                  autoBanThreshold - reportCount !== 1
                                    ? "s"
                                    : ""
                                } will hide it.`}
                              {userReported &&
                                " You have reported this content."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  No experiences found
                </h3>
                <p className="text-gray-500 mb-6">
                  {selectedCategories.length > 0
                    ? "Try adjusting your filters or "
                    : contentStats.hiddenByReports > 0
                    ? `${contentStats.hiddenByReports} experiences are hidden due to reports. `
                    : "Be the first to share your experience!"}
                </p>
                <div className="flex gap-4 justify-center">
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={() =>
                      user ? setShowForm(true) : setShowLoginModal(true)
                    }
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Share Your Experience
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Category Highlights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Experience Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXPERIENCE_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const categoryCount = experiences.filter(
                  (exp) =>
                    exp.category?.id === category.id ||
                    (category.id === "general" && !exp.category?.id)
                ).length;

                return (
                  <div
                    key={category.id}
                    className={`p-6 rounded-2xl border-2 ${category.color} hover:shadow-lg transition-shadow cursor-pointer`}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="text-2xl" />
                      <span className="text-sm font-medium bg-white/50 px-2 py-1 rounded">
                        {categoryCount} experiences
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {/* Modals */}
      {showForm && (
        <ExperienceForm
          user={user}
          editingExperience={editingExperience}
          categories={EXPERIENCE_CATEGORIES}
          onClose={() => {
            setShowForm(false);
            setEditingExperience(null);
          }}
        />
      )}

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      <Footer />
    </div>
  );
}
