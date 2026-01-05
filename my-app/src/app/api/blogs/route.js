import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

/**
 * GET /api/blogs - Get all published blogs (public endpoint)
 */
export async function GET(req) {
  try {
    // Fetch all blogs and filter/sort in JavaScript to avoid composite index requirement
    const blogsSnap = await db
      .collection("blogs")
      .get();

    const blogs = blogsSnap.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          excerpt: data.excerpt,
          category: data.category,
          coverImage: data.coverImage,
          tags: data.tags || [],
          author: data.author || "Admin",
          isPublished: data.isPublished || false,
          createdAt: data.createdAt?.toDate() || null,
          updatedAt: data.updatedAt?.toDate() || null,
          publishedAt: data.publishedAt?.toDate() || null,
        };
      })
      .filter((blog) => blog.isPublished === true) // Filter published blogs
      .sort((a, b) => {
        // Sort by createdAt descending (newest first)
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt - a.createdAt;
      })
      .map((blog) => ({
        // Convert dates to ISO strings for JSON response
        ...blog,
        createdAt: blog.createdAt?.toISOString() || null,
        updatedAt: blog.updatedAt?.toISOString() || null,
        publishedAt: blog.publishedAt?.toISOString() || null,
      }));

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
