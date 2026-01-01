import { auth as adminAuth, db } from "./firebaseAdmin";

/**
 * Verify Firebase ID token from Authorization header
 * Also fetches user document to attach role and custom claims
 */
export async function getUserFromRequest(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    console.log("Decoded token:", decoded);
    
    // Fetch user document from Firestore to get role and custom claims
    try {
      const userDoc = await db.collection("users").doc(decoded.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const userWithRole = {
          ...decoded,
          role: userData.role,
          admin: userData.admin || userData.role === "admin",
        };
        console.log("✅ User with role:", { uid: decoded.uid, email: decoded.email, role: userData.role });
        return userWithRole;
      }
    } catch (firestoreErr) {
      console.error("❌ Error fetching user document:", firestoreErr);
    }
    
    return decoded;
  } catch (err) {
    console.error("❌ Error verifying token:", err);
    return null;
  }
}

/**
 * Role check - returns true if user is admin
 */
export function requireAdmin(user) {
  const isAdmin = user?.role === "admin" || user?.admin === true;
  if (!isAdmin) {
    console.log("❌ Access denied - User is not admin. Role:", user?.role, "Admin:", user?.admin);
  }
  return isAdmin;
}