"use client";

import { useState, useRef } from "react";
import SudokuCell from "./SudokuCell";
import { Lightbulb } from "lucide-react";

export default function SudokuGrid({ grid, initial, setGrid }) {
  const [selectedCell, setSelectedCell] = useState(null);
  const gridRefs = useRef([]);

  function update(i, value) {
    const num = value === "" ? 0 : Number(value);
    if (num < 0 || num > 9) return;

    const next = [...grid];
    next[i] = num;
    setGrid(next);
  }

  const handleKeyDown = (e, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    let newIndex = null;

    switch (e.key) {
      case "ArrowUp":
        if (row > 0) newIndex = index - 9;
        break;
      case "ArrowDown":
        if (row < 8) newIndex = index + 9;
        break;
      case "ArrowLeft":
        if (col > 0) newIndex = index - 1;
        break;
      case "ArrowRight":
        if (col < 8) newIndex = index + 1;
        break;
      case "Delete":
      case "Backspace":
        e.preventDefault();
        if (initial[index] === 0) {
          update(index, "");
        }
        return;
      default:
        return;
    }

    if (newIndex !== null) {
      e.preventDefault();
      setSelectedCell(newIndex);
      gridRefs.current[newIndex]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Title */}
      <h1
        className="text-3xl md:text-4xl font-bold text-center"
        style={{ color: "var(--color-font)" }}
      >
        Sudoku Challenge
      </h1>

      {/* Instructions */}
      <div
        className="max-w-2xl rounded-xl p-4 text-sm border-2"
        style={{
          backgroundColor: "var(--color-green)",
          borderColor: "var(--color-font)",
          color: "white",
        }}
      >
        <p className="font-medium">
          <strong>Original values:</strong>{" "}
          <span className="font-bold">Bold</span> •
          <strong className="ml-4">Your entries:</strong> <span>Regular</span>
        </p>
        <p className="mt-2 text-xs opacity-90 flex items-center gap-1">
          <Lightbulb size={12} className="shrink-0" /> Use arrow keys to navigate. Type 1-9 to fill cells. Press
          Delete/Backspace to clear.
        </p>
      </div>

      {/* Grid */}
      <div
        className="inline-block border-2 sm:border-3 md:border-4 lg:border-6 shadow-2xl rounded-2xl overflow-hidden bg-white"
        style={{ borderColor: "var(--color-font)" }}
      >
        {Array.from({ length: 9 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className={`flex ${
              rowIdx % 3 === 2 && rowIdx !== 8 ? "border-b-2" : ""
            }`}
          >
            {Array.from({ length: 9 }).map((_, colIdx) => {
              const index = rowIdx * 9 + colIdx;
              const isOriginal = initial[index] !== 0;
              const isSelected = selectedCell === index;
              const isSameRow =
                !isSelected &&
                selectedCell !== null &&
                Math.floor(selectedCell / 9) === rowIdx;
              const isSameCol =
                !isSelected &&
                selectedCell !== null &&
                selectedCell % 9 === colIdx;
              const isSameBox =
                !isSelected &&
                selectedCell !== null &&
                Math.floor(selectedCell / 27) === Math.floor(index / 27) &&
                Math.floor((selectedCell % 9) / 3) === Math.floor(colIdx / 3);

              return (
                <SudokuCell
                  key={index}
                  ref={(el) => (gridRefs.current[index] = el)}
                  value={grid[index]}
                  fixed={isOriginal}
                  onChange={(v) => update(index, v)}
                  onFocus={() => setSelectedCell(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  isSelected={isSelected}
                  isSameRow={isSameRow}
                  isSameCol={isSameCol}
                  isSameBox={isSameBox}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div
        className="text-center text-base font-semibold px-6 py-3 rounded-xl border-2"
        style={{
          color: "var(--color-font)",
          backgroundColor: "var(--color-pink)",
          borderColor: "var(--color-font)",
        }}
      >
        Progress: {grid.filter((v) => v !== 0).length} / 81 cells filled
      </div>
    </div>
  );
}
