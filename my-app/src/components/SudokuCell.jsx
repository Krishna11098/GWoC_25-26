import { forwardRef } from "react";

const SudokuCell = forwardRef(function SudokuCell(
  {
    value,
    fixed,
    onChange,
    onFocus,
    onKeyDown,
    isSelected,
    isSameRow,
    isSameCol,
    isSameBox,
    rowIdx,
    colIdx,
  },
  ref
) {
  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      maxLength="1"
      value={value === 0 ? "" : value}
      disabled={fixed}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      className={`
        h-12 w-12 flex items-center justify-center text-lg font-semibold text-center
        border
        transition-colors duration-150
        ${colIdx % 3 === 2 && colIdx !== 8 ? "border-r-4" : ""}
        ${rowIdx % 3 === 2 && rowIdx !== 8 ? "border-b-4" : ""}
        ${fixed ? "font-bold cursor-default" : "cursor-pointer"}
        ${isSelected ? "border-2" : ""}
        
        focus:outline-none
      `}
      style={{
        ...(isSelected ? { borderColor: "var(--color-foreground)" } : {}),
        ...(fixed
          ? {
              backgroundColor: "var(--color-background-2)",
              color: "var(--color-font-2)",
            }
          : {}),
        ...(isSameRow || isSameCol || isSameBox
          ? { backgroundColor: "var(--color-foreground-2)" }
          : {}),
      }}
    />
  );
});

export default SudokuCell;
