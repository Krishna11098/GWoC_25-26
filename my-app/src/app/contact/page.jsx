"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Tent,
  Check,
  X,
  User,
  Target,
  Cake,
  Building2,
  Package,
  FerrisWheel,
  Gem,              // ✅ valid icon
  MessageSquare,
  Palette,
  Rocket,
  PartyPopper,
} from "lucide-react";



const categories = [
  {
    id: "private_birthdays",
    label: "Private Birthdays: Theme-based games & engagement",
    icon: <Cake className="text-pink-500" />,
  },
  {
    id: "corporate_events",
    label:
      "Corporate Events & Team Building: Festivals, milestone celebrations, team-building",
    icon: <Building2 className="text-blue-500" />,
  },
  {
    id: "monthly_kits",
    label:
      "Monthly Corporate Engagement Kits: Ready-to-play kits sent to employees",
    icon: <Package className="text-amber-500" />,
  },
  {
    id: "carnivals",
    label:
      "Carnivals & Experience Zones: Large-scale experience zones & activities",
    icon: <FerrisWheel className="text-purple-500" />,
  },
 {
  id: "weddings",
  label:
    "Weddings & Entertainment Hampers: Custom games, entertainment hampers & interactive setups",
  icon: <Gem className="text-yellow-600" />,
},

];

const eventTypes = [
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
  { value: "both", label: "Both Indoor & Outdoor" },
  { value: "virtual", label: "Virtual/Online" },
];

const audienceSizes = [
  { value: "small", label: "Small (1-20 people)" },
  { value: "medium", label: "Medium (21-50 people)" },
  { value: "large", label: "Large (51-100 people)" },
  { value: "very_large", label: "Very Large (100+ people)" },
];

export default function ExperienceFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    designation: "",

    // Event Details
    category: "",
    eventTitle: "",
    eventDate: "",
    eventTime: "",
    eventDuration: "2",
    venue: "",
    eventType: "",
    audienceSize: "",

    // Requirements
    budgetRange: "",
    specialRequirements: "",
    preferredGames: "",
    themePreferences: "",
    hasVenue: "no",

    // Additional Info
    howHeard: "",
    comments: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return "Full name is required";
    }
    if (!formData.email.trim()) {
      return "Email is required";
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      return "Phone number is required";
    }
    if (!formData.category) {
      return "Please select a category";
    }
    if (!formData.eventTitle.trim()) {
      return "Event title is required";
    }
    if (!formData.eventDate) {
      return "Event date is required";
    }
    if (!formData.venue.trim()) {
      return "Venue is required";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Format data for submission
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        status: "pending",
      };

      console.log("Submitting experience request:", submissionData);

      // Submit to API
      const response = await fetch("/api/contact-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      if (data.success) {
        setSuccess(
          "Your details have been submitted successfully! We'll contact you soon."
        );
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          companyName: "",
          designation: "",
          category: "",
          eventTitle: "",
          eventDate: "",
          eventTime: "",
          eventDuration: "2",
          venue: "",
          eventType: "",
          audienceSize: "",
          budgetRange: "",
          specialRequirements: "",
          preferredGames: "",
          themePreferences: "",
          hasVenue: "no",
          howHeard: "",
          comments: "",
        });

        // Scroll to top
        window.scrollTo(0, 0);
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-font px-4 py-10 md:px-8 mt-32">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4 text-orange-500">
              <Tent size={64} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-font mb-4">
              Book an Experience
            </h1>
            <p className="text-font-2 text-lg max-w-3xl mx-auto leading-relaxed">
              Fill out this form to request a customized experience. Our team
              will review your request and get back to you within 24 hours.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <PartyPopper className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-green-800 font-medium">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section 1: Personal Information */}
            <div className="bg-background-2 rounded-2xl border border-foreground/20 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-foreground/10 rounded-xl flex items-center justify-center">
                  <User className="text-font" />
                </div>
                <h2 className="text-2xl font-bold text-font">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Designation/Role
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Event Details */}
            <div className="bg-background-2 rounded-2xl border border-foreground/20 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-foreground/10 rounded-xl flex items-center justify-center">
                  <Target className="text-font" />
                </div>
                <h2 className="text-2xl font-bold text-font">Event Details</h2>
              </div>

              {/* Category Selection */}
              <div className="mb-10">
                <label className="block text-sm font-bold text-font-2 mb-4">
                  Select Experience Category *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, category: cat.id }))
                      }
                      className={`border-2 rounded-xl p-5 cursor-pointer transition-all transform hover:scale-105 ${
                        formData.category === cat.id
                          ? "border-foreground bg-foreground/8 shadow-md"
                          : "border-foreground/20 hover:border-foreground/40 bg-background hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">{cat.icon}</div>
                        <div className="flex-1">
                          <div className="font-bold text-font text-base">
                            {cat.label}
                          </div>
                        </div>
                        {formData.category === cat.id && (
                          <div className="flex items-center justify-center flex-shrink-0">
                            <div className="absolute w-8 h-8 bg-foreground rounded-full animate-pulse"></div>
                            <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center relative z-10">
                              <Check className="text-background" size={16} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Event Title/Name *
                  </label>
                  <input
                    type="text"
                    name="eventTitle"
                    value={formData.eventTitle}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                    placeholder="e.g., Annual Team Building Event"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Event Time
                  </label>
                  <input
                    type="time"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    name="eventDuration"
                    value={formData.eventDuration}
                    onChange={handleChange}
                    min="1"
                    max="24"
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                    placeholder="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Venue/Location *
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                    placeholder="Enter venue address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Do you have a venue?
                  </label>
                  <div className="flex gap-4">
                    {["yes", "no", "need_help"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="hasVenue"
                          value={option}
                          checked={formData.hasVenue === option}
                          onChange={handleChange}
                          className="text-foreground"
                        />
                        <span className="text-font">
                          {option === "yes"
                            ? "Yes"
                            : option === "no"
                            ? "No"
                            : "Need Help"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Event Type Selection */}
              <div className="mb-8 mt-8">
                <label className="block text-sm font-bold text-font-2 mb-4">
                  Event Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {eventTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          eventType: type.value,
                        }))
                      }
                      className={`border-2 rounded-lg p-3 font-bold transition-all text-base text-center ${
                        formData.eventType === type.value
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/20 text-font hover:border-foreground/40 bg-background"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display selected event type */}
              {formData.eventType && (
                <div className="mb-8 p-4 bg-foreground/5 border border-foreground/20 rounded-lg">
                  <p className="text-base text-font">
                    <span className="font-bold">Selected Event Type:</span>{" "}
                    <span className="text-foreground font-bold text-lg">
                      {
                        eventTypes.find((t) => t.value === formData.eventType)
                          ?.label
                      }
                    </span>
                  </p>
                </div>
              )}

              {/* Audience Size Selection */}
              <div className="mb-8 mt-8">
                <label className="block text-sm font-bold text-font-2 mb-4">
                  Expected Audience Size
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {audienceSizes.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          audienceSize: size.value,
                        }))
                      }
                      className={`border-2 rounded-lg p-3 font-bold transition-all text-base text-center ${
                        formData.audienceSize === size.value
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/20 text-font hover:border-foreground/40 bg-background"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display selected audience size */}
              {formData.audienceSize && (
                <div className="mb-8 p-4 bg-foreground/5 border border-foreground/20 rounded-lg">
                  <p className="text-base text-font">
                    <span className="font-bold">Selected Audience Size:</span>{" "}
                    <span className="text-foreground font-bold text-lg">
                      {
                        audienceSizes.find(
                          (a) => a.value === formData.audienceSize
                        )?.label
                      }
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Section 3: Requirements */}
            <div className="bg-background-2 rounded-2xl border border-foreground/20 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-foreground/10 rounded-xl flex items-center justify-center">
                  <Palette className="text-font" />
                </div>
                <h2 className="text-2xl font-bold text-font">
                  Requirements & Preferences
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Budget Range (₹)
                  </label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all cursor-pointer"
                  >
                    <option value="">Select budget range</option>
                    <option value="under_25k">Under ₹25,000</option>
                    <option value="25k_50k">₹25,000 - ₹50,000</option>
                    <option value="50k_1l">₹50,000 - ₹1,00,000</option>
                    <option value="1l_2l">₹1,00,000 - ₹2,00,000</option>
                    <option value="over_2l">Over ₹2,00,000</option>
                    <option value="custom">Custom Budget</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Special Requirements/Theme
                  </label>
                  <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all resize-none"
                    placeholder="Any specific theme, requirements, or special arrangements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Preferred Game Types/Activities
                  </label>
                  <textarea
                    name="preferredGames"
                    value={formData.preferredGames}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all resize-none"
                    placeholder="e.g., team building games, puzzle games, physical activities..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Theme Preferences
                  </label>
                  <input
                    type="text"
                    name="themePreferences"
                    value={formData.themePreferences}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                    placeholder="e.g., Beach party, Bollywood, Superheroes..."
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Additional Information */}
            <div className="bg-background-2 rounded-2xl border border-foreground/20 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-foreground/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="text-font" />
                </div>
                <h2 className="text-2xl font-bold text-font">
                  Additional Information
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    name="howHeard"
                    value={formData.howHeard}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all cursor-pointer"
                  >
                    <option value="">Select option</option>
                    <option value="google">Google Search</option>
                    <option value="social_media">Social Media</option>
                    <option value="referral">Referral</option>
                    <option value="event">Previous Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all resize-none"
                    placeholder="Any other details, questions, or special requests..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="bg-background-2 rounded-2xl border border-foreground/20 p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-font mb-2">
                    Ready to Submit?
                  </h3>
                  <p className="text-font-2">
                    Our team will review your request and contact you within 24
                    hours.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-foreground/30 text-font rounded-lg hover:bg-foreground/5 hover:border-foreground/50 font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-foreground text-background rounded-lg hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 font-bold flex items-center gap-2 transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-background border-t-transparent"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Rocket size={20} />
                        Submit Experience Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
