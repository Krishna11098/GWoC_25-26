import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

// Public endpoint: returns a single published experience by id
export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = Array.isArray(resolvedParams?.id)
      ? resolvedParams.id.join("/")
      : resolvedParams?.id || "";

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const doc = await db.collection("experiences").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = doc.data();
    if (!data?.isPublished) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const experience = {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.().toISOString?.() || null,
      updatedAt: data.updatedAt?.toDate?.().toISOString?.() || null,
      publishedAt: data.publishedAt?.toDate?.().toISOString?.() || null,
    };

    return NextResponse.json({ experience });
  } catch (error) {
    console.error("Error fetching experience by id:", error);
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}
