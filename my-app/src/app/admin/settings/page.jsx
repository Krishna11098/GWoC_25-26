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

    // Performance
    cacheDuration: 3600, // seconds
    maxUploadSize: 5, // MB
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
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Settings
          </h1>
          <p className="text-gray-600">
            Configure platform settings and preferences
          </p>
        </div>

        {saveMessage && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              saveMessage.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {saveMessage}
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Maintenance Mode */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaCog className="text-yellow-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Maintenance Mode
                </h2>
                <p className="text-gray-600">
                  Temporarily disable public access to the site
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
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
                      className={`block w-14 h-7 rounded-full ${
                        settings.maintenanceMode
                          ? "bg-yellow-600"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${
                        settings.maintenanceMode
                          ? "transform translate-x-7"
                          : ""
                      }`}
                    ></div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Enable Maintenance Mode
                    </span>
                    <p className="text-sm text-gray-500">
                      {settings.maintenanceMode
                        ? "🔴 Site is currently in maintenance mode"
                        : "🟢 Site is live and accessible"}
                    </p>
                  </div>
                </label>
              </div>

              {settings.maintenanceMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Message
                  </label>
                  <textarea
                    value={settings.maintenanceMessage}
                    onChange={(e) =>
                      handleChange("maintenanceMessage", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    placeholder="Enter maintenance message..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This message will be shown to users
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaShieldAlt className="text-red-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Security Settings
                </h2>
                <p className="text-gray-600">
                  Content moderation and user management
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Users with {settings.autoBanReportThreshold} or more reports
                  will be auto-banned
                </p>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
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
                      className={`block w-14 h-7 rounded-full ${
                        settings.autoHideReportedContent
                          ? "bg-purple-600"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${
                        settings.autoHideReportedContent
                          ? "transform translate-x-7"
                          : ""
                      }`}
                    ></div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Auto-hide Reported Content
                    </span>
                    <p className="text-sm text-gray-500">
                      Hide content that reaches report threshold
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Performance Settings */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaDatabase className="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Performance Settings
                </h2>
                <p className="text-gray-600">
                  Performance optimization and caching
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {settings.cacheDuration === 0
                    ? "Caching disabled"
                    : `Data cached for ${settings.cacheDuration} seconds`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-sm text-gray-500 mt-1">
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
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave /> Save All Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
