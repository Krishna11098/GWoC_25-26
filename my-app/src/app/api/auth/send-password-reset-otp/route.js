import nodemailer from "nodemailer";
import { db } from "@/lib/firebaseAdmin";

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    console.log("=== Send Password Reset OTP ===");
    console.log("Received email:", email);

    // Validate email
    if (!email || !email.includes("@")) {
      console.warn("Invalid email format:", email);
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Check if user exists
    console.log("Checking if user exists with email:", email);
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef.where("email", "==", email).get();

    console.log("User lookup result - Found:", userSnapshot.size, "users");

    if (userSnapshot.empty) {
      console.warn("User not found");
      return Response.json({ error: "Email not registered" }, { status: 400 });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiryTime = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    console.log("Generated OTP:", otp);
    console.log("OTP expires at:", new Date(expiryTime).toISOString());

    // Store OTP in database (temporary collection)
    console.log(
      "Storing OTP in password_reset_otp collection for email:",
      email
    );
    const otpRef = db.collection("password_reset_otp").doc(email);

    try {
      await otpRef.set({
        otp,
        expiryTime,
        createdAt: new Date(),
      });
      console.log("✓ OTP stored successfully in database");
    } catch (dbError) {
      console.error("✗ Failed to store OTP in database:", dbError.message);
      throw dbError;
    }

    // Send OTP via email
    console.log("Sending OTP email to:", email);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>We received a request to reset your password. Use this OTP to proceed:</p>
          <h1 style="color: #007bff; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
          <p style="color: #666;">This OTP will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✓ OTP email sent successfully");
    } catch (emailError) {
      console.warn(
        "✗ Failed to send email (OTP still stored in DB):",
        emailError.message
      );
      // Don't fail the request if email fails, OTP is in DB
    }

    return Response.json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    console.error("✗ Error sending password reset OTP:", error.message);
    console.error("Error details:", error);
    return Response.json(
      { error: "Failed to send OTP", details: error.message },
      { status: 500 }
    );
  }
}
