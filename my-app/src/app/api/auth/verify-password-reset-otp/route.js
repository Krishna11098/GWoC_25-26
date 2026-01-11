import { db, auth as adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    console.log("=== Password Reset Request ===");
    console.log("Email:", email);
    console.log("OTP received:", otp, "Type:", typeof otp);
    console.log(
      "New password length:",
      newPassword ? newPassword.length : "not provided"
    );

    // Validate input
    if (!email || !otp) {
      console.warn("Missing email or Otp");
      return Response.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Validate password if provided (for reset operation)
    if (newPassword && newPassword.length < 6) {
      console.warn("Password too short");
      return Response.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Get OTP from database
    console.log("Fetching OTP for email:", email);
    const otpRef = db.collection("password_reset_otp").doc(email);
    const otpDoc = await otpRef.get();

    if (!otpDoc.exists) {
      console.warn("OTP not found in database for email:", email);
      return Response.json(
        { error: "OTP not found. Please request a new one." },
        { status: 400 }
      );
    }

    const otpData = otpDoc.data();
    console.log("OTP from DB:", otpData.otp, "Type:", typeof otpData.otp);
    console.log("OTP expires at:", new Date(otpData.expiryTime).toISOString());
    console.log("Current time:", new Date(Date.now()).toISOString());

    // Check if OTP has expired
    if (Date.now() > otpData.expiryTime) {
      console.warn("OTP has expired");
      await otpRef.delete();
      return Response.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Check if OTP matches
    const otpString = otp.toString().trim();
    const dbOtpString = otpData.otp.toString().trim();
    console.log("Comparing OTPs:");
    console.log("  Input OTP:", otpString);
    console.log("  DB OTP:", dbOtpString);
    console.log("  Match:", otpString === dbOtpString);

    if (dbOtpString !== otpString) {
      console.warn("OTP mismatch");
      return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    console.log("OTP verified successfully");

    // Find user by email
    console.log("Looking up user with email:", email);
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef.where("email", "==", email).get();

    console.log("User lookup result - Found:", userSnapshot.size, "users");

    if (userSnapshot.empty) {
      console.warn("User not found with email:", email);
      return Response.json({ error: "User not found" }, { status: 400 });
    }

    const userDoc = userSnapshot.docs[0];
    const uid = userDoc.id;
    console.log("Found user with UID:", uid);

    // If password is provided, update it
    if (newPassword) {
      try {
        console.log(`Attempting to update password for user ${uid}`);
        await adminAuth.updateUser(uid, { password: newPassword });
        console.log(`Password updated successfully for user ${uid}`);

        // Delete OTP only after successful password update
        try {
          await otpRef.delete();
          console.log(`OTP deleted for email: ${email}`);
        } catch (deleteError) {
          console.error("Error deleting OTP:", deleteError);
          // Don't fail the response if OTP deletion fails
        }
      } catch (updateError) {
        console.error("Error updating password:", updateError.message);
        // Don't delete OTP if password update fails
        return Response.json(
          {
            error: "Failed to update password",
            details: updateError.message,
            code: updateError.code,
          },
          { status: 500 }
        );
      }
    }
    // If password is NOT provided, just verify OTP (don't delete it yet)
    else {
      console.log("OTP verified - waiting for password reset");
    }

    return Response.json({
      success: true,
      message: newPassword
        ? "Password reset successfully"
        : "OTP verified successfully",
      uid: uid,
    });
  } catch (error) {
    console.error("Unexpected error in password reset:", error);
    return Response.json(
      {
        error: "Failed to process request",
        details: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
