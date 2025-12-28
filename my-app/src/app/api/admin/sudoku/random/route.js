import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest, requireAdmin } from "@/lib/authMiddleware";

export async function GET(req) {
  const user = await getUserFromRequest(req);
  console.log("USER:", user);
  if (!requireAdmin(user))
    return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const difficulty = searchParams.get("difficulty");

  const snap = await db
    .collection("sudoku_levels")
    .where("difficulty", "==", difficulty)
    .where("isAssigned", "==", false)
    .limit(10)
    .get();

  if (snap.empty)
    return NextResponse.json({ error: "No puzzles left" }, { status: 404 });

  const randomDoc =
    snap.docs[Math.floor(Math.random() * snap.docs.length)];

  return NextResponse.json({
    levelId: randomDoc.id,
    ...randomDoc.data(),
  });
}
