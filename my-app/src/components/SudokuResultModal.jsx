"use client";

import { useRouter } from "next/navigation";

export default function SudokuResultModal() {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        style={{
          backgroundColor: "var(--color-background-2)",
          color: "var(--color-font-2)",
        }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2">Sudoku Solved!</h2>
          <p className="mb-6">
            Congratulations! Coins have been added to your wallet.
          </p>
          <button
            onClick={() => router.push("/sudoku")}
            className="w-full px-6 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--color-foreground)",
              color: "var(--color-font-2)",
            }}
          >
            Back to Levels
          </button>
        </div>
      </div>
    </div>
  );
}
