import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

/**
 * GET /api/experiences - List all published experiences
 */
export async function GET(req) {
  try {
    const snapshot = await db
      .collection("experiences")
      .where("isPublished", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    const experiences = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || null,
        updatedAt: data.updatedAt?.toDate().toISOString() || null,
        publishedAt: data.publishedAt?.toDate().toISOString() || null,
      };
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error listing experiences:", error);
    return NextResponse.json({ error: "Failed to list experiences" }, { status: 500 });
  }
}
