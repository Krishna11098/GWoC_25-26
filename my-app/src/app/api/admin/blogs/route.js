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
    const { title, excerpt, category, tags, coverImage, isPublished, sections } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!coverImage) {
      return NextResponse.json(
        { error: "Cover image is mandatory" },
        { status: 400 }
      );
    }

    if (!sections || sections.length === 0) {
      return NextResponse.json(
        { error: "At least one section is required" },
        { status: 400 }
      );
    }

    const blogData = {
      title,
      excerpt: excerpt || "",
      category: category || "Game Strategy",
      tags: tags || [],
      coverImage,
      sections: sections || [],
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
