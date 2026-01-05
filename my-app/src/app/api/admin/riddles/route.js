import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/admin/riddles - Get all riddles
 */
export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const riddlesSnap = await db
      .collection("riddles")
      .orderBy("createdAt", "desc")
      .get();

    const riddles = riddlesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || null,
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

/**
 * POST /api/admin/riddles - Create a new riddle
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
    const body = await req.json();
    const { question, solution, coins, isVisibleToUser } = body;

    if (!question || !solution) {
      return NextResponse.json(
        { error: "Question and solution are required" },
        { status: 400 }
      );
    }

    const riddleData = {
      question,
      solution,
      coins: coins || 20,
      isVisibleToUser: isVisibleToUser || false,
      createdAt: new Date(),
    };

    const docRef = await db.collection("riddles").add(riddleData);

    return NextResponse.json({
      id: docRef.id,
      ...riddleData,
      createdAt: riddleData.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating riddle:", error);
    return NextResponse.json(
      { error: "Failed to create riddle" },
      { status: 500 }
    );
  }
}
