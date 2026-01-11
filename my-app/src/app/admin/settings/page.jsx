"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FaSave, FaCog, FaShieldAlt, FaBan, FaDatabase } from "react-icons/fa";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // Maintenance Mode
    maintenanceMode: false,
    maintenanceMessage: "Site is under maintenance. Please check back soon!",

    // Security Settings
    autoBanReportThreshold: 3,

    // Content Moderation
    autoHideReportedContent: true,

  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Load settings from Firestore
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "admin"));
        if (settingsDoc.exists()) {
          setSettings({ ...settings, ...settingsDoc.data() });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "admin"), settings, { merge: true });
      setSaveMessage("Settings saved successfully!");

      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveMessage("Error saving settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 font-winky-rough">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 drop-shadow-sm mb-2">
            Admin Settings
          </h1>
          <p className="text-gray-600 font-medium">
            Configure platform settings and preferences
          </p>
        </div>

        {saveMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border-2 font-bold animate-pulse-soft ${
              saveMessage.includes("Error")
                ? "bg-red-50 text-red-800 border-red-200"
                : "bg-green-50 text-green-800 border-green-200"
            }`}
          >
            {saveMessage}
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Maintenance Mode */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <FaCog className="text-gray-900 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Maintenance Mode
                </h2>
                <p className="text-gray-600 font-medium">
                  Temporarily disable public access to the site
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) =>
                        handleChange("maintenanceMode", e.target.checked)
                      }
                      className="sr-only"
                    />
                    <div
                      className={`block w-16 h-9 rounded-full transition-colors duration-300 ${
                        settings.maintenanceMode
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-7 h-7 rounded-full transition-transform duration-300 shadow-md ${
                        settings.maintenanceMode
                          ? "transform translate-x-7"
                          : ""
                      }`}
                    ></div>
                  </div>
                  <div>
                    <span className="font-bold text-lg text-gray-900 group-hover:text-gray-800 transition-colors">
                      Enable Maintenance Mode
                    </span>
                    <p className="text-sm font-medium mt-1">
                      {settings.maintenanceMode
                        ? "🔴 Site is currently in maintenance mode"
                        : "🟢 Site is live and accessible"}
                    </p>
                  </div>
                </label>
              </div>

              {settings.maintenanceMode && (
                <div className="animate-fade-in-up">
                  <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">
                    Maintenance Message
                  </label>
                  <textarea
                    value={settings.maintenanceMessage}
                    onChange={(e) =>
                      handleChange("maintenanceMessage", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium transition-all"
                    rows="3"
                    placeholder="Enter maintenance message..."
                  />
                  <p className="text-xs text-gray-600 mt-2 font-bold ml-1">
                    This message will be shown to users
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <FaShieldAlt className="text-red-700 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Security Settings
                </h2>
                <p className="text-gray-600 font-medium">
                  Content moderation and user management
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">
                  Auto-ban Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.autoBanReportThreshold}
                  onChange={(e) =>
                    handleChange(
                      "autoBanReportThreshold",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium transition-all"
                />
                <p className="text-xs text-gray-600 mt-2 font-bold ml-1">
                  Users with {settings.autoBanReportThreshold} or more reports
                  will be auto-banned
                </p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.autoHideReportedContent}
                      onChange={(e) =>
                        handleChange(
                          "autoHideReportedContent",
                          e.target.checked
                        )
                      }
                      className="sr-only"
                    />
                    <div
                      className={`block w-16 h-9 rounded-full transition-colors duration-300 ${
                        settings.autoHideReportedContent
                          ? "bg-red-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-7 h-7 rounded-full transition-transform duration-300 shadow-md ${
                        settings.autoHideReportedContent
                          ? "transform translate-x-7"
                          : ""
                      }`}
                    ></div>
                  </div>
                  <div>
                    <span className="font-bold text-lg text-gray-900 group-hover:text-gray-800 transition-colors">
                      Auto-hide Reported Content
                    </span>
                    <p className="text-sm font-medium text-gray-600 mt-1">
                      Hide content that reaches report threshold
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Performance Settings */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <FaDatabase className="text-gray-900 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Performance Settings
                </h2>
                <p className="text-gray-600 font-medium">
                  Performance optimization and caching
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">
                  Cache Duration (seconds)
                </label>
                <input
                  type="number"
                  min="0"
                  max="86400"
                  value={settings.cacheDuration}
                  onChange={(e) =>
                    handleChange("cacheDuration", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium transition-all"
                />
                <p className="text-xs text-gray-600 mt-2 font-bold ml-1">
                  {settings.cacheDuration === 0
                    ? "Caching disabled"
                    : `Data cached for ${settings.cacheDuration} seconds`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">
                  Max Upload Size (MB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxUploadSize}
                  onChange={(e) =>
                    handleChange("maxUploadSize", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium transition-all"
                />
                <p className="text-xs text-gray-600 mt-2 font-bold ml-1">
                  Maximum file size for uploads
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-gray-900 text-white text-lg font-bold rounded-xl hover:bg-blue-600 hover:text-white flex items-center gap-3 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-4 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="text-xl" /> Save All Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
