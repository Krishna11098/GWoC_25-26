import { NextResponse } from "next/server";
import { db, admin } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

export async function POST(req) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { score } = await req.json();

        if (!score || typeof score !== "number" || score < 0) {
            return NextResponse.json({ error: "Invalid score" }, { status: 400 });
        }

        // Logic for coin reward: 1 Coin for every 10 points
        // Cap at reasonable amount per game to prevent abuse (e.g., max 500 coins per game)
        // 2048 points is roughly ~20,000 score usually. So 2000 coins? Maybe make it 100 points = 1 coin.
        // Let's go with Score / 20.
        // 2048 tile usually lands around 20k score -> 1000 coins. Fair.

        let coinsEarned = Math.floor(score / 20);
        if (coinsEarned < 1) coinsEarned = 1; // Minimum 1 coin for effort if score > 0
        if (coinsEarned > 2000) coinsEarned = 2000; // Cap

        const userRef = db.collection("users").doc(user.uid);

        const coinHistoryItem = {
            action: "game_reward_2048",
            coins: coinsEarned,
            details: `Score: ${score}`,
            date: new Date().toISOString(),
            createdAt: new Date()
        };

        await userRef.update({
            "wallet.coins": admin.firestore.FieldValue.increment(coinsEarned),
            "wallet.coinHistory": admin.firestore.FieldValue.arrayUnion(coinHistoryItem),
            "stats.2048_high_score": admin.firestore.FieldValue.increment(0) // Just to ensure stats object exists? Better to check max.
        });

        // Update high score separately if needed, simplified here
        const userDoc = await userRef.get();
        const currentHighScore = userDoc.data().stats?.["2048_high_score"] || 0;
        if (score > currentHighScore) {
            await userRef.update({
                "stats.2048_high_score": score
            });
        }

        return NextResponse.json({
            success: true,
            coinsEarned,
            message: `You earned ${coinsEarned} coins!`
        });

    } catch (error) {
        console.error("2048 Reward Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
