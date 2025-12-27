import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./firebaseAdmin.js";

async function backfill() {
  const snapshot = await db.collection("sudoku_levels").get();

  let batch = db.batch();
  let count = 0;

  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, {
      isAssigned: false,
      assignedAt: null,
    });

    count++;

    if (count % 400 === 0) {
      batch.commit();
      batch = db.batch();
    }
  });

  await batch.commit();
  console.log("✅ Backfill complete");
}

backfill();
