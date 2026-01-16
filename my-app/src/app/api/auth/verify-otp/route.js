import { db } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    // Validate input
    if (!email || !otp) {
      return Response.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Get OTP from database
    const otpRef = db.collection("pending_otp").doc(email);
    const otpDoc = await otpRef.get();

    if (!otpDoc.exists) {
      return Response.json(
        { error: "OTP not found. Please request a new OTP." },
        { status: 400 }
      );
    }

    const otpData = otpDoc.data();

    // Check if OTP has expired
    if (Date.now() > otpData.expiryTime) {
      await otpRef.delete();
      return Response.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Check if OTP matches
    if (otpData.otp !== otp) {
      return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // OTP is valid, delete it
    await otpRef.delete();

    return Response.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return Response.json(
      { error: "Failed to verify OTP", details: error.message },
      { status: 500 }
    );
  }
}
