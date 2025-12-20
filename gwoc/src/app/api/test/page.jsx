// app/api/test/page.jsx (temporary test page)
"use client";

import { useState } from "react";

export default function TestAPIPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testCreateEvent = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Test Event",
          description: "This is a test event",
          date: "2024-01-15T10:00:00",
          location: "Test Location",
          category: "workshop",
        }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <div className="space-x-4 mb-6">
        <button
          onClick={testCreateEvent}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Test POST /api/events
        </button>

        <button
          onClick={testGetEvents}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Test GET /api/events
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">{result}</pre>
        </div>
      )}
    </div>
  );
}
