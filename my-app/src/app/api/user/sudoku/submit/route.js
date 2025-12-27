import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { gameId, userGrid } = await req.json();

  const userRef = db.collection("users").doc(user.uid);
  const gameRef = userRef.collection("gamesPlayed").doc(gameId);

  try {
    await db.runTransaction(async (tx) => {
      const gameSnap = await tx.get(gameRef);
      if (!gameSnap.exists) {
        throw new Error("Game session not found");
      }

      const game = gameSnap.data();
      if (game.isCompleted) {
        throw new Error("Already completed");
      }

      const levelRef = db
        .collection("sudoku_levels")
        .doc(game.levelId);

      const levelSnap = await tx.get(levelRef);
      if (!levelSnap.exists) {
        throw new Error("Level not found");
      }

      const { solution, coins } = levelSnap.data();

      // 1️⃣ Increment attempts
      tx.update(gameRef, {
        attempts: admin.firestore.FieldValue.increment(1),
      });

      // 2️⃣ Validate solution
      if (JSON.stringify(userGrid) !== JSON.stringify(solution)) {
        throw new Error("Wrong solution");
      }

      // 3️⃣ Mark game completed
      tx.update(gameRef, {
        coinsEarned: coins,
        isCompleted: true,
        finishedAt: new Date(),
      });

      // 4️⃣ ADD COINS TO WALLET (❗ REQUIRED)
      tx.update(userRef, {
        "wallet.coins": admin.firestore.FieldValue.increment(coins),
      });

      // 5️⃣ WRITE WALLET HISTORY
      const walletTxnRef = userRef
        .collection("walletHistory")
        .doc();

      tx.set(walletTxnRef, {
        type: "earn",
        source: "sudoku",
        gameId,
        coins,
        createdAt: new Date(),
      });
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
