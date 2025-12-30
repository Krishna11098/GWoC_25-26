export default function SudokuDifficultyTabs({ value, onChange }) {
  const levels = ["easy", "medium", "hard"];

  return (
    <div className="flex gap-2">
      {levels.map((lvl) => (
        <button
          key={lvl}
          onClick={() => onChange(lvl)}
          className={`px-3 py-1 rounded capitalize ${
            value === lvl ? "font-semibold" : "border"
          }`}
          style={
            value === lvl
              ? {
                  backgroundColor: "var(--color-foreground)",
                  color: "var(--color-font-2)",
                }
              : { color: "var(--color-font)" }
          }
        >
          {lvl}
        </button>
      ))}
    </div>
  );
}
