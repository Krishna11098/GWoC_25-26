import { useState } from "react";
import SudokuPreview from "./SudokuPreview";
import { auth } from "@/lib/firebaseClient";

export default function DifficultyPicker({ onDone }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchRandom() {
    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const token = await user.getIdToken(true);

      const res = await fetch(
        `/api/admin/sudoku/random?difficulty=${difficulty}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch sudoku");
      }

      setLevel(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function confirm() {
    if (!level) return;

    const user = auth.currentUser;
    const token = await user.getIdToken(true);

    await fetch(`/api/admin/sudoku/${level.levelId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        puzzle: level.puzzle,
        coins: level.coins,
        isVisibleToUser: true,
      }),
    });

    onDone();
  }

  // 🔹 STEP 1: difficulty selection (NO level yet)
  if (!level) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Select difficulty
        </label>

        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="border px-2 py-1 w-full"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button
          onClick={fetchRandom}
          disabled={loading}
          className="block mt-2 bg-black text-white px-3 py-1 rounded"
        >
          {loading ? "Fetching..." : "Fetch Sudoku"}
        </button>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    );
  }

  // 🔹 STEP 2: preview + confirm
  return (
    <div className="space-y-2">
      <p className="font-medium">
        {level.difficulty} • {level.coins} coins
      </p>

      <SudokuPreview grid={level.puzzle} />

      <button
        onClick={confirm}
        className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
      >
        Confirm
      </button>
    </div>
  );
}
