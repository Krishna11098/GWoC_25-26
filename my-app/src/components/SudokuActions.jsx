"use client";

import { useState } from "react";
import { userFetch } from "@/lib/userFetch";

export default function SudokuActions({
  onSubmit,
  gameId,
}) {
  const [hintMessage, setHintMessage] = useState("");

  async function hint() {
    try {
      const res = await userFetch(
        "/api/user/sudoku/hint",
        {
          method: "POST",
          body: JSON.stringify({ gameId }),
        }
      );
      const data = await res.json();
      const row = Math.floor(data.index / 9) + 1; // 1-based row
      const col = (data.index % 9) + 1; // 1-based col
      setHintMessage(`💡 Row ${row}, Col ${col} = ${data.value}`);
      setTimeout(() => setHintMessage(""), 4000);
    } catch (error) {
      setHintMessage("❌ Error getting hint");
      setTimeout(() => setHintMessage(""), 3000);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {/* Message */}
      {hintMessage && (
        <div className="rounded-lg bg-yellow-100 px-6 py-3 font-semibold text-yellow-800 shadow-md">
          {hintMessage}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={hint}
          className="rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Get Hint
        </button>
        <button
          onClick={onSubmit}
          className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Submit Solution
        </button>
      </div>
    </div>
  );
}
