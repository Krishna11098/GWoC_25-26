export default function SudokuDifficultyTabs({ value, onChange }) {
  const levels = ["easy", "medium", "hard"];

  const getActiveColor = (lvl) => {
    if (lvl === "easy") return "var(--color-pink)";
    if (lvl === "medium") return "var(--color-orange)";
    if (lvl === "hard") return "var(--color-green)";
    return "var(--color-font)";
  };

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
                  backgroundColor: getActiveColor(lvl),
                  color: "var(--color-font)",
                }
              : { backgroundColor: "var(--color-font)", color: "white" }
          }
        >
          {lvl}
        </button>
      ))}
    </div>
  );
}
