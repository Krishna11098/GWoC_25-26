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
        h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 flex items-center justify-center text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-center
        border border-black
        transition-all duration-150
        ${colIdx % 3 === 2 && colIdx !== 8 ? "border-r-2" : ""}
        ${rowIdx % 3 === 2 && rowIdx !== 8 ? "border-b-2" : ""}}
        ${
          fixed
            ? "font-extrabold cursor-default"
            : "cursor-pointer hover:bg-gray-100"
        }
        
        focus:outline-none
      `}
      style={{
        ...(isSelected
          ? {
              backgroundColor: "var(--color-pink)",
              opacity: 0.3,
              color: "black",
            }
          : {}),
        ...(fixed
          ? {
              backgroundColor: "var(--color-green)",
              color: "black",
              opacity: 0.85,
            }
          : {
              color: "black",
            }),
        ...(isSameRow || isSameCol || isSameBox
          ? { backgroundColor: "var(--color-orange)", color: "black" }
          : {}),
      }}
    />
  );
});

export default SudokuCell;
