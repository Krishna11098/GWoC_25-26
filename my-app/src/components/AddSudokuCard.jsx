import { useState } from "react";
import DifficultyPicker from "./DifficultyPicker";

export default function AddSudokuCard({ onAdded }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-dashed border-2 p-4 flex items-center justify-center">
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
          className="text-lg"
        >
          ➕ Add Sudoku
        </button>
      )}
    </div>
  );
}
