import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

// Helper to convert Firestore timestamps
function convertFirestoreData(raw) {
  const plain = {};
  Object.entries(raw).forEach(([key, value]) => {
    if (value && typeof value.toMillis === "function") {
      plain[key] = value.toMillis();
    } else {
      plain[key] = value;
    }
  });
  return plain;
}

// GET - Fetch all products
export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Database not initialized" },
        { status: 500 }
      );
    }

    const snap = await db.collection("products").get();
    const products = snap.docs.map((d) => {
      const raw = d.data();
      const plain = convertFirestoreData(raw);
      return { id: d.id, ...plain };
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Database not initialized" },
        { status: 500 }
      );
    }

    const productData = await request.json();

    const docRef = await db.collection("products").add({
      ...productData,
      createdAt: new Date(),
    });

    return NextResponse.json({
      id: docRef.id,
      ...productData,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product: " + error.message },
      { status: 500 }
    );
  }
}
