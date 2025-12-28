import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/user/profile
 */
export async function GET(req) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userRef = db.collection("users").doc(user.uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // 🔐 DO NOT expose sensitive fields blindly
  const data = userSnap.data();

  return NextResponse.json({
    uid: user.uid,
    username: data.username ?? null,
    role: data.role,
    wallet: data.wallet,
    onlineGamesPlayed: data.onlineGamesPlayed ?? 0,
    userOrders: data.userOrders ?? [],
    userEvents: data.userEvents ?? [],
    userWorkshops: data.userWorkshops ?? [],
    cart: data.cart ?? { items: [] },
    isCommunityMember: data.isCommunityMember ?? false,
    updatedAt: data.updatedAt,
  });
}
