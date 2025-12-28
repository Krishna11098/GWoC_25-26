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

  await fetch(
    `/api/admin/sudoku/${level.levelId}/unpublish`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  refresh();
}


  return (
    <>
      <div className="border rounded p-4 shadow bg-white">
        <p className="font-semibold capitalize">
          {level.difficulty}
        </p>
        <p>Coins: {level.coins}</p>
        <p>
          Variation {level.variationNo} • Level {level.levelNo}
        </p>

        <SudokuPreview grid={level.puzzle} />

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
          <button
            onClick={removeSudoku}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Remove
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
