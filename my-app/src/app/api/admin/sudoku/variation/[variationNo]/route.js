import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest, requireAdmin } from "@/lib/authMiddleware";

export async function GET(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!requireAdmin(user))
    return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const snap = await db
    .collection("sudoku_levels")
    .where("variationNo", "==", Number(params.variationNo))
    .get();

  return NextResponse.json(
    snap.docs.map(d => ({ id: d.id, ...d.data() }))
  );
}
