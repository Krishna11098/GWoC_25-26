export default function SudokuDifficultyTabs({
  value,
  onChange,
}) {
  const levels = ["easy", "medium", "hard"];

  return (
    <div className="flex gap-2">
      {levels.map(lvl => (
        <button
          key={lvl}
          onClick={() => onChange(lvl)}
          className={`px-3 py-1 rounded capitalize ${
            value === lvl
              ? "bg-black text-white"
              : "border"
          }`}
        >
          {lvl}
        </button>
      ))}
    </div>
  );
}
