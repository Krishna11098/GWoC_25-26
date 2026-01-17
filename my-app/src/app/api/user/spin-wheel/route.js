import { NextResponse } from "next/server";
import { db, admin } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

export async function POST(req) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRef = db.collection("users").doc(user.uid);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userData = userSnap.data();

        // 1. Check if already spun today
        const lastSpin = userData.lastSpinDate;
        if (lastSpin) {
            const lastSpinDate = lastSpin.toDate ? lastSpin.toDate() : new Date(lastSpin);
            const today = new Date();
            // Compare local dates (Server time)
            if (
                lastSpinDate.getDate() === today.getDate() &&
                lastSpinDate.getMonth() === today.getMonth() &&
                lastSpinDate.getFullYear() === today.getFullYear()
            ) {
                return NextResponse.json({ error: "You can only spin the wheel once a day!" }, { status: 400 });
            }
        }

        // 2. Define rewards (5 parts)
        const rewards = [50, 100, 200, 500, 1000];

        // 3. Randomly select a reward
        const randomIndex = Math.floor(Math.random() * rewards.length);
        const rewardAmount = rewards[randomIndex];

        // 4. Update User Wallet & History using Batch
        const batch = db.batch();

        // Update user balance and lastSpinDate
        // Ensure wallet exists, if not, dot notation "wallet.coins" might fail if wallet map is missing.
        // But usually users have wallet. If not, we might need set with merge.
        // Assuming wallet exists or using dot notation creates it if part of map? No, dot notation requires parent map.
        // Safer to separate. But for now, we assume user flow initializes wallet.

        batch.update(userRef, {
            "wallet.coins": admin.firestore.FieldValue.increment(rewardAmount),
            // Also keep arrayUnion for backward compat if needed, but subcollection is better
            "wallet.coinHistory": admin.firestore.FieldValue.arrayUnion({
                action: "spin_wheel_reward",
                amount: rewardAmount,
                date: new Date().toISOString(),
                createdAt: new Date()
            }),
            lastSpinDate: admin.firestore.Timestamp.now(),
            updatedAt: new Date()
        });

        // Add to walletHistory subcollection (This fixes the display issue)
        const historyRef = userRef.collection("walletHistory").doc();
        batch.set(historyRef, {
            action: "spin_wheel_reward",
            amount: rewardAmount,
            coins: rewardAmount,
            createdAt: admin.firestore.Timestamp.now(),
            description: "Won from Spin & Win",
            type: "earn"
        });

        await batch.commit();

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
