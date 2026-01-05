import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * POST /api/admin/riddles/random - Get random invisible riddle and make it visible
 */
export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Get all invisible riddles
    const invisibleRiddlesSnap = await db
      .collection("riddles")
      .where("isVisibleToUser", "==", false)
      .get();

    if (invisibleRiddlesSnap.empty) {
      return NextResponse.json(
        { error: "No invisible riddles available" },
        { status: 404 }
      );
    }

    // Pick a random one
    const invisibleRiddles = invisibleRiddlesSnap.docs;
    const randomIndex = Math.floor(Math.random() * invisibleRiddles.length);
    const selectedRiddle = invisibleRiddles[randomIndex];

    // Make it visible
    await db.collection("riddles").doc(selectedRiddle.id).update({
      isVisibleToUser: true,
    });

    const data = selectedRiddle.data();
    return NextResponse.json({
      id: selectedRiddle.id,
      ...data,
      isVisibleToUser: true,
      createdAt: data.createdAt?.toDate().toISOString() || null,
    });
  } catch (error) {
    console.error("Error fetching random riddle:", error);
    return NextResponse.json(
      { error: "Failed to fetch random riddle" },
      { status: 500 }
    );
  }
}
