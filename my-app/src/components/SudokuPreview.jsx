export default function SudokuPreview({ grid }) {
  return (
    <div className="grid grid-cols-9 gap-0.5 mt-2">
      {grid.map((cell, i) => (
        <div
          key={i}
          className="w-6 h-6 text-xs flex items-center justify-center border"
        >
          {cell !== 0 ? cell : ""}
        </div>
      ))}
    </div>
  );
}
