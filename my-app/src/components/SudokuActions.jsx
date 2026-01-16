"use client";

import { useState } from "react";
import { userFetch } from "@/lib/userFetch";
import { Lightbulb, CircleX } from "lucide-react";

export default function SudokuActions({ onSubmit, gameId }) {
  const [hintMessage, setHintMessage] = useState("");

  async function hint() {
    try {
      const res = await userFetch("/api/user/sudoku/hint", {
        method: "POST",
        body: JSON.stringify({ gameId }),
      });
      const data = await res.json();
      const row = Math.floor(data.index / 9) + 1; // 1-based row
      const col = (data.index % 9) + 1; // 1-based col
      setHintMessage(
        <span className="flex items-center gap-2">
          <Lightbulb size={18} /> Row {row}, Col {col} = {data.value}
        </span>
      );
      setTimeout(() => setHintMessage(""), 4000);
    } catch (error) {
      setHintMessage(
        <span className="flex items-center gap-2 text-red-600">
          <CircleX size={18} /> Error getting hint
        </span>
      );
      setTimeout(() => setHintMessage(""), 3000);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {/* Message */}
      {hintMessage && (
        <div
          className="rounded-lg px-6 py-3 font-semibold shadow-md"
          style={{
            backgroundColor: "var(--light-pink)",
            color: "var(--dark-teal)",
          }}
        >
          {hintMessage}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={hint}
          className="rounded-lg px-6 py-3 font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "var(--light-orange)",
            color: "var(--dark-teal)",
          }}
        >
          Get Hint
        </button>
        <button
          onClick={onSubmit}
          className="rounded-lg px-6 py-3 font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "var(--light-blue)",
            color: "var(--dark-teal)",
          }}
        >
          Submit Solution
        </button>
      </div>
    </div>
  );
}
