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
        border border-gray-400
        transition-colors duration-150
        ${
          colIdx % 3 === 2 && colIdx !== 8
            ? "border-r-4 border-gray-900"
            : ""
        }
        ${
          rowIdx % 3 === 2 && rowIdx !== 8
            ? "border-b-4 border-gray-900"
            : ""
        }
        ${
          fixed
            ? "bg-gray-100 text-black font-bold cursor-default"
            : "bg-white cursor-pointer"
        }
        ${isSelected ? "bg-blue-100 border-2 border-blue-500 ring-2 ring-blue-300" : ""}
        ${
          !fixed && value !== 0 && !isSelected
            ? "text-blue-600"
            : ""
        }
        ${
          isSameRow || isSameCol || isSameBox
            ? "bg-blue-50"
            : ""
        }
        hover:${
          !fixed ? "bg-blue-50" : "bg-gray-100"
        }
        focus:outline-none
      `}
    />
  );
});

export default SudokuCell;
