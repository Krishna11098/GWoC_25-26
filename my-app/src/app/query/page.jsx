"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Support" },
  { value: "feedback", label: "Feedback" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

export default function QueryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Name is required";
    }
    if (!formData.email.trim()) {
      return "Email is required";
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Please enter a valid email address";
    }
    if (!formData.category) {
      return "Please select a category";
    }
    if (!formData.subject.trim()) {
      return "Subject is required";
    }
    if (!formData.message.trim()) {
      return "Message is required";
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
      const response = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit query");
      }

      if (data.success) {
        setSuccess(
          "🎉 Your query has been submitted successfully! We'll get back to you soon."
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          category: "",
          subject: "",
          message: "",
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
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-4">
              <span className="text-5xl md:text-6xl">💬</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-font mb-4">
              Send us a Query
            </h1>
            <p className="text-font-2 text-lg max-w-2xl mx-auto leading-relaxed">
              Have a question, feedback, or partnership inquiry? We'd love to
              hear from you. Fill out the form below and our team will get back
              to you as soon as possible.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-green-600">✓</span>
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
                  <span className="text-2xl text-red-600">✕</span>
                </div>
                <div className="flex-1">
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-background-2 rounded-2xl border border-foreground/20 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-foreground/10 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-font">👤</span>
                </div>
                <h2 className="text-2xl font-bold text-font">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                    placeholder="Your name"
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Query Details */}
            <div className="bg-background-2 rounded-2xl border border-foreground/20 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-foreground/10 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-font">📝</span>
                </div>
                <h2 className="text-2xl font-bold text-font">Query Details</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all cursor-pointer"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all"
                    placeholder="Brief subject of your query"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-font-2 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-foreground/50 focus:border-foreground transition-all resize-none"
                    placeholder="Please describe your query, feedback, or inquiry in detail..."
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
                    Our team will review your query and get back to you soon.
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
                        <span>✉️</span>
                        Submit Query
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
