import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * PUT /api/admin/movies/[id] - Update a guess movie
 */
export async function PUT(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    const doc = await db.collection("guess_movies").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    const updateData = {};
    const updatable = [
      "clueType",
      "clueData",
      "answer",
      "category",
      "difficulty",
      "coins",
      "isVisibleToUser",
      "hints",
      "movieNo",
    ];
    for (const key of updatable) {
      if (body[key] !== undefined) {
        updateData[key] = key === "hints" && typeof body[key] === "string"
          ? body[key]
              .split(",")
              .map((h) => h.trim())
              .filter(Boolean)
          : body[key];
      }
    }

    await db.collection("guess_movies").doc(id).update(updateData);

    const updated = await db.collection("guess_movies").doc(id).get();
    const data = updated.data();
    return NextResponse.json({
      id: updated.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || null,
    });
  } catch (error) {
    console.error("Error updating movie:", error);
    return NextResponse.json(
      { error: "Failed to update movie" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/movies/[id] - Delete a guess movie
 */
export async function DELETE(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const doc = await db.collection("guess_movies").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    await db.collection("guess_movies").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json(
      { error: "Failed to delete movie" },
      { status: 500 }
    );
  }
}
