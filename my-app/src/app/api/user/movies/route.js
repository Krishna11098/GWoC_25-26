import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/user/movies - Get all visible guess movies for users
 */
export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snap = await db
      .collection("guess_movies")
      .where("isVisibleToUser", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    const movies = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        clueType: data.clueType,
        clueData: data.clueData,
        category: data.category,
        difficulty: data.difficulty,
        coins: data.coins,
        movieNo: data.movieNo,
        hints: Array.isArray(data.hints) ? data.hints : [],
        // Do not send answer to client
      };
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
