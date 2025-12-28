export default function SudokuHeader({ difficulty, coins }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold capitalize">
        {difficulty} Sudoku
      </h2>
      <span className="text-sm bg-yellow-200 px-3 py-1 rounded">
        🪙 {coins} coins
      </span>
    </div>
  );
}
