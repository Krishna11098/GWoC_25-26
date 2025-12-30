export default function SudokuLoader({ text = "Loading…" }) {
  return (
    <div className="p-6 text-center" style={{ color: "var(--color-font-2)" }}>
      {text}
    </div>
  );
}
