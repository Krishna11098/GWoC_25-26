"use client";

import { useMemo } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

export function GoogleMapsProvider({ children, apiKey }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry", "drawing"],
  });

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading maps...</p>
        </div>
      </div>
    );
  }

  return children;
}
