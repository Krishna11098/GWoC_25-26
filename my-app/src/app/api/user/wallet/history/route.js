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

  const history = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(history);
}
