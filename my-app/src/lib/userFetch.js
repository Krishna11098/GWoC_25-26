import { auth } from "@/lib/firebaseClient";

export async function userFetch(url, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken(true);

  // Prepare headers
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  // Only set Content-Type for non-FormData requests
  // FormData sets its own Content-Type with the boundary
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
