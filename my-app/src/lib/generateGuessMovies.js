import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./firebaseAdmin.js";

const GUESS_MOVIES = [
  {
    clueType: "emoji",
    clueData: "🧑‍🚀🚀🌌⏳",
    answer: "Interstellar",
    category: "Hollywood",
    difficulty: "medium",
    hints: ["Space", "Time dilation", "Christopher Nolan"],
    coins: 30,
  },
  {
    clueType: "dialogue",
    clueData: "Why so serious?",
    answer: "The Dark Knight",
    category: "Hollywood",
    difficulty: "easy",
    hints: ["Joker", "Batman", "DC"],
    coins: 20,
  },
  {
    clueType: "emoji",
    clueData: "🦁👑🌍",
    answer: "The Lion King",
    category: "Hollywood",
    difficulty: "easy",
    hints: ["Disney", "Animal kingdom", "Circle of life"],
    coins: 20,
  },
  {
    clueType: "emoji",
    clueData: "🧙‍♂️💍🔥",
    answer: "The Lord of the Rings",
    category: "Hollywood",
    difficulty: "medium",
    hints: ["Middle Earth", "Ring", "Frodo"],
    coins: 30,
  },
  {
    clueType: "dialogue",
    clueData: "I'll be back.",
    answer: "The Terminator",
    category: "Hollywood",
    difficulty: "easy",
    hints: ["Arnold", "Time travel", "Robot"],
    coins: 20,
  },

  // 🎥 Bollywood
  {
    clueType: "dialogue",
    clueData: "Kitne aadmi the?",
    answer: "Sholay",
    category: "Bollywood",
    difficulty: "easy",
    hints: ["Gabbar", "Thakur", "Classic"],
    coins: 20,
  },
  {
    clueType: "emoji",
    clueData: "🏫📚🤝",
    answer: "3 Idiots",
    category: "Bollywood",
    difficulty: "easy",
    hints: ["Engineering", "Friendship", "Aamir Khan"],
    coins: 20,
  },
  {
    clueType: "emoji",
    clueData: "🚆❤️💔",
    answer: "Dil Se",
    category: "Bollywood",
    difficulty: "medium",
    hints: ["SRK", "Train song", "Manisha Koirala"],
    coins: 30,
  },
  {
    clueType: "dialogue",
    clueData: "Bade bade deshon mein aisi chhoti chhoti baatein hoti rehti hain.",
    answer: "Dilwale Dulhania Le Jayenge",
    category: "Bollywood",
    difficulty: "medium",
    hints: ["SRK", "Europe", "Romance"],
    coins: 30,
  },
  {
    clueType: "emoji",
    clueData: "🎤🎶🌟",
    answer: "Rockstar",
    category: "Bollywood",
    difficulty: "medium",
    hints: ["Ranbir Kapoor", "Music", "Jordan"],
    coins: 30,
  },

  // 🎬 South Indian
  {
    clueType: "emoji",
    clueData: "🏹👑⚔️",
    answer: "Baahubali",
    category: "South Indian",
    difficulty: "easy",
    hints: ["Mahishmati", "SS Rajamouli", "Epic"],
    coins: 20,
  },
  {
    clueType: "emoji",
    clueData: "🕶️🤖🔥",
    answer: "Enthiran",
    category: "South Indian",
    difficulty: "medium",
    hints: ["Rajinikanth", "Robot", "Sci-fi"],
    coins: 30,
  },
  {
    clueType: "dialogue",
    clueData: "Naan oru thadava sonna, nooru thadava sonna madhiri.",
    answer: "Baasha",
    category: "South Indian",
    difficulty: "hard",
    hints: ["Rajinikanth", "Gangster", "Classic"],
    coins: 40,
  },

  // 🎞️ Animation / Kids
  {
    clueType: "emoji",
    clueData: "🐼🥋",
    answer: "Kung Fu Panda",
    category: "Kids",
    difficulty: "easy",
    hints: ["Po", "Martial arts", "DreamWorks"],
    coins: 20,
  },
  {
    clueType: "emoji",
    clueData: "❄️👭🎶",
    answer: "Frozen",
    category: "Kids",
    difficulty: "easy",
    hints: ["Elsa", "Anna", "Let It Go"],
    coins: 20,
  },

  // 🎥 Mixed / Cult
  {
    clueType: "emoji",
    clueData: "🧠💊🔵🔴",
    answer: "The Matrix",
    category: "Hollywood",
    difficulty: "medium",
    hints: ["Neo", "Simulation", "Red pill"],
    coins: 30,
  },
  {
    clueType: "dialogue",
    clueData: "You don't choose the thug life. The thug life chooses you.",
    answer: "Scarface",
    category: "Hollywood",
    difficulty: "hard",
    hints: ["Gangster", "Al Pacino", "Miami"],
    coins: 40,
  },
  {
    clueType: "emoji",
    clueData: "🚢❤️🌊",
    answer: "Titanic",
    category: "Hollywood",
    difficulty: "easy",
    hints: ["Jack", "Rose", "Ship"],
    coins: 20,
  },
  {
    clueType: "emoji",
    clueData: "🧔🪓❄️",
    answer: "The Revenant",
    category: "Hollywood",
    difficulty: "hard",
    hints: ["Leonardo DiCaprio", "Survival", "Bear"],
    coins: 40,
  },

  // Remaining to make 30
  {
    clueType: "emoji",
    clueData: "🎭🔪",
    answer: "Joker",
    category: "Hollywood",
    difficulty: "medium",
    hints: ["Arthur Fleck", "Mental health", "DC"],
    coins: 30,
  },
  {
    clueType: "emoji",
    clueData: "🕵️‍♂️🧩",
    answer: "Sherlock Holmes",
    category: "Hollywood",
    difficulty: "medium",
    hints: ["Detective", "London", "Mystery"],
    coins: 30,
  },
  {
    clueType: "emoji",
    clueData: "🏍️🔥",
    answer: "Dhoom",
    category: "Bollywood",
    difficulty: "easy",
    hints: ["Bikes", "Heist", "YRF"],
    coins: 20,
  },
  {
    clueType: "emoji",
    clueData: "🕰️🧔‍♂️🎩",
    answer: "PK",
    category: "Bollywood",
    difficulty: "medium",
    hints: ["Aamir Khan", "Alien", "Satire"],
    coins: 30,
  },
  {
    clueType: "emoji",
    clueData: "👨‍👩‍👧‍👦🏠",
    answer: "Kabhi Khushi Kabhie Gham",
    category: "Bollywood",
    difficulty: "medium",
    hints: ["Family", "SRK", "Karan Johar"],
    coins: 30,
  },
  {
    clueType: "emoji",
    clueData: "⚡🧙‍♂️🏰",
    answer: "Harry Potter",
    category: "Hollywood",
    difficulty: "easy",
    hints: ["Wizard", "Hogwarts", "Magic"],
    coins: 20,
  },
];

async function generateGuessMovies() {
  let batch = db.batch();
  let ops = 0;

  for (let i = 0; i < GUESS_MOVIES.length; i++) {
    const movie = GUESS_MOVIES[i];
    const ref = db.collection("guess_movies").doc();

    batch.set(ref, {
      movieNo: i + 1,
      clueType: movie.clueType,
      clueData: movie.clueData,
      answer: movie.answer,
      category: movie.category,
      difficulty: movie.difficulty,
      hints: movie.hints,
      coins: movie.coins,
      isVisibleToUser: false, // admin toggle
      createdAt: new Date(),
    });

    ops++;

    if (ops === 400) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }

  if (ops > 0) {
    await batch.commit();
  }

  console.log("✅ Guess the Movie games generated successfully");
  console.log(`🎬 Total movies added: ${GUESS_MOVIES.length}`);
}

generateGuessMovies()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error generating Guess the Movie data:", err);
    process.exit(1);
  });
