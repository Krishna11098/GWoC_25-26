import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/user/games/history
 */
export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snap = await db
    .collection("users")
    .doc(user.uid)
    .collection("gamesPlayed")
    // Align with game creation which sets `startedAt`
    .orderBy("startedAt", "desc")
    .limit(100)
    .get();

  const history = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Normalize Timestamp fields to ISO strings
      startedAt: data.startedAt?.toDate
        ? data.startedAt.toDate().toISOString()
        : (data.startedAt ?? null),
      finishedAt: data.finishedAt?.toDate
        ? data.finishedAt.toDate().toISOString()
        : (data.finishedAt ?? null),
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : (data.createdAt ?? null),
    };
  });
  return NextResponse.json(history);
}
