import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/user/wallet/history
 */
export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const snap = await db
    .collection("users")
    .doc(user.uid)
    .collection("walletHistory")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  const history = snap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Normalize Timestamp fields to ISO strings for the client
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : (data.createdAt ?? null),
    };
  });

  return NextResponse.json(history);
}
