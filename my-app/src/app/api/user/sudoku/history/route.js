import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snap = await db
    .collection("users")
    .doc(user.uid)
    .collection("gamesPlayed")
    .orderBy("startedAt", "desc")
    .get();

  return NextResponse.json(
    snap.docs.map(d => ({ gameId: d.id, ...d.data() }))
  );
}
