import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest, requireAdmin } from "@/lib/authMiddleware";

export async function GET(req, context) {
  const user = await getUserFromRequest(req);
  if (!requireAdmin(user))
    return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { levelId } = await context.params; // ✅ FIX

  const doc = await db
    .collection("sudoku_levels")
    .doc(levelId)
    .get();

  if (!doc.exists)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ id: doc.id, ...doc.data() });
}


export async function PUT(req, context) {
  const user = await getUserFromRequest(req);
  console.log("DECODED USER:", user);
  if (!requireAdmin(user))
    return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { levelId } = await context.params; // ✅ FIX

  if (!levelId) {
    return NextResponse.json(
      { error: "Missing levelId in URL" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { puzzle, coins, isVisibleToUser } = body;

  const ref = db.collection("sudoku_levels").doc(levelId);
  const snap = await ref.get();

  if (!snap.exists)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { solution } = snap.data();

  // 🔐 validate puzzle
  for (let i = 0; i < 81; i++) {
    if (puzzle[i] !== 0 && puzzle[i] !== solution[i]) {
      return NextResponse.json(
        { error: "Invalid puzzle edit" },
        { status: 400 }
      );
    }
  }

  await ref.update({
    puzzle,
    coins,
    isVisibleToUser,
    isAssigned: true,
    assignedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}

