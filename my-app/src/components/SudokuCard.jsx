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
      <div className="border rounded p-4 shadow">
        <p className="font-semibold capitalize">{level.difficulty}</p>
        <p>Coins: {level.coins}</p>
        <p>
          Variation {level.variationNo} • Level {level.levelNo}
        </p>

        <SudokuPreview grid={level.puzzle} />

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1 rounded"
            style={{
              backgroundColor: "var(--color-foreground)",
              color: "var(--color-font-2)",
            }}
          >
            Edit
          </button>
          <button
            onClick={removeSudoku}
            className="px-3 py-1 rounded"
            style={{
              backgroundColor: "var(--color-foreground-2)",
              color: "var(--color-font-2)",
            }}
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
