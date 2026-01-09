import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

// Public endpoint: returns published experiences (optionally filtered by category)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query = db.collection("experiences").where("isPublished", "==", true);
    if (category) {
      query = query.where("category", "==", category);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();
    const experiences = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.().toISOString?.() || null,
        updatedAt: data.updatedAt?.toDate?.().toISOString?.() || null,
        publishedAt: data.publishedAt?.toDate?.().toISOString?.() || null,
      };
    });

    return NextResponse.json({ experiences });
  } catch (error) {
    console.error("Error listing public experiences:", error);
    return NextResponse.json({ error: "Failed to list experiences" }, { status: 500 });
  }
}
