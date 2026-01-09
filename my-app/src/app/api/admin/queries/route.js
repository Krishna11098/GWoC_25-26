import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/admin/queries - List all queries
 */
export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const snapshot = await db
      .collection("queries")
      .orderBy("createdAt", "desc")
      .get();
    const queries = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || null,
        updatedAt: data.updatedAt?.toDate().toISOString() || null,
      };
    });

    return NextResponse.json({ queries });
  } catch (error) {
    console.error("Error listing queries:", error);
    return NextResponse.json(
      { error: "Failed to list queries" },
      { status: 500 }
    );
  }
}
