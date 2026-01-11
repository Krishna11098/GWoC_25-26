import nodemailer from "nodemailer";
import { db } from "@/lib/firebaseAdmin";

// Configure nodemailer with your email service
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

    // Validate email
    if (!email || !email.includes("@")) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Check if user already exists
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef.where("email", "==", email).get();

    if (!userSnapshot.empty) {
      return Response.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiryTime = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Store OTP in database (temporary collection)
    const otpRef = db.collection("pending_otp").doc(email);
    await otpRef.set({
      otp,
      expiryTime,
      createdAt: new Date(),
    });

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Your OTP for email verification is:</p>
          <h1 style="color: #007bff; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
          <p style="color: #666;">This OTP will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return Response.json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return Response.json(
      { error: "Failed to send OTP", details: error.message },
      { status: 500 }
    );
  }
}
