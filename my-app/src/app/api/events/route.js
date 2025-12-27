import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

function serializeDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return value;
}

function mapEvent(doc) {
  const data = doc.data() || {};
  const dateValue = data.date ?? data.startDate ?? null;

  return {
    id: doc.id,
    title: data.title ?? data.name ?? "Untitled event",
    description: data.description ?? data.shortDescription ?? "",
    date: serializeDate(dateValue),
    eventStartTime: data.eventStartTime ?? "09:00",
    duration: data.duration ?? 60,
    location: data.location ?? data.venue ?? "",
    category: data.category ?? "general",
    image: data.image ?? data.imageUrl ?? null,
    createdAt: serializeDate(data.createdAt),
    updatedAt: serializeDate(data.updatedAt),
  };
}

export async function GET() {
  try {
    const snapshot = await db.collection("events").get();

    const events = snapshot.docs
      .map(mapEvent)
      .sort((a, b) => {
        const aTime = a.date ? new Date(a.date).getTime() : Number.POSITIVE_INFINITY;
        const bTime = b.date ? new Date(b.date).getTime() : Number.POSITIVE_INFINITY;
        return aTime - bTime;
      });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events from Firestore", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
