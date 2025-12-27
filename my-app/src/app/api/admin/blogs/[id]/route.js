import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/admin/blogs/[id] - Get a single blog
 */
export async function GET(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userDoc = await db.collection("users").doc(user.uid).get();
  if (!userDoc.exists || userDoc.data().role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = params;
    const blogDoc = await db.collection("blogs").doc(id).get();

    if (!blogDoc.exists) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const data = blogDoc.data();
    return NextResponse.json({
      id: blogDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || null,
      updatedAt: data.updatedAt?.toDate().toISOString() || null,
      publishedAt: data.publishedAt?.toDate().toISOString() || null,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/blogs/[id] - Update a blog
 */
export async function PUT(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userDoc = await db.collection("users").doc(user.uid).get();
  if (!userDoc.exists || userDoc.data().role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = params;
    const body = await req.json();
    const { title, content, excerpt, category, tags, coverImage, isPublished } = body;

    const blogDoc = await db.collection("blogs").doc(id).get();
    if (!blogDoc.exists) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const updateData = {
      ...(title && { title }),
      ...(content && { content }),
      ...(excerpt !== undefined && { excerpt }),
      ...(category && { category }),
      ...(tags !== undefined && { tags }),
      ...(coverImage !== undefined && { coverImage }),
      updatedAt: new Date(),
    };

    // Handle publish status change
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      if (isPublished && !blogDoc.data().publishedAt) {
        updateData.publishedAt = new Date();
      } else if (!isPublished) {
        updateData.publishedAt = null;
      }
    }

    await db.collection("blogs").doc(id).update(updateData);

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/blogs/[id] - Delete a blog
 */
export async function DELETE(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userDoc = await db.collection("users").doc(user.uid).get();
  if (!userDoc.exists || userDoc.data().role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = params;
    const blogDoc = await db.collection("blogs").doc(id).get();

    if (!blogDoc.exists) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await db.collection("blogs").doc(id).delete();

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
