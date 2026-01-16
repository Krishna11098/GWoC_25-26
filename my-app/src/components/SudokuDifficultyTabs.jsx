export default function SudokuDifficultyTabs({ value, onChange }) {
  const levels = ["easy", "medium", "hard"];

  const getActiveColor = (lvl) => {
    if (lvl === "easy") return "var(--light-pink)";
    if (lvl === "medium") return "var(--light-orange)";
    if (lvl === "hard") return "var(--light-blue)";
    return "var(--dark-teal)";
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
                  color: "var(--dark-teal)",
                }
              : { backgroundColor: "var(--dark-teal)", color: "white" }
          }
        >
          {lvl}
        </button>
      ))}
    </div>
  );
}
