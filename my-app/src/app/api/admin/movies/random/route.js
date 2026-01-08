import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * POST /api/admin/movies/random - Get random invisible movie and make it visible
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
    const snap = await db
      .collection("guess_movies")
      .where("isVisibleToUser", "==", false)
      .get();

    if (snap.empty) {
      return NextResponse.json(
        { error: "No invisible movies available" },
        { status: 404 }
      );
    }

    const docs = snap.docs;
    const randomIndex = Math.floor(Math.random() * docs.length);
    const selected = docs[randomIndex];

    await db.collection("guess_movies").doc(selected.id).update({
      isVisibleToUser: true,
    });

    const data = selected.data();
    return NextResponse.json({
      id: selected.id,
      ...data,
      isVisibleToUser: true,
      createdAt: data.createdAt?.toDate().toISOString() || null,
    });
  } catch (error) {
    console.error("Error making random movie visible:", error);
    return NextResponse.json(
      { error: "Failed to add random movie" },
      { status: 500 }
    );
  }
}
