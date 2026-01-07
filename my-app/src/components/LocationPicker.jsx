"use client";

import { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

export default function LocationPicker({ value, onChange, apiKey }) {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(value || "");
  const [coordinates, setCoordinates] = useState(defaultCenter);
  const autocompleteRef = useRef(null);
  const [mapLibraries] = useState(() => ["places"]);

  useEffect(() => {
    if (value && !location) {
      setLocation(value);
    }
  }, [value]);

  const handlePlaceSelected = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        setLocation(place.formatted_address);
        onChange(place.formatted_address);

        if (place.geometry?.location) {
          const newCoords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setCoordinates(newCoords);
          if (map) {
            map.panTo(newCoords);
            map.setZoom(15);
          }
        }
      }
    }
  };

  const handleMapClick = (e) => {
    if (e.latLng) {
      const newCoords = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setCoordinates(newCoords);

      // Reverse geocode to get address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: newCoords }, (results) => {
        if (results && results[0]) {
          setLocation(results[0].formatted_address);
          onChange(results[0].formatted_address);
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location *
        </label>
        <Autocomplete
          onLoad={(auto) => {
            autocompleteRef.current = auto;
          }}
          onPlaceChanged={handlePlaceSelected}
          restrictions={{ country: "in" }}
        >
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search for a location or click on the map"
          />
        </Autocomplete>
      </div>

      {apiKey && (
        <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={coordinates}
            zoom={12}
            onLoad={setMap}
            onClick={handleMapClick}
            options={{
              mapTypeControl: true,
              streetViewControl: false,
              fullscreenControl: true,
              zoomControl: true,
            }}
          >
            <Marker position={coordinates} />
          </GoogleMap>
        </div>
      )}

      <p className="text-xs text-gray-500">
        💡 Tip: Use the autocomplete search above or click on the map to select
        a location
      </p>
    </div>
  );
}
