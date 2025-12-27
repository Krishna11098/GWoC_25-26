import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { levelId } = await req.json();

  // Validate payload early to avoid Firestore path errors
  if (!levelId || typeof levelId !== "string") {
    return NextResponse.json(
      { error: "levelId is required" },
      { status: 400 }
    );
  }

  const levelSnap = await db
    .collection("sudoku_levels")
    .doc(levelId)
    .get();

  if (!levelSnap.exists) {
    return NextResponse.json(
      { error: "Level not found" },
      { status: 404 }
    );
  }

  const gameRef = db
    .collection("users")
    .doc(user.uid)
    .collection("gamesPlayed")
    .doc();

  const levelData = levelSnap.data();

  await gameRef.set({
    gameName: "sudoku",
    levelId,
    difficulty: levelData.difficulty,
    // Persist the puzzle snapshot so play page can render immediately
    initialGrid: levelData.puzzle,
    solution: levelData.solution,
    attempts: 0,
    hintsUsed: 0,
    coinsEarned: 0,
    startedAt: new Date(),
    finishedAt: null,
    isCompleted: false,
  });

  return NextResponse.json({ gameId: gameRef.id });
}
