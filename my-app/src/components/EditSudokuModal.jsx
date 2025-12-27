"use client";

import { useState } from "react";
import SudokuPreview from "./SudokuPreview";
import { auth } from "@/lib/firebaseClient";



export default function EditSudokuModal({ level, onClose, onSaved }) {
  const [puzzle, setPuzzle] = useState([...level.puzzle]);
  const [coins, setCoins] = useState(level.coins);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateCell(index, value) {
    const num = value === "" ? 0 : Number(value);
    if (num < 0 || num > 9) return;

    const next = [...puzzle];
    next[index] = num;
    setPuzzle(next);
  }

  async function save() {
  setSaving(true);
  setError("");

  const user = auth.currentUser;
  if (!user) {
    setError("Not authenticated");
    setSaving(false);
    return;
  }

  // 🔥 Force-refresh token so backend sees admin claim
  const token = await user.getIdToken(true);

  const res = await fetch(`/api/admin/sudoku/${level.levelId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      puzzle,
      coins,
      isVisibleToUser: true,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    setError(data.error || "Failed to save");
    setSaving(false);
    return;
  }

  onSaved();
  onClose();
}


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[420px] max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-3">
          Edit Sudoku ({level.difficulty})
        </h2>

        {/* Editable grid */}
        <div className="grid grid-cols-9 gap-1">
          {puzzle.map((cell, i) => (
            <input
              key={i}
              value={cell === 0 ? "" : cell}
              onChange={e => updateCell(i, e.target.value)}
              className="w-8 h-8 text-center border text-sm"
            />
          ))}
        </div>

        {/* Coins */}
        <div className="mt-4">
          <label className="block text-sm font-medium">
            Coins
          </label>
          <input
            type="number"
            value={coins}
            onChange={e => setCoins(Number(e.target.value))}
            className="border p-1 w-full"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={save}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
