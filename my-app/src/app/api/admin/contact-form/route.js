import { NextResponse } from "next/server";
import { db, auth } from "@/lib/firebaseAdmin";

/**
 * GET /api/admin/contact-form - List all contact form submissions
 */
export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      await auth.verifyIdToken(token);
    } catch (e) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get URL params for filtering and sorting
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category") || "all";
    const sort = searchParams.get("sort") || "newest";

    let query = db.collection("contact_submissions");
    let hasFilters = false;

    // Apply status filter
    if (status && status !== "all") {
      query = query.where("status", "==", status);
      hasFilters = true;
    }

    // Apply category filter
    if (category && category !== "all") {
      query = query.where("category", "==", category);
      hasFilters = true;
    }

    // Apply sorting - only order by if we have filters or if field exists
    if (sort === "date_asc" || sort === "date_desc") {
      query = query.orderBy("eventDate", sort === "date_asc" ? "asc" : "desc");
    } else {
      // For newest/oldest, use createdAt (works with or without filters)
      const direction = sort === "oldest" ? "asc" : "desc";
      if (hasFilters) {
        query = query.orderBy("createdAt", direction);
      } else {
        // Without orderBy constraint, just fetch all
        query = query.limit(1000); // safety limit
      }
    }

    const snapshot = await query.get();

    const experiences = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt:
          data.submittedAt?.toDate?.().toISOString?.() || data.createdAt?.toDate?.().toISOString?.() || data.submittedAt,
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
    console.error("Error details:", { code: error.code, message: error.message });
    return NextResponse.json(
      { success: false, error: error.message || "Failed to list submissions" },
      { status: 500 }
    );
  }
}
