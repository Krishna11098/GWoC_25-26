import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest, requireAdmin } from "@/lib/authMiddleware";

export async function PUT(req, context) {
  const user = await getUserFromRequest(req);
  console.log("USER of unpublish:", user);
  if (!requireAdmin(user)) {
    return NextResponse.json(
      { error: "Admin only" },
      { status: 403 }
    );
  }

  const { levelId } = await context.params;

  const ref = db.collection("sudoku_levels").doc(levelId);
  const snap = await ref.get();

  if (!snap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await ref.update({
    isVisibleToUser: false,
    isAssigned: false,
    assignedAt: null,
  });

  return NextResponse.json({ success: true });
}
