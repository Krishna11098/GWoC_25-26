import { auth, db } from "@/lib/firebaseAdmin";
import { createUser } from "@/models/model";

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!db) {
      return Response.json(
        { error: "Server missing Firebase credentials" },
        { status: 500 }
      );
    }

    // 1️⃣ Verify Firebase ID token
    const decoded = await auth.verifyIdToken(token);

    const { uid, email, name, picture } = decoded;

    // 2️⃣ Reference user document
    const userRef = db.collection("users").doc(uid);
    const snap = await userRef.get();

    // 3️⃣ If user does NOT exist → create
    if (!snap.exists) {
      const userData = createUser({
        email,
        name: name || "",
        avatar: picture || "",
      });

      await userRef.set(userData);
    }

    // 4️⃣ Return success (login + auto-signup)
    return Response.json(
      { success: true, uid, email },
      { status: 200 }
    );
  } catch (err) {
    console.error("Auth error:", err);
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
