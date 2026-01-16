import { useState } from "react";
import DifficultyPicker from "./DifficultyPicker";

export default function AddSudokuCard({ onAdded }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-dashed border-2 p-4 flex items-center justify-center rounded-lg transition-colors"
      style={{
        borderColor: "var(--dark-teal)",
        backgroundColor: "var(--light-blue)",
      }}
    >
      {open ? (
        <DifficultyPicker
          onDone={() => {
            setOpen(false);
            onAdded();
          }}
        />
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:scale-105 transition-transform"
          style={{
            backgroundColor: "var(--dark-teal)",
            color: "white",
          }}
        >
          ➕ Add Sudoku
        </button>
      )}
    </div>
  );
}
