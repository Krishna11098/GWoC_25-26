import { db } from "@/lib/firebaseAdmin";

const dummyProducts = [
  {
    id: "buzzed",
    name: "Buzzed – The Drinking Card Game",
    category: "Party & Drinking Games",
    description: "Keep the party buzzing with Buzzed, the ultimate drinking card game by Joy Juncture!",
    longDescription: "Whether it's a house party, a pre-game warmup, a post-game chill session, or a full-blown club night, Buzzed brings people together with effortless fun.\n\nDesigned for adults, by adults, this card game works for every kind of party person... early birds, night owls, social butterflies, silent observers, front-benchers, and full-time back-bench comedians.\n\nWith quirky, chaotic, senseless, and wildly funny prompts, Buzzed guarantees non-stop laughter, unforgettable memories, and stories you'll discuss the next morning (if you remember them 👀).\n\nJust shuffle → sip → survive!!",
    regularPrice: 599.00,
    price: 299.00,
    stockAvailable: 50,
    numberOfPlayers: "3-20",
    ageGroup: "21+",
    coinsReward: 3,
    isFeatured: true,
    keyFeatures: [
      {
        title: "Super Easy to Play",
        description: "No setup, no rules to memorise. Just open, shuffle, and sip"
      },
      {
        title: "Perfect for All Social Settings",
        description: "House parties, picnics, weekend getaways, birthdays, club nights, or awkward reunion dinners"
      },
      {
        title: "Inclusive & Multiplayer",
        description: "Works for all adults, any group size, and every vibe"
      },
      {
        title: "Made in India",
        description: "Thoughtfully designed and produced by Joy Juncture"
      },
      {
        title: "Pocket-Friendly Size",
        description: "Toss it in your bag and take the party anywhere"
      }
    ]
  },
  {
    id: "dead-mans-deck",
    name: "Dead Man's Deck",
    category: "Strategy Card Game",
    description: "Strategy meets memory — zombie-themed thrills.",
    longDescription:
      "Meet Dead Man’s Deck, the card game that combines strategy, memory, and a chilling zombie theme to keep you on your toes!\n\nWith every flip of the card, you’re one step closer to survival… or succumbing to the undead.\n\nWant to turn up the party? Dead Man’s Deck easily transforms into a zombie-themed drinking game.",
    regularPrice: 799.0,
    price: 399.0,
    stockAvailable: 30,
    numberOfPlayers: "2-8",
    averagePlaytime: "15 min",
    ageGroup: "14+",
    coinsReward: 4,
    isFeatured: false,
    keyFeatures: [
      {
        title: "Dual Gameplay",
        description:
          "A thrilling strategy game that doubles as a party drinking game with optional Challenge Cards. Perfect for both intense game nights and lighthearted gatherings.",
      },
      {
        title: "Fast-Paced Speed",
        description:
          "Timing is key—beat your opponents to discard Phase and Power Cards or risk being stuck with them!",
      },
      {
        title: "Epic Showdown Ending",
        description:
          "Either discard all your cards first or declare \"NO MORE A ZOMBIE!\" and reveal your hand to claim the win. But watch out—if you’re wrong, double penalties await.",
      },
      {
        title: "Zombie Memory Showdown",
        description:
          "Challenge your memory as you keep track of Phase and Power Cards, adding a level of skill that’s unique among party games.",
      },
    ],
  },
  {
    id: "court-52",
    name: "Court 52 Pickleball Card Game",
    category: "Pickleball Card Game",
    description: "Strategic rally-based pickleball card game with evolving 2v2 team play.",
    longDescription:
      "Court 52 brings the thrill of pickleball to your table with a tactical 2v2 card game where momentum matters. Every three rally points trigger fresh effects, forcing teams to rethink their strategy, time their plays, and adapt on the fly. With a full 52-card deck of Challenge, Trap, and Wild cards, every match feels fast, competitive, and replayable.",
    regularPrice: 499.0,
    price: 459.0,
    stockAvailable: 40,
    numberOfPlayers: "2-4 (2v2 teams)",
    ageGroup: "Adult",
    coinsReward: 3,
    isFeatured: true,
    keyFeatures: [
      {
        title: "Strategic 2v2 Rally Play",
        description: "Innovative card-based pickleball experience where team tactics shine and effects refresh every three rally points.",
      },
      {
        title: "52-Card Arsenal",
        description: "Complete deck with Challenge, Trap, and Wild cards featuring unique spiral powers to shake up each point.",
      },
      {
        title: "Momentum Management",
        description: "Plan ahead to control the next three rounds—timing your moves decides whether you seize or lose momentum.",
      },
      {
        title: "Quick, Dynamic Matches",
        description: "Designed for fast-paced play so every rally counts and no two games feel the same.",
      },
      {
        title: "Ready-to-Play Kit",
        description: "Includes all 52 custom gameplay cards plus a comprehensive rule guide for casual or competitive sessions.",
      },
      {
        title: "Active Court Strategy",
        description: "Predict opponents, adjust your cards, and make smart choices to win every tactical exchange.",
      },
    ],
  },
  {
    id: "judge-me-guess",
    name: "Judge Me & Guess",
    category: "Community Card Game",
    description: "A social experience that turns strangers into friends.",
    longDescription: "Judge Me & Guess isn't just a card game... it's a social experience made for every community, every group, and every table.\n\nFrom caf\u00e9s and clubs to office teams, friend circles, student groups, and Sunday brunch communities… this game adapts to your vibe and your rules.\n\nWhether you're meeting a stranger, sitting with your date, or catching up with friends, this game replaces awkward silence with curious guesses, bold judgments, and surprisingly accurate truths!!",
    regularPrice: 1499.0,
    price: 999.0,
    stockAvailable: 40,
    numberOfPlayers: "2-10+",
    ageGroup: "16+",
    coinsReward: 3,
    isFeatured: true,
    keyFeatures: [
      {
        title: "Creates Real Connection",
        description: "Encourages genuine conversations & laughter. Turns strangers into friends within minutes. Works for shy players, loud players, new groups, and mixed groups.",
      },
      {
        title: "3 Judgment Levels",
        description: "Every card comes with a signature eye illustration and is divided into 3 levels... from light warm-up to bold & deeper questions as the game progresses.",
      },
      {
        title: "Play Your Way",
        description: "No complicated rules, easy for anyone to join mid-game. Customise how you play... points, punishments, storytelling, anything. Perfect for caf\u00e9 tables, offices, hostels, team off-sites, brunch clubs.",
      },
      {
        title: "Perfect For Every Community",
        description: "Friends & siblings, first dates, caf\u00e9 customers, college students, office teams, family gatherings, social communities & clubs. Bulk customisations available (MOQ 25).",
      },
    ],
  },
  {
    id: "mehfil",
    name: "Mehfil – The Ultimate Musical Card Game",
    category: "Musical Card Game",
    description: "A singing challenge card game for every gathering.",
    longDescription: "Turn any gathering into a full-blown musical night! Mehfil by Joy Juncture is a super fun, super simple singing challenge card game where your voice (good or bad!) becomes the star of the evening.\n\n1 player or 99+ players\n\nMehfil never stops. Perfect for family nights, house parties, weddings, picnics, long drives, office breaks, hostel hangouts, or that one cousin who refuses to stop singing.",
    regularPrice: 799.0,
    price: 399.0,
    stockAvailable: 25,
    numberOfPlayers: "1-99+",
    ageGroup: "12+",
    coinsReward: 5,
    isFeatured: false,
    keyFeatures: [
      {
        title: "Musical Categories",
        description: "Includes four exciting categories - Word Play, Situationship, Jodi Jukebox, and Mic Drop - each offering unique Bollywood music challenges.",
      },
      {
        title: "Play With Anyone, Anywhere",
        description: "1 player or 99+ players; Mehfil never stops. Perfect for family nights, house parties, weddings, picnics, long drives, office breaks, hostel hangouts.",
      },
      {
        title: "Portable Design",
        description: "Comes in a compact, fabric pouch for easy storage and transport, allowing you to carry the fun wherever you go.",
      },
      {
        title: "Party Essential",
        description: "Ideal for house parties, game nights, travel, and family gatherings, bringing musical entertainment to any social occasion.",
      },
    ],
  },
  {
    id: "one-more-round",
    name: "One More Round | Jigsaw Puzzle",
    category: "Jigsaw Puzzle",
    description: "A 150-piece adult puzzle that feels like game night in a box.",
    longDescription: "One More Round – A 150-Piece Jigsaw Puzzle for Adults That Feels Like Game Night in a Box.\n\nLooking for a jigsaw puzzle that's more than just a pretty picture? One More Round is your official invite to game night with friends, beers, and a bit of playful chaos. This 150-piece puzzle drops you right into a buzzing table full of laughter, clinking glasses, and half-played card games. It's the kind of scene you wish you were part of... now you can piece it together, one moment at a time.\n\nDesigned for puzzle lovers who appreciate fun, storytelling, and strong visual detail, this hand-illustrated adult puzzle celebrates the art of chilling out. From spilled drinks to cheeky expressions, every detail adds to the story and the challenge.",
    regularPrice: 649.0,
    price: 499.0,
    stockAvailable: 35,
    numberOfPlayers: "1-4+",
    ageGroup: "18+",
    coinsReward: 3,
    isFeatured: false,
    keyFeatures: [
      {
        title: "Hand-Illustrated Design",
        description: "A beautifully hand-illustrated adult puzzle that celebrates the art of chilling out and storytelling.",
      },
      {
        title: "Game Night in a Box",
        description: "Drops you right into a buzzing table full of laughter, clinking glasses, and half-played card games with intricate visual details.",
      },
      {
        title: "150 Pieces of Fun",
        description: "Perfect for puzzle lovers who appreciate challenges, from spilled drinks to cheeky expressions, every detail adds to the story.",
      },
      {
        title: "Ideal for Adults",
        description: "A relaxing and engaging activity for game night enthusiasts, perfect for solo sessions or group puzzle nights.",
      },
    ],
  },
  {
    id: "tamasha",
    name: "Tamasha – The Bollywood Bid Card Game",
    category: "Bollywood Card Game",
    description: "Filmy drama meets competitive bidding.",
    longDescription: "Tamasha blends filmy drama, acting talent, iconic dance steps and competitive bidding into one laugh-out-loud party game. Perfect for families, friends, and anyone who loves Bollywood.\n\nPLAY WITH ANYONE, ANYWHERE – LITERALLY!\n\n1 player or 99+ players; Tamasha never stops. Perfect for family nights, house parties, weddings, picnics, long drives, office breaks, hostel hangouts, or that one cousin who refuses to stop being bollywood.",
    regularPrice: 799.0,
    price: 399.0,
    stockAvailable: 30,
    numberOfPlayers: "1-99+",
    ageGroup: "12+",
    coinsReward: 4,
    isFeatured: true,
    keyFeatures: [
      {
        title: "Play With Anyone, Anywhere",
        description: "1 player or 99+ players; Tamasha never stops. Perfect for family nights, house parties, weddings, picnics, long drives, office breaks, hostel hangouts.",
      },
      {
        title: "Portable Design",
        description: "Comes in a compact, fabric pouch for easy storage and transport, allowing you to carry the fun wherever you go.",
      },
      {
        title: "Perfect Gift for Every Occasion",
        description: "A guaranteed hit for birthdays, Diwali gifting, family game night hampers, sangeet nights, bachelorettes, and every bollywood lover in your life.",
      },
      {
        title: "Filmy Drama & Bidding",
        description: "Blends acting talent, iconic dance steps, and competitive bidding into one laugh-out-loud party game.",
      },
    ],
  },
  {
    id: "the-bloody-inheritance",
    name: "The Bloody Inheritance | Murder Mystery Case File",
    category: "Murder Mystery Game",
    description: "A hands-on detective mystery with realistic evidence.",
    longDescription: "Step inside a story that feels straight out of a crime thriller!!\n\nThe Bloody Inheritance is a hands-on murder mystery case file where you become the detective. Created by JJ's game designers, this experience is packed with realistic evidence, gripping storytelling, and the kind of twists that keep you thinking long after the game ends!!\n\nThis isn't your usual \"solve-the-puzzle\" game. It feels like opening a real cold case... armed with files, photos, reports, letters, clues, and odd fragments of someone's life. Every piece leads you closer to the truth… if you read between the lines!",
    regularPrice: 1999.0,
    price: 999.0,
    stockAvailable: 20,
    numberOfPlayers: "1-5",
    ageGroup: "16+",
    coinsReward: 6,
    isFeatured: false,
    keyFeatures: [
      {
        title: "Immersive Detective Experience",
        description: "Feels like you're inside a movie. Work through realistic evidence, handwritten notes, photographs, reports, puzzles, and objects to crack the case.",
      },
      {
        title: "Perfect for Any Occasion",
        description: "House parties, game nights with friends, corporate team-building, couples looking for something different, or hosting a detective-themed party.",
      },
      {
        title: "Sharpens Critical Skills",
        description: "Enhances deduction, teamwork, and smart decision-making. Every clue matters—nothing is random.",
      },
      {
        title: "Low Prep, High Engagement",
        description: "A totally fresh kind of game night experience. Best played in teams of 3, playable by 1–5 players. The fastest team to solve it wins bragging rights and eternal detective glory.",
      },
    ],
  },
];

export async function POST() {
  try {
    if (!db) {
      return Response.json({ error: "Server missing Firebase credentials" }, { status: 500 });
    }

    const batch = db.batch();
    dummyProducts.forEach((p) => {
      const ref = db.collection("products").doc(p.id);
      batch.set(ref, p, { merge: true });
    });
    await batch.commit();

    return Response.json({ success: true, count: dummyProducts.length }, { status: 200 });
  } catch (err) {
    console.error("Seed error:", err);
    return Response.json({ error: "Failed to seed products" }, { status: 500 });
  }
}
