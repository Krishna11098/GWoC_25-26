import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/user/riddles - Get all visible riddles for users
 */
export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const riddlesSnap = await db
      .collection("riddles")
      .where("isVisibleToUser", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    const riddles = riddlesSnap.docs.map((doc) => ({
      id: doc.id,
      question: doc.data().question,
      coins: doc.data().coins,
      riddleNo: doc.data().riddleNo,
      // Don't send solution to client
    }));

    return NextResponse.json(riddles);
  } catch (error) {
    console.error("Error fetching riddles:", error);
    return NextResponse.json(
      { error: "Failed to fetch riddles" },
      { status: 500 }
    );
  }
}
