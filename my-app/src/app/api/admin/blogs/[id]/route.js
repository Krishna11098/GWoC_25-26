import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/admin/blogs/[id] - Get a single blog
 */
export async function GET(req, { params }) {
  try {
    console.log("🔍 [Admin API] GET /api/admin/blogs/[id] - Starting...");
    
    // ⚠️ IMPORTANT: In Next.js 15, params is a Promise and must be awaited
    const resolvedParams = await params;
    const { id } = resolvedParams;
    console.log("📋 Blog ID:", id);

    const user = await getUserFromRequest(req);
    console.log("👤 User authenticated:", user ? user.email : "No user");
    
    if (!user) {
      console.log("❌ Authentication failed - No user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("� User role:", user.role);
    if (user.role !== "admin") {
      console.log("❌ Access denied - User role is not admin");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log("✅ Admin access granted - Fetching blog...");
    const blogDoc = await db.collection("blogs").doc(id).get();

    if (!blogDoc.exists) {
      console.log("❌ Blog not found:", id);
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const data = blogDoc.data();
    console.log("✅ Blog fetched successfully:", data.title);
    
    return NextResponse.json({
      id: blogDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || null,
      updatedAt: data.updatedAt?.toDate().toISOString() || null,
      publishedAt: data.publishedAt?.toDate().toISOString() || null,
    });
  } catch (error) {
    console.error("💥 [Admin API] ERROR fetching blog:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Failed to fetch blog", details: error.message },
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

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // ⚠️ IMPORTANT: In Next.js 15, params is a Promise and must be awaited
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    const { title, excerpt, category, tags, coverImage, isPublished, sections } = body;

    const blogDoc = await db.collection("blogs").doc(id).get();
    if (!blogDoc.exists) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (coverImage && !coverImage.trim()) {
      return NextResponse.json(
        { error: "Cover image is mandatory" },
        { status: 400 }
      );
    }

    const updateData = {
      ...(title && { title }),
      ...(excerpt !== undefined && { excerpt }),
      ...(category && { category }),
      ...(tags !== undefined && { tags }),
      ...(coverImage !== undefined && { coverImage }),
      ...(sections !== undefined && { sections }),
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

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // ⚠️ IMPORTANT: In Next.js 15, params is a Promise and must be awaited
    const resolvedParams = await params;
    const { id } = resolvedParams;
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
