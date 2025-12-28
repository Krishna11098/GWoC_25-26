"use client";

import { useRouter } from "next/navigation";

export default function SudokuResultModal() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Sudoku Solved!
          </h2>
          <p className="text-gray-600 mb-6">
            Congratulations! Coins have been added to your wallet.
          </p>
          <button
            onClick={() => router.push("/sudoku")}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Back to Levels
          </button>
        </div>
      </div>
    </div>
  );
}
