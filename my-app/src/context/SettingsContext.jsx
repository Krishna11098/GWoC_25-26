"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const SettingsContext = createContext({});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("⚙️ SettingsProvider: Setting up listener");

    const unsubscribe = onSnapshot(
      doc(db, "settings", "admin"),
      (doc) => {
        console.log("⚙️ SettingsProvider: Firestore update received");
        if (doc.exists()) {
          console.log("⚙️ Settings data:", doc.data());
          setSettings(doc.data());
        } else {
          console.log("⚙️ No settings found, using defaults");
          setSettings({
            maintenanceMode: false,
            maintenanceMessage:
              "Site is under maintenance. Please check back soon!",
            autoBanReportThreshold: 3,
            autoHideReportedContent: true,
            cacheDuration: 3600,
            maxUploadSize: 5,
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error("⚙️ SettingsProvider error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};
