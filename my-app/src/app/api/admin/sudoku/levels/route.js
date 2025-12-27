import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest, requireAdmin } from "@/lib/authMiddleware";

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!requireAdmin(user)) {
    return NextResponse.json(
      { error: "Admin only" },
      { status: 403 }
    );
  }

  const snap = await db
    .collection("sudoku_levels")
    .where("isVisibleToUser", "==", true)
    .orderBy("assignedAt", "desc")
    .get();

  const levels = snap.docs.map(doc => {
    const data = doc.data();

    return {
      levelId: doc.id,

      // 🔹 what users see
      difficulty: data.difficulty,
      puzzle: data.puzzle,
      coins: data.coins,

      // 🔹 admin-only (VERY IMPORTANT)
      solution: data.solution,

      variationNo: data.variationNo,
      levelNo: data.levelNo,

      isAssigned: data.isAssigned,
      assignedAt: data.assignedAt,
      createdAt: data.createdAt,

      isVisibleToUser: data.isVisibleToUser,
    };
  });

  return NextResponse.json(levels);
}
