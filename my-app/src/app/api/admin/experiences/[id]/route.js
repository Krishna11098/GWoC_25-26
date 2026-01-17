import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";
import admin from "firebase-admin";

/**
 * GET /api/admin/experiences/[id] - Fetch single experience
 */
export async function GET(req, { params: paramsPromise }) {
  try {
    const { id } = await paramsPromise;

    const user = await getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const doc = await db.collection("experiences").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 },
      );
    }

    const data = doc.data();
    return NextResponse.json({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || null,
      updatedAt: data.updatedAt?.toDate().toISOString() || null,
      publishedAt: data.publishedAt?.toDate().toISOString() || null,
    });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch experience" },
      { status: 500 },
    );
  }
}

export async function PATCH(req, { params: paramsPromise }) {
  try {
    const { id } = await paramsPromise;
    const { status, adminNotes } = await req.json();

    const user = await getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (!["pending", "accepted", "rejected", "contacted"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const docRef = db.collection("experiences").doc(id);

    await docRef.update({
      status,
      adminNotes: adminNotes || null,
      isRead: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, status });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/experiences/[id] - Update experience (full update or toggle publish)
 */
export async function PUT(req, { params: paramsPromise }) {
  try {
    const { id } = await paramsPromise;
    const body = await req.json();
    const {
      title,
      excerpt,
      category,
      tags,
      coverImage,
      sections,
      isPublished,
    } = body;

    const user = await getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const docRef = db.collection("experiences").doc(id);
    const now = admin.firestore.FieldValue.serverTimestamp();

    // Check if this is a full update or just a publish toggle
    const isFullUpdate = title !== undefined && coverImage !== undefined;

    if (isFullUpdate) {
      // Full update - require title and coverImage
      if (!title || !coverImage) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        );
      }

      await docRef.update({
        title,
        excerpt: excerpt || "",
        category: category || "",
        tags: tags || [],
        coverImage,
        sections: sections || [],
        isPublished: !!isPublished,
        publishedAt: isPublished ? now : null,
        updatedAt: now,
      });
    } else {
      // Just toggle publish status
      await docRef.update({
        isPublished: !!isPublished,
        publishedAt: isPublished ? now : null,
        updatedAt: now,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/experiences/[id] - Delete experience
 */
export async function DELETE(req, { params: paramsPromise }) {
  try {
    const { id } = await paramsPromise;

    const user = await getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const docRef = db.collection("experiences").doc(id);
    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
