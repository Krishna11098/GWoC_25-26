import { Coins } from "lucide-react";

export default function SudokuHeader({ difficulty, coins }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold capitalize text-dark-teal">
        {difficulty} Sudoku
      </h2>
      <span
        className="text-sm px-3 py-1 rounded flex items-center gap-1"
        style={{
          backgroundColor: "var(--light-orange)",
          color: "var(--dark-teal)",
        }}
      >
        <Coins size={14} /> {coins} coins
      </span>
    </div>
  );
}
