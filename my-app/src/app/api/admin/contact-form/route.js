import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/admin/contact-form - List all contact form submissions
 */
export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Get URL params for filtering and sorting
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category") || "all";
    const sort = searchParams.get("sort") || "newest";

    let query = db.collection("contact_submissions");

    // Apply status filter
    if (status && status !== "all") {
      query = query.where("status", "==", status);
    }

    // Apply category filter
    if (category && category !== "all") {
      query = query.where("category", "==", category);
    }

    // Apply sorting
    if (sort === "newest") {
      query = query.orderBy("submittedAt", "desc");
    } else if (sort === "oldest") {
      query = query.orderBy("submittedAt", "asc");
    } else if (sort === "date_asc") {
      query = query.orderBy("eventDate", "asc");
    } else if (sort === "date_desc") {
      query = query.orderBy("eventDate", "desc");
    } else {
      query = query.orderBy("submittedAt", "desc");
    }

    const snapshot = await query.get();

    const experiences = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt:
          data.submittedAt?.toDate?.().toISOString?.() || data.submittedAt,
        createdAt: data.createdAt?.toDate?.().toISOString?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.().toISOString?.() || data.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      experiences: experiences,
      count: experiences.length,
    });
  } catch (error) {
    console.error("Error listing submissions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to list submissions" },
      { status: 500 }
    );
  }
}
