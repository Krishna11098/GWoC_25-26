import { auth, db } from "@/lib/firebaseAdmin";

async function getUidFromHeader(req) {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.slice("Bearer ".length).trim();
  try {
    const decoded = await auth.verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function GET(req) {
  try {
    if (!db) {
      return Response.json({ error: "Server missing Firebase credentials" }, { status: 500 });
    }
    const uid = await getUidFromHeader(req);
    if (!uid) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itemsSnap = await db.collection("carts").doc(uid).collection("items").get();
    const items = itemsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return Response.json({ items }, { status: 200 });
  } catch (err) {
    console.error("Cart GET error:", err);
    return Response.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!db) {
      return Response.json({ error: "Server missing Firebase credentials" }, { status: 500 });
    }
    const uid = await getUidFromHeader(req);
    if (!uid) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, gameId, quantity } = await req.json();
    if (!gameId) {
      return Response.json({ error: "Missing gameId" }, { status: 400 });
    }

    const cartItemsCol = db.collection("carts").doc(uid).collection("items");
    const itemRef = cartItemsCol.doc(gameId);

    // Always validate against products collection for price/category/title
    const productRef = db.collection("products").doc(gameId);
    const productSnap = await productRef.get();
    // Fallback dataset for demo/dummy items used by the Games page when DB is empty
    const fallbackMap = {
      "buzzed": { id: "buzzed", name: "Buzzed – The Drinking Card Game", category: "card_game", price: 14.99, stockAvailable: 50 },
      "dead-mans-deck": { id: "dead-mans-deck", name: "Dead Man's Deck", category: "card_game", price: 19.99, stockAvailable: 30 },
      "judge-me-guess": { id: "judge-me-guess", name: "Judge Me & Guess", category: "party_game", price: 16.99, stockAvailable: 40 },
      "mehfil": { id: "mehfil", name: "Mehfil – The Ultimate Musical Card Game", category: "card_game", price: 24.99, stockAvailable: 25 },
      "one-more-round": { id: "one-more-round", name: "One More Round", category: "party_game", price: 17.99, stockAvailable: 35 },
      "tamasha": { id: "tamasha", name: "Tamasha – The Bollywood Bid Card Game", category: "card_game", price: 22.99, stockAvailable: 45 },
      "the-bloody-inheritance": { id: "the-bloody-inheritance", name: "The Bloody Inheritance", category: "mystery_game", price: 29.99, stockAvailable: 20 },
      // also include ids from the seed endpoint for robustness
      "catan-base": { id: "catan-base", name: "Catan", category: "board_game", price: 39.99, stockAvailable: 60 },
      "carcassonne-classic": { id: "carcassonne-classic", name: "Carcassonne", category: "board_game", price: 29.99, stockAvailable: 55 },
      "azul": { id: "azul", name: "Azul", category: "board_game", price: 34.99, stockAvailable: 40 },
      "uno": { id: "uno", name: "UNO", category: "card_game", price: 9.99, stockAvailable: 100 },
      "exploding-kittens": { id: "exploding-kittens", name: "Exploding Kittens", category: "card_game", price: 19.99, stockAvailable: 70 },
      "chess-set": { id: "chess-set", name: "Chess Set", category: "board_game", price: 24.99, stockAvailable: 50 },
    };

    let product;
    if (!productSnap.exists) {
      const fb = fallbackMap[gameId];
      if (!fb) {
        return Response.json({ error: "Product not found" }, { status: 404 });
      }
      // Create the product in Firestore so subsequent reads use server truth
      await productRef.set({
        name: fb.name,
        category: fb.category,
        price: fb.price,
        stockAvailable: fb.stockAvailable || 0,
        createdAt: new Date(),
        isFeatured: false,
      }, { merge: true });
      product = fb;
    } else {
      product = productSnap.data();
    }
    const validated = {
      title: product.name || product.title || "Untitled",
      category: product.category || "Unknown",
      price: typeof product.price === "number" ? product.price : 0,
    };

    if (action === "remove") {
      await itemRef.delete();
      return Response.json({ success: true }, { status: 200 });
    }

    if (action === "update") {
      // Update to explicit quantity (>=1) or remove if <=0
      if (typeof quantity !== "number") {
        return Response.json({ error: "Missing quantity" }, { status: 400 });
      }
      if (quantity <= 0) {
        await itemRef.delete();
        return Response.json({ success: true }, { status: 200 });
      }
      
      // Check if sufficient stock is available
      const availableStock = product.stockAvailable || 0;
      if (quantity > availableStock) {
        return Response.json(
          { error: `Only ${availableStock} units available in stock` },
          { status: 400 }
        );
      }
      
      await itemRef.set(
        {
          ...validated,
          quantity,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        { merge: true }
      );
      return Response.json({ success: true }, { status: 200 });
    }

    // Default action: add (increment by 1 or create)
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(itemRef);
      const availableStock = product.stockAvailable || 0;
      
      if (snap.exists) {
        const prev = snap.data();
        const newQty = (prev.quantity || 0) + 1;
        
        // Check if sufficient stock is available
        if (newQty > availableStock) {
          throw new Error(`Only ${availableStock} units available in stock`);
        }
        
        tx.update(itemRef, { ...validated, quantity: newQty, updatedAt: new Date() });
      } else {
        // Check if at least 1 unit is available
        if (availableStock < 1) {
          throw new Error("Product is out of stock");
        }
        
        tx.set(itemRef, { ...validated, quantity: 1, createdAt: new Date(), updatedAt: new Date() });
      }
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Cart POST error:", err);
    
    // Return specific error message if it's a stock availability error
    if (err.message && (err.message.includes("available in stock") || err.message.includes("out of stock"))) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    
    return Response.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
