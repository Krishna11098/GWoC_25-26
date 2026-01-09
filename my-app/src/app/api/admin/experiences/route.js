import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/admin/experiences - List experiences
 * POST /api/admin/experiences - Create experience
 */
export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const snapshot = await db.collection("experiences").orderBy("createdAt", "desc").get();
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

    return NextResponse.json({ experiences });
  } catch (error) {
    console.error("Error listing experiences:", error);
    return NextResponse.json({ error: "Failed to list experiences" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { title, excerpt, category, tags, coverImage, isPublished, sections } = body;

    if (!title || !coverImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date();
    const docRef = await db.collection("experiences").add({
      title,
      excerpt: excerpt || "",
      category: category || "",
      tags: tags || [],
      coverImage,
      isPublished: !!isPublished,
      sections: sections || [],
      author: {
        uid: user.uid,
        email: user.email || null,
      },
      createdAt: now,
      updatedAt: now,
      publishedAt: isPublished ? now : null,
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}

