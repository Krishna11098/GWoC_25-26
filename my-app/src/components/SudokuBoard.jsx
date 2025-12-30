"use client";

import { useState, useEffect, useRef } from "react";

export default function SudokuBoard({ puzzle, solution, levelNo, difficulty }) {
  // Initialize userGrid from puzzle
  const initializeGrid = () => {
    return puzzle.map((val) => (val === 0 ? "" : val.toString()));
  };

  const [userGrid, setUserGrid] = useState(initializeGrid());
  const [selectedCell, setSelectedCell] = useState(null);
  const [errors, setErrors] = useState(new Set());
  const [checkMessage, setCheckMessage] = useState("");
  const [showHintMessage, setShowHintMessage] = useState("");
  const [checkType, setCheckType] = useState(null);
  const gridRefs = useRef([]);

  // Handle cell input (1-9 only)
  const handleCellChange = (index, value) => {
    // Only allow 1-9 or empty
    if (value === "" || (value >= "1" && value <= "9")) {
      if (puzzle[index] === 0) {
        // Only allow editing if original puzzle value was 0
        const newGrid = [...userGrid];
        newGrid[index] = value;
        setUserGrid(newGrid);
        setErrors(new Set()); // Clear error highlights on new input
        setCheckMessage("");
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    let newIndex = null;

    switch (e.key) {
      case "ArrowUp":
        if (row > 0) {
          newIndex = index - 9;
        }
        break;
      case "ArrowDown":
        if (row < 8) {
          newIndex = index + 9;
        }
        break;
      case "ArrowLeft":
        if (col > 0) {
          newIndex = index - 1;
        }
        break;
      case "ArrowRight":
        if (col < 8) {
          newIndex = index + 1;
        }
        break;
      case "Delete":
      case "Backspace":
        e.preventDefault();
        if (puzzle[index] === 0) {
          handleCellChange(index, "");
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

  // Check progress against solution
  const checkProgress = () => {
    const newErrors = new Set();
    let isComplete = true;
    let hasErrors = false;

    for (let i = 0; i < 81; i++) {
      const userValue = userGrid[i];

      if (userValue === "") {
        isComplete = false;
      } else {
        const userNum = parseInt(userValue, 10);
        const solutionNum = solution[i];

        if (userNum !== solutionNum) {
          newErrors.add(i);
          hasErrors = true;
        }
      }
    }

    setErrors(newErrors);

    if (hasErrors) {
      setCheckType("error");
      setCheckMessage("Some cells are incorrect. Keep trying!");
    } else if (!isComplete) {
      setCheckType("partial");
      setCheckMessage("All entered values are correct! Complete the grid.");
    } else {
      setCheckType("solved");
      setCheckMessage("Puzzle solved! Congratulations!");
    }
  };

  // Get hint - fill one random empty cell
  const getHint = () => {
    const emptyCells = [];
    for (let i = 0; i < 81; i++) {
      if (puzzle[i] === 0 && userGrid[i] === "") {
        emptyCells.push(i);
      }
    }

    if (emptyCells.length === 0) {
      setShowHintMessage("No more hints available!");
      setTimeout(() => setShowHintMessage(""), 3000);
      return;
    }

    const randomIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = [...userGrid];
    newGrid[randomIndex] = solution[randomIndex].toString();
    setUserGrid(newGrid);
    setShowHintMessage(`Hint revealed at position!`);
    setTimeout(() => setShowHintMessage(""), 2000);
  };

  // Reset puzzle
  const resetPuzzle = () => {
    setUserGrid(initializeGrid());
    setErrors(new Set());
    setCheckMessage("");
    setShowHintMessage("");
    setSelectedCell(null);
  };

  // Render the 9x9 grid
  const renderGrid = () => {
    return (
      <div className="inline-block border-4">
        {Array.from({ length: 9 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className={`flex ${
              rowIdx % 3 === 2 && rowIdx !== 8 ? "border-b-4" : ""
            }`}
          >
            {Array.from({ length: 9 }).map((_, colIdx) => {
              const index = rowIdx * 9 + colIdx;
              const isOriginal = puzzle[index] !== 0;
              const isSelected = selectedCell === index;
              const isError = errors.has(index);
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
                <input
                  key={index}
                  ref={(el) => (gridRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={userGrid[index]}
                  onChange={(e) => handleCellChange(index, e.target.value)}
                  onFocus={() => setSelectedCell(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={isOriginal}
                  className={`
                    h-12 w-12 flex items-center justify-center text-lg font-semibold
                    border
                    transition-colors duration-150
                    ${colIdx % 3 === 2 && colIdx !== 8 ? "border-r-4" : ""}
                    ${rowIdx % 3 === 2 && rowIdx !== 8 ? "border-b-4" : ""}
                    ${
                      isOriginal ? "font-bold cursor-default" : "cursor-pointer"
                    }
                    ${isSelected ? "border-2" : ""}
                    ${isError ? "font-bold" : ""}
                    focus:outline-none
                  `}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 rounded-lg p-8"
      style={{ color: "var(--color-font-2)" }}
    >
      {/* Header */}
      <div className="text-center">
        <h1
          className="text-4xl font-bold"
          style={{
            color: "#F5F3F8",
            textShadow: "0 4px 20px rgba(0,0,0,0.25)",
          }}
        >
          Sudoku
        </h1>
        <p className="mt-2 text-lg">
          Level {levelNo} •{" "}
          <span
            className="capitalize font-semibold"
            style={{ color: "var(--color-font-2)" }}
          >
            {difficulty}
          </span>
        </p>
      </div>

      {/* Instructions */}
      <div
        className="max-w-2xl rounded-lg p-4 text-sm shadow-sm border"
        style={{
          backgroundColor: "var(--color-pink)",
        }}
      >
        <p style={{ color: "#85D5C8", opacity: 0.9 }}>
          <strong style={{ color: "#F5F3F8" }}>Original values:</strong>{" "}
          <span className="font-bold" style={{ color: "#85D5C8" }}>
            Bold black
          </span>{" "}
          •
          <strong className="ml-4" style={{ color: "#F5F3F8" }}>
            Your entries:
          </strong>{" "}
          <span style={{ color: "#85D5C8" }}>Your entries</span> •
          <strong className="ml-4" style={{ color: "#F5F3F8" }}>
            Errors:
          </strong>{" "}
          <span className="px-1" style={{ color: "#85D5C8" }}>
            Highlight
          </span>
        </p>
        <p className="mt-2 text-xs" style={{ color: "#85D5C8", opacity: 0.9 }}>
          Use arrow keys to navigate. Type 1-9 to fill cells.
        </p>
      </div>

      {/* Grid */}
      <div className="flex justify-center">{renderGrid()}</div>

      {/* Messages */}
      {checkMessage && (
        <div
          className="rounded-lg px-6 py-3 font-semibold text-center flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--color-orange)",
            color: "white",
          }}
        >
          <img
            src={
              checkType === "error"
                ? "/icons/cross.svg"
                : checkType === "partial"
                ? "/icons/check.svg"
                : "/icons/party.svg"
            }
            alt=""
            className="inline-block h-5 w-5 icon-current-color"
            style={{ color: "#C392EC" }}
          />
          <span>{checkMessage}</span>
        </div>
      )}

      {showHintMessage && (
        <div
          className="rounded-lg px-6 py-3 font-semibold"
          style={{
            backgroundColor: "var(--color-green)",
            color: "white",
          }}
        >
          {showHintMessage}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={checkProgress}
          className="rounded-lg px-6 py-3 font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "var(--color-green)",
            color: "white",
          }}
        >
          Check Progress
        </button>
        <button
          onClick={getHint}
          className="rounded-lg px-6 py-3 font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "var(--color-orange)",
            color: "white",
          }}
        >
          Get Hint
        </button>
        <button
          onClick={resetPuzzle}
          className="rounded-lg px-6 py-3 font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "var(--color-pink)",
            color: "var(--color-font)",
          }}
        >
          Reset
        </button>
      </div>

      {/* Footer info */}
      <div className="text-center text-sm">
        Filled:{" "}
        <span className="font-semibold">
          {userGrid.filter((v) => v !== "").length}
        </span>{" "}
        / 81
      </div>
    </div>
  );
}
