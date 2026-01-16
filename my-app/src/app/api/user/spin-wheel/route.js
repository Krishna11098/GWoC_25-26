import { NextResponse } from "next/server";
import { db, admin } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

export async function POST(req) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Define rewards (5 parts)
        const rewards = [50, 100, 200, 500, 1000];

        // 2. Randomly select a reward
        const randomIndex = Math.floor(Math.random() * rewards.length);
        const rewardAmount = rewards[randomIndex];

        // 3. Update User Wallet
        const userRef = db.collection("users").doc(user.uid);

        const coinHistoryItem = {
            action: "spin_wheel_reward",
            coins: rewardAmount,
            date: new Date().toISOString(), // Use ISO string for consistency as per other parts
            // Or use admin.firestore.Timestamp.now() if that's the convention, 
            // but profile page seemed to handle ISO strings.
            // Let's stick to ISO or Timestamp. model.js uses new Date().
            // Let's use new Date() which Firestore Admin SDK converts to Timestamp usually.
            createdAt: new Date()
        };

        await userRef.update({
            "wallet.coins": admin.firestore.FieldValue.increment(rewardAmount),
            "wallet.coinHistory": admin.firestore.FieldValue.arrayUnion(coinHistoryItem),
            updatedAt: new Date()
        });

        return NextResponse.json({
            success: true,
            rewardIndex: randomIndex,
            rewardAmount: rewardAmount,
            message: `You won ${rewardAmount} coins!`
        });

    } catch (error) {
        console.error("Spin Wheel Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
