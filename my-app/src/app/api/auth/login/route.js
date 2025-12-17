import { auth } from "@/lib/firebaseAdmin";

export async function POST(req) {
  const { token } = await req.json();

  const decoded = await auth.verifyIdToken(token);

  return Response.json({
    uid: decoded.uid,
    email: decoded.email,
  });
}
