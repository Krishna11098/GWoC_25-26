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
        border border-gray-300
        transition-all duration-150
        ${colIdx % 3 === 2 && colIdx !== 8 ? "border-r-4" : ""}
        ${rowIdx % 3 === 2 && rowIdx !== 8 ? "border-b-4" : ""}
        ${
          fixed
            ? "font-extrabold cursor-default"
            : "cursor-pointer hover:bg-gray-100"
        }
        ${isSelected ? "border-2 ring-2 ring-offset-0" : ""}
        
        focus:outline-none
      `}
      style={{
        ...(isSelected
          ? {
              borderColor: "var(--color-font)",
              ringColor: "var(--color-orange)",
              backgroundColor: "var(--color-orange)",
              opacity: 0.3,
            }
          : {}),
        ...(fixed
          ? {
              backgroundColor: "var(--color-green)",
              color: "var(--color-font)",
              opacity: 0.85,
            }
          : {
              color: "var(--color-font)",
            }),
        ...(isSameRow || isSameCol || isSameBox
          ? { backgroundColor: "var(--color-pink)", opacity: 0.6 }
          : {}),
      }}
    />
  );
});

export default SudokuCell;
