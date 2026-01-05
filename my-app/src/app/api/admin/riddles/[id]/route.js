import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * PUT /api/admin/riddles/[id] - Update a riddle
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
    const { question, solution, coins, isVisibleToUser } = body;

    const riddleDoc = await db.collection("riddles").doc(id).get();
    if (!riddleDoc.exists) {
      return NextResponse.json({ error: "Riddle not found" }, { status: 404 });
    }

    const updateData = {};
    if (question !== undefined) updateData.question = question;
    if (solution !== undefined) updateData.solution = solution;
    if (coins !== undefined) updateData.coins = coins;
    if (isVisibleToUser !== undefined) updateData.isVisibleToUser = isVisibleToUser;

    await db.collection("riddles").doc(id).update(updateData);

    const updatedDoc = await db.collection("riddles").doc(id).get();
    const data = updatedDoc.data();

    return NextResponse.json({
      id: updatedDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || null,
    });
  } catch (error) {
    console.error("Error updating riddle:", error);
    return NextResponse.json(
      { error: "Failed to update riddle" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/riddles/[id] - Delete a riddle
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

    const riddleDoc = await db.collection("riddles").doc(id).get();
    if (!riddleDoc.exists) {
      return NextResponse.json({ error: "Riddle not found" }, { status: 404 });
    }

    await db.collection("riddles").doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting riddle:", error);
    return NextResponse.json(
      { error: "Failed to delete riddle" },
      { status: 500 }
    );
  }
}
