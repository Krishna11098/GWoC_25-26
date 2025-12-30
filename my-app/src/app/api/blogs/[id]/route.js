import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

/**
 * GET /api/blogs/[id] - Get a single published blog by ID (public endpoint)
 */
export async function GET(req, { params }) {
  try {
    // ⚠️ Next.js 15: params is now a Promise and must be awaited
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const blogDoc = await db.collection("blogs").doc(id).get();

    if (!blogDoc.exists) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    const data = blogDoc.data();

    // Only return if blog is published
    if (!data.isPublished) {
      return NextResponse.json(
        { error: "Blog not published" },
        { status: 404 }
      );
    }

    const blog = {
      id: blogDoc.id,
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      coverImage: data.coverImage,
      sections: data.sections || [],
      tags: data.tags || [],
      author: data.author || "Admin",
      isPublished: data.isPublished,
      createdAt: data.createdAt?.toDate().toISOString() || null,
      updatedAt: data.updatedAt?.toDate().toISOString() || null,
      publishedAt: data.publishedAt?.toDate().toISOString() || null,
    };

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
