import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/admin/movies - Get all guess movies
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
    const snap = await db
      .collection("guess_movies")
      .orderBy("createdAt", "desc")
      .get();

    const movies = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || null,
    }));

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/movies - Create a new guess movie
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
    const {
      clueType,
      clueData,
      answer,
      category,
      difficulty,
      hints,
      coins,
      isVisibleToUser,
    } = body;

    if (!clueType || !clueData || !answer) {
      return NextResponse.json(
        { error: "clueType, clueData, and answer are required" },
        { status: 400 }
      );
    }

    const movieData = {
      clueType,
      clueData,
      answer,
      category: category || "General",
      difficulty: difficulty || "medium",
      hints: Array.isArray(hints)
        ? hints
        : typeof hints === "string" && hints.trim()
        ? hints.split(",").map((h) => h.trim()).filter(Boolean)
        : [],
      coins: coins || 20,
      isVisibleToUser: Boolean(isVisibleToUser),
      createdAt: new Date(),
    };

    const docRef = await db.collection("guess_movies").add(movieData);

    return NextResponse.json({
      id: docRef.id,
      ...movieData,
      createdAt: movieData.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating movie:", error);
    return NextResponse.json(
      { error: "Failed to create movie" },
      { status: 500 }
    );
  }
}
