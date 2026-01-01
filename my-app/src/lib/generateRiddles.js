import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./firebaseAdmin.js";

const RIDDLES = [
  {
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    solution: "Echo",
    coins: 20,
  },
  {
    question: "The more you take, the more you leave behind. What are they?",
    solution: "Footsteps",
    coins: 20,
  },
  {
    question: "I'm tall when I'm young, and short when I'm old. What am I?",
    solution: "Candle",
    coins: 20,
  },
  {
    question: "What has many keys but can't open a single lock?",
    solution: "Piano",
    coins: 20,
  },
  {
    question: "I can fly without wings, cry without eyes. Wherever I go, darkness flies. What am I?",
    solution: "Cloud",
    coins: 20,
  },
  {
    question: "What gets wetter the more it dries?",
    solution: "Towel",
    coins: 20,
  },
  {
    question: "I have branches, but no fruit, trunk, or leaves. What am I?",
    solution: "Bank",
    coins: 20,
  },
  {
    question: "You can catch it, but you can't throw it. What is it?",
    solution: "Cold",
    coins: 20,
  },
  {
    question: "What has a head, a tail, but no body?",
    solution: "Coin",
    coins: 20,
  },
  {
    question: "I go up but never come down. What am I?",
    solution: "Age",
    coins: 20,
  },
];

async function generateRiddles() {
  let batch = db.batch();
  let ops = 0;

  for (let i = 0; i < RIDDLES.length; i++) {
    const riddle = RIDDLES[i];
    const ref = db.collection("riddles").doc();

    batch.set(ref, {
      riddleNo: i + 1,
      question: riddle.question,
      solution: riddle.solution,
      coins: riddle.coins,
      isVisibleToUser: false, // admin will toggle later
      createdAt: new Date(),
    });

    ops++;

    // Firestore batch limit safety (500 max, but keeping buffer)
    if (ops === 400) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }

  if (ops > 0) {
    await batch.commit();
  }

  console.log("✅ Riddles generated successfully");
  console.log(`📊 Total riddles added: ${RIDDLES.length}`);
}

generateRiddles()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error generating riddles:", err);
    process.exit(1);
  });
