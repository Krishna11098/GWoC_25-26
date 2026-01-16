import { useState } from "react";
import SudokuPreview from "./SudokuPreview";
import EditSudokuModal from "./EditSudokuModal";
import { auth } from "@/lib/firebaseClient";

export default function SudokuCard({ level, refresh }) {
  const [editing, setEditing] = useState(false);

  async function removeSudoku() {
    const user = auth.currentUser;
    if (!user) return;

    // 🔥 Force refresh so admin claim is guaranteed
    const token = await user.getIdToken(true);

    await fetch(`/api/admin/sudoku/${level.levelId}/unpublish`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    refresh();
  }

  return (
    <>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {level.difficulty}
            </span>
            <span className="text-sm text-gray-500">
              Variation {level.variationNo}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Level {level.levelNo} • {level.coins} coins
          </p>
        </div>

        <SudokuPreview grid={level.puzzle} />

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditing(true)}
            className="flex-1 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium text-sm transition-colors"
          >
            ✏️ Edit
          </button>
          <button
            onClick={removeSudoku}
            className="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium text-sm transition-colors"
          >
            🗑️ Remove
          </button>
        </div>
      </div>

      {editing && (
        <EditSudokuModal
          level={level}
          onClose={() => setEditing(false)}
          onSaved={refresh}
        />
      )}
    </>
  );
}
