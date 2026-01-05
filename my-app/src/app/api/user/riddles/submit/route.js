import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";
import { FieldValue } from "firebase-admin/firestore";

/**
 * POST /api/user/riddles/submit - Submit riddle answer
 */
export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { riddleId, answer } = body;

    if (!riddleId || !answer) {
      return NextResponse.json(
        { error: "Riddle ID and answer are required" },
        { status: 400 }
      );
    }

    // Get the riddle
    const riddleDoc = await db.collection("riddles").doc(riddleId).get();
    if (!riddleDoc.exists) {
      return NextResponse.json({ error: "Riddle not found" }, { status: 404 });
    }

    const riddleData = riddleDoc.data();
    const correctAnswer = riddleData.solution.trim().toLowerCase();
    const userAnswer = answer.trim().toLowerCase();

    // Check if answer is correct
    const isCorrect = userAnswer === correctAnswer;

    if (!isCorrect) {
      return NextResponse.json({
        correct: false,
        message: "Incorrect answer. Try again!",
      });
    }

    // Check if user already solved this riddle
    const userDoc = await db.collection("users").doc(user.uid).get();
    const userData = userDoc.data();
    const solvedRiddles = userData.solvedRiddles || [];

    if (solvedRiddles.includes(riddleId)) {
      return NextResponse.json({
        correct: true,
        alreadySolved: true,
        message: "You've already solved this riddle!",
        coins: 0,
      });
    }

    // Award coins and update user data
    const coinsToAward = riddleData.coins || 20;
    const currentCoins = userData.wallet?.coins || 0;

    await db
      .collection("users")
      .doc(user.uid)
      .update({
        "wallet.coins": currentCoins + coinsToAward,
        "wallet.coinHistory": FieldValue.arrayUnion({
          amount: coinsToAward,
          reason: `Solved riddle: ${riddleData.question.substring(0, 50)}...`,
          timestamp: new Date(),
          type: "earned",
        }),
        solvedRiddles: FieldValue.arrayUnion(riddleId),
        onlineGamesPlayed: FieldValue.increment(1),
      });

    return NextResponse.json({
      correct: true,
      alreadySolved: false,
      message: "Correct! You earned coins!",
      coins: coinsToAward,
      totalCoins: currentCoins + coinsToAward,
    });
  } catch (error) {
    console.error("Error submitting riddle answer:", error);
    return NextResponse.json(
      { error: "Failed to submit answer" },
      { status: 500 }
    );
  }
}
