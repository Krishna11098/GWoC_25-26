import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import sudoku from "sudoku";
import { db } from "./firebaseAdmin.js";

const { makepuzzle, solvepuzzle } = sudoku;

// difficulty config
const DIFFICULTY_MAP = {
  easy:   { holes: 40, coins: 10 },
  medium: { holes: 50, coins: 20 },
  hard:   { holes: 60, coins: 30 },
};

const VARIATIONS_COUNT = 25;

// convert sudoku lib output → Firestore-safe flat array
function toFlat(arr) {
  // sudoku lib uses numbers 0–8, null for empty
  return arr.map(v => (v === null ? 0 : v + 1));
}

// generate puzzle with minimum empty cells
function generateWithHoles(minHoles) {
  let puzzle;
  do {
    puzzle = makepuzzle();
  } while (puzzle.filter(v => v === null).length < minHoles);
  return puzzle;
}

async function generateLevels() {
  let batch = db.batch();
  let ops = 0;

  for (let variationNo = 1; variationNo <= VARIATIONS_COUNT; variationNo++) {
    let levelNo = 1;

    for (const difficulty of ["easy", "medium", "hard"]) {
      const rawPuzzle = generateWithHoles(
        DIFFICULTY_MAP[difficulty].holes
      );
      const rawSolution = solvepuzzle(rawPuzzle);

      const puzzle = toFlat(rawPuzzle);     // length 81
      const solution = toFlat(rawSolution); // length 81

      const ref = db.collection("sudoku_levels").doc();

      batch.set(ref, {
        variationNo,                 // 1–25
        levelNo,                     // 1–3
        difficulty,                  // easy | medium | hard
        coins: DIFFICULTY_MAP[difficulty].coins,
        puzzle,                      // flat array (Firestore-safe)
        solution,                    // flat array (Firestore-safe)
        isVisibleToUser: false,      // admin will toggle later
        createdAt: new Date(),
      });

      levelNo++;
      ops++;

      // Firestore batch limit safety
      if (ops === 400) {
        await batch.commit();
        batch = db.batch();
        ops = 0;
      }
    }
  }

  if (ops > 0) {
    await batch.commit();
  }

  console.log("✅ Sudoku levels generated successfully");
}

generateLevels();
