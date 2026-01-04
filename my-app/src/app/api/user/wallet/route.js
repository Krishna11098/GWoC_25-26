import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * GET /api/user/wallet
 * Get user's wallet information including coins balance and wallet history
 * Query params: userId
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json({
        success: true,
        wallet: {
          coins: 0,
          walletHistory: [],
        },
      });
    }

    const userData = userDoc.data();
    
    // Handle both wallet.coins and coins field for backward compatibility
    const coins = userData.wallet?.coins || userData.coins || 0;
    const walletHistory = userData.wallet?.coinHistory || userData.walletHistory || [];
    
    return NextResponse.json({
      success: true,
      wallet: {
        coins: coins,
        walletHistory: walletHistory,
      },
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
