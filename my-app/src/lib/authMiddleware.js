import { auth as adminAuth } from "./firebaseAdmin";

/**
 * Verify Firebase ID token from Authorization header
 */
export async function getUserFromRequest(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded; // { uid, email, role?, ... }
  } catch (err) {
    return null;
  }
}

/**
 * Role check
 */
export function requireAdmin(user) {
  console.log(user?.role);
  return user?.admin === true || user?.role === "admin";
  
}
