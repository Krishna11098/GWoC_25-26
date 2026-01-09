import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/admin/experiences/[id] - Get a single experience
 */
export async function GET(req, { params }) {
  try {
    const resolved = await params;
    const { id } = resolved;

    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const docSnap = await db.collection("experiences").doc(id).get();
    if (!docSnap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data = docSnap.data();
    return NextResponse.json({
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || null,
      updatedAt: data.updatedAt?.toDate().toISOString() || null,
      publishedAt: data.publishedAt?.toDate().toISOString() || null,
    });
  } catch (error) {
    console.error("Error fetching experience:", error);
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const resolved = await params;
    const { id } = resolved;
    const body = await req.json();
    const { title, excerpt, category, tags, coverImage, isPublished, sections } = body;

    const docRef = db.collection("experiences").doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updateData = {
      ...(title !== undefined && { title }),
      ...(excerpt !== undefined && { excerpt }),
      ...(category !== undefined && { category }),
      ...(tags !== undefined && { tags }),
      ...(coverImage !== undefined && { coverImage }),
      ...(sections !== undefined && { sections }),
      updatedAt: new Date(),
    };

    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      if (isPublished && !docSnap.data().publishedAt) {
        updateData.publishedAt = new Date();
      } else if (!isPublished) {
        updateData.publishedAt = null;
      }
    }

    await docRef.update(updateData);

    return NextResponse.json({ success: true, message: "Experience updated" });
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const resolved = await params;
    const { id } = resolved;
    const docRef = db.collection("experiences").doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await docRef.delete();

    return NextResponse.json({ success: true, message: "Experience deleted" });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
// /app/api/admin/experiences/[id]/route.js
import { db as clientDb } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Experience ID is required" },
        { status: 400 }
      );
    }

    if (
      !status ||
      !["pending", "accepted", "rejected", "contacted"].includes(status)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const experienceRef = doc(clientDb, "experiences", id);

    const updateData = {
      status,
      updatedAt: serverTimestamp(),
      isRead: true,
    };

    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    await updateDoc(experienceRef, updateData);

    console.log(`✅ Experience ${id} updated to status: ${status}`);

    return NextResponse.json({
      success: true,
      message: `Experience ${status} successfully`,
      id,
      status,
    });
  } catch (error) {
    console.error("❌ Error updating experience:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
