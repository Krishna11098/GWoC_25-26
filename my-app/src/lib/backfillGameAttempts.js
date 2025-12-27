import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./firebaseAdmin.js";

async function backfill() {
  const usersSnap = await db.collection("users").get();

  let batch = db.batch();
  let ops = 0;

  for (const userDoc of usersSnap.docs) {
    const gamesSnap = await userDoc.ref
      .collection("gamesPlayed")
      .get();

    for (const gameDoc of gamesSnap.docs) {
      batch.update(gameDoc.ref, {
        attempts: 0,
        hintsUsed: 0,
      });

      ops++;

      if (ops === 400) {
        await batch.commit();
        batch = db.batch();
        ops = 0;
      }
    }
  }

  if (ops > 0) await batch.commit();

  console.log("✅ Backfilled attempts & hintsUsed");
}

backfill();
