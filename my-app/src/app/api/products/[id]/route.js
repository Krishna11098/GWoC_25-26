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

// GET - Fetch single product by ID
export async function GET(request, { params }) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Database not initialized" },
        { status: 500 }
      );
    }

    const { id } = await params;

    const doc = await db.collection("products").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    const raw = doc.data();
    const plain = convertFirestoreData(raw);
    return NextResponse.json({ id: doc.id, ...plain });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Database not initialized" },
        { status: 500 }
      );
    }

    const { id } = await params;
    const updates = await request.json();

    await db.collection("products").doc(id).update({
      ...updates,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product: " + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(request, { params }) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Database not initialized" },
        { status: 500 }
      );
    }

    const { id } = await params;

    await db.collection("products").doc(id).delete();

    return NextResponse.json({
      success: true,
      id,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product: " + error.message },
      { status: 500 }
    );
  }
}
