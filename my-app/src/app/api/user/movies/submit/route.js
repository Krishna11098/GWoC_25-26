import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";
import { FieldValue } from "firebase-admin/firestore";

/**
 * POST /api/user/movies/submit - Submit movie guess
 */
export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { movieId, answer } = body;

    if (!movieId || !answer) {
      return NextResponse.json(
        { error: "Movie ID and answer are required" },
        { status: 400 }
      );
    }

    const movieDoc = await db.collection("guess_movies").doc(movieId).get();
    if (!movieDoc.exists) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    const movieData = movieDoc.data();
    const correctAnswer = String(movieData.answer || "").trim().toLowerCase();
    const userAnswer = String(answer).trim().toLowerCase();

    const isCorrect = userAnswer === correctAnswer;
    if (!isCorrect) {
      return NextResponse.json({
        correct: false,
        message: "Incorrect answer. Try again!",
      });
    }

    // Check if already solved
    const userDoc = await db.collection("users").doc(user.uid).get();
    const userData = userDoc.data() || {};
    const solvedMovies = userData.solvedMovies || [];

    if (solvedMovies.includes(movieId)) {
      return NextResponse.json({
        correct: true,
        alreadySolved: true,
        message: "You've already solved this movie!",
        coins: 0,
      });
    }

    const coinsToAward = movieData.coins || 20;
    const currentCoins = userData.wallet?.coins || 0;

    await db
      .collection("users")
      .doc(user.uid)
      .update({
        "wallet.coins": currentCoins + coinsToAward,
        "wallet.coinHistory": FieldValue.arrayUnion({
          amount: coinsToAward,
          reason: `Solved movie: ${String(movieData.clueData).substring(0, 50)}...`,
          timestamp: new Date(),
          type: "earned",
        }),
        solvedMovies: FieldValue.arrayUnion(movieId),
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
    console.error("Error submitting movie answer:", error);
    return NextResponse.json(
      { error: "Failed to submit answer" },
      { status: 500 }
    );
  }
}
