import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * POST /api/user/sudoku/hint
 * body: { gameId }
 */
export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { gameId } = await req.json();

  const userRef = db.collection("users").doc(user.uid);
  const gameRef = userRef.collection("gamesPlayed").doc(gameId);

  try {
    const result = await db.runTransaction(async (tx) => {
      const gameSnap = await tx.get(gameRef);
      if (!gameSnap.exists) throw new Error("Game not found");

      const game = gameSnap.data();
      if (game.isCompleted)
        throw new Error("Game already completed");

      const levelRef = db
        .collection("sudoku_levels")
        .doc(game.levelId);

      const levelSnap = await tx.get(levelRef);
      const { puzzle, solution } = levelSnap.data();

      // find empty indices
      const emptyIndices = [];
      for (let i = 0; i < 81; i++) {
        if (puzzle[i] === 0) {
          emptyIndices.push(i);
        }
      }

      if (emptyIndices.length === 0)
        throw new Error("No hints available");

      // pick random empty cell
      const randomIndex =
        emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

      const hintValue = solution[randomIndex];

      // increment hint count
      tx.update(gameRef, {
        hintsUsed: admin.firestore.FieldValue.increment(1),
      });

      return {
        index: randomIndex,
        value: hintValue,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
