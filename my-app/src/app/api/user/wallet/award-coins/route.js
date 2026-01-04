import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  increment,
  serverTimestamp,
  getDoc,
  setDoc,
} from "firebase/firestore";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      eventId,
      seatsCount = 1,
      amountPaid = 0,
      action = "event_booking",
    } = body;

    if (!userId || !eventId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate coins
    const baseCoins = seatsCount * 100; // 100 coins per seat
    const bonusCoins = amountPaid > 0 ? Math.floor(amountPaid / 10) : 0; // 10 coins per ₹10
    const totalCoins = baseCoins + bonusCoins;

    // Create transaction record with regular timestamp
    const transaction = {
      eventId,
      seatsCount,
      amountPaid,
      coins: totalCoins,
      action,
      type: "earn",
      description: `Event booking reward (${seatsCount} seat${
        seatsCount !== 1 ? "s" : ""
      })`,
      createdAt: new Date().toISOString(), // Use regular Date, not serverTimestamp
      timestamp: Date.now(),
    };

    // Update user wallet in Firestore
    const userRef = doc(db, "users", userId);

    try {
      // First, check if user document exists
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // User exists, update with arrayUnion
        await updateDoc(userRef, {
          coins: increment(totalCoins),
          walletHistory: arrayUnion(transaction),
          updatedAt: serverTimestamp(), // serverTimestamp is OK here, outside arrayUnion
        });

        console.log(
          `✅ Awarded ${totalCoins} coins to existing user ${userId}`
        );
      } else {
        // User doesn't exist, create with initial data
        const userData = {
          userId,
          email: body.email || "",
          displayName: body.name || "",
          coins: totalCoins,
          walletHistory: [transaction],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(userRef, userData);
        console.log(`✅ Created new user ${userId} with ${totalCoins} coins`);
      }
    } catch (error) {
      console.error("Firestore error:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      coins: totalCoins,
      baseCoins,
      bonusCoins,
      message: "Coins awarded successfully",
      transaction,
    });
  } catch (error) {
    console.error("Award coins error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
