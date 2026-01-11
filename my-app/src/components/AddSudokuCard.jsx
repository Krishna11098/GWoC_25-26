import { useState } from "react";
import DifficultyPicker from "./DifficultyPicker";

export default function AddSudokuCard({ onAdded }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-dashed border-2 border-gray-300 p-4 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
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
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
        >
          ➕ Add Sudoku
        </button>
      )}
    </div>
  );
}
