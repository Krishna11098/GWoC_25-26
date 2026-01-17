import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebaseAdmin";
import ProductShowcase from "@/components/ProductShowcase";
import FloatingCartButton from "@/components/FloatingCartButton";

export const dynamic = "force-dynamic";

async function getProduct(id) {
  if (!id || !db) return null;
  try {
    const snap = await db.collection("products").doc(id).get();
    if (!snap.exists) return null;

    const data = snap.data();
    // Serialize Firestore objects (Timestamps, etc.) to plain objects
    return JSON.parse(
      JSON.stringify({
        id: snap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt || null,
      })
    );
  } catch (err) {
    console.error("Error fetching product:", err);
    return null;
  }
}

export default async function GameDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return (
      <>
        <Navbar />
        <div
          className="min-h-screen flex items-center justify-center px-6 py-12 mt-32"
          style={{ backgroundColor: "var(--light-blue)" }}
        >
          <div className="text-center">
            <h1
              className="text-3xl font-bold mb-4"
              style={{ color: "var(--dark-teal)" }}
            >
              Invalid Product
            </h1>
            <p className="text-lg" style={{ color: "var(--black)" }}>
              No product ID provided.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const product = await getProduct(id);

  return (
    <>
      <Navbar />
      <ProductShowcase product={product} gameId={id} />
      <FloatingCartButton />
      <Footer />
    </>
  );
}
