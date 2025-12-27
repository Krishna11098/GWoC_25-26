import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET() {
  const snap = await db
    .collection("sudoku_levels")
    .where("isVisibleToUser", "==", true)
    .get();

    const snapp = await db.collection("sudoku_levels").get();
console.log("COUNT:", snapp.size);

console.log("LEVELS:", snap.size);


  return NextResponse.json(
    snap.docs.map(d => ({
      levelId: d.id,
      difficulty: d.data().difficulty,
      puzzle: d.data().puzzle,
      coins: d.data().coins,
    }))
  );
}
