import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/admin/blogs - Get all blogs
 */
export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin role
  const userDoc = await db.collection("users").doc(user.uid).get();
  if (!userDoc.exists || userDoc.data().role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const blogsSnap = await db
      .collection("blogs")
      .orderBy("createdAt", "desc")
      .get();

    const blogs = blogsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate().toISOString() || null,
      publishedAt: doc.data().publishedAt?.toDate().toISOString() || null,
    }));

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/blogs - Create a new blog
 */
export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin role
  const userDoc = await db.collection("users").doc(user.uid).get();
  if (!userDoc.exists || userDoc.data().role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, content, excerpt, category, tags, coverImage, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const blogData = {
      title,
      content,
      excerpt: excerpt || "",
      category: category || "general",
      tags: tags || [],
      coverImage: coverImage || "",
      author: {
        uid: user.uid,
        email: user.email,
      },
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection("blogs").add(blogData);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Blog created successfully",
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
