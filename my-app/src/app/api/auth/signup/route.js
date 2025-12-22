import { db } from "@/lib/firebaseAdmin";
import { createUser } from "@/models/model";

export async function POST(req) {
  const { uid, email, name } = await req.json();

  // check if user already exists
  if (!db) {
    return Response.json(
      { error: "Server missing Firebase credentials" },
      { status: 500 }
    );
  }
  const userRef = db.collection("users").doc(uid);
  const snap = await userRef.get();

  if (snap.exists) {
    return Response.json({ message: "User already exists" });
  }

  const userData = createUser({
    email,
    name,
  });

  await userRef.set(userData);

  return Response.json({ success: true });
}
