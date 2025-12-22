import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebaseAdmin";
import ProductShowcase from "@/components/ProductShowcase";

export const dynamic = "force-dynamic";

async function getProduct(id) {
  if (!id || !db) return null;
  try {
    const snap = await db.collection("products").doc(id).get();
    if (!snap.exists) return null;
    
    const data = snap.data();
    // Serialize Firestore objects (Timestamps, etc.) to plain objects
    return JSON.parse(JSON.stringify({
      id: snap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt || null,
    }));
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
        <div className="bg-black text-white min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Invalid Product</h1>
            <p className="text-gray-400">No product ID provided.</p>
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
      <Footer />
    </>
  );
}
