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
    ],
    howToPlay: [
      {
        title: "Gather Your Crew & Grab Drinks",
        description: "Get 3-20 friends together and make sure everyone has their favorite drink ready.",
        emoji: "🍺"
      },
      {
        title: "Shuffle & Draw Cards",
        description: "Shuffle the deck and take turns drawing cards. Each card has a wild prompt or challenge.",
        emoji: "🎴"
      },
      {
        title: "Follow the Prompt",
        description: "Read the card aloud and follow the instructions. Some cards make you drink, some make others drink!",
        emoji: "🎯"
      },
      {
        title: "Repeat & Have Fun",
        description: "Keep playing until the laughs run out (or the drinks do). There's no winner—just great memories!",
        emoji: "🔄"
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
          "Challenge your memory as you keep track of Phase and Power Cards, adding a level of skill that's unique among party games.",
      },
    ],
    howToPlay: [
      {
        title: "Deal Cards & Set the Stage",
        description: "Each player gets dealt cards. Phase cards and Power cards create the zombie apocalypse vibe.",
        emoji: "🧟"
      },
      {
        title: "Discard Phase & Power Cards Fast",
        description: "Timing is everything! Beat your opponents to discard matching Phase and Power cards before they do.",
        emoji: "⚡"
      },
      {
        title: "Track Cards with Your Memory",
        description: "Remember what's been played. Your memory is your weapon in this zombie showdown.",
        emoji: "🧠"
      },
      {
        title: "Win by Declaring Freedom",
        description: "Discard all cards OR shout 'NO MORE A ZOMBIE!' and reveal your hand. Wrong call? Double penalty!",
        emoji: "🏆"
      }
    ]
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
    howToPlay: [
      {
        title: "Form Teams & Deal Cards",
        description: "Split into 2v2 teams and deal cards from the 52-card deck with Challenge, Trap, and Wild cards.",
        emoji: "🎴"
      },
      {
        title: "Play Cards During Rallies",
        description: "Each rally lasts 3 points. Play cards strategically to activate special effects and gain advantage.",
        emoji: "🎯"
      },
      {
        title: "Adapt & Capture Momentum",
        description: "Every 3 points, new card effects trigger! Adjust your strategy and time your best plays.",
        emoji: "⚡"
      },
      {
        title: "Win with Team Tactics",
        description: "Work with your partner to predict opponents' moves and dominate the court. First team to target score wins!",
        emoji: "🏆"
      }
    ]
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
    howToPlay: [
      {
        title: "Pick a Card & Read Aloud",
        description: "Draw a card and read the judgment or question. Each card has 3 levels—start light or go bold!",
        emoji: "👁️"
      },
      {
        title: "Make Your Guess",
        description: "Other players guess how you'd answer or what you'd choose. The game creates curiosity and laughter.",
        emoji: "🤔"
      },
      {
        title: "Reveal & Score",
        description: "Share your real answer! Score points for correct guesses or customize your own rules (punishments, storytelling, etc).",
        emoji: "💬"
      },
      {
        title: "Keep Going & Connect",
        description: "Play until everyone's had their turn. Perfect for breaking the ice or deepening friendships!",
        emoji: "🔄"
      }
    ]
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
    howToPlay: [
      {
        title: "Shuffle & Pick a Category",
        description: "Choose from Word Play, Situationship, Jodi Jukebox, or Mic Drop categories. Each has unique Bollywood challenges!",
        emoji: "🎵"
      },
      {
        title: "Draw a Card & Sing",
        description: "Read the prompt and sing! It could be matching lyrics, humming tunes, or performing iconic Bollywood songs.",
        emoji: "🎤"
      },
      {
        title: "Score Points or Just Have Fun",
        description: "Award points for correct songs, or skip scoring and just enjoy the musical chaos. Your rules, your mehfil!",
        emoji: "⭐"
      },
      {
        title: "Keep the Music Going",
        description: "Play until someone wins, or keep going forever! Works with 1 or 99+ players—the party never stops.",
        emoji: "🔄"
      }
    ]
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
    howToPlay: [
      {
        title: "Open the Box & Sort Pieces",
        description: "Unbox your 150-piece puzzle. Sort edge pieces and similar colors to make assembly easier.",
        emoji: "🧩"
      },
      {
        title: "Start with the Borders",
        description: "Build the frame first! Connect edge pieces to form the puzzle boundary and get a sense of the scene.",
        emoji: "🖼️"
      },
      {
        title: "Fill in the Game Night Scene",
        description: "Work on different sections—drinks, cards, expressions. Every piece reveals more of the party story!",
        emoji: "🎲"
      },
      {
        title: "Complete & Display",
        description: "Place the final piece and admire your work! Frame it or take a photo to celebrate your puzzle night win.",
        emoji: "🏆"
      }
    ]
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
    howToPlay: [
      {
        title: "Draw a Bollywood Challenge",
        description: "Pick a card with a Bollywood acting, dancing, or singing challenge. Get ready to unleash your filmy side!",
        emoji: "🎬"
      },
      {
        title: "Bid on Your Confidence",
        description: "How well can you perform? Bid based on your confidence! Higher bids mean bigger rewards (and risks!).",
        emoji: "💰"
      },
      {
        title: "Perform & Entertain",
        description: "Act out iconic scenes, perform dance steps, or sing Bollywood hits. Make it dramatic—this is Tamasha!",
        emoji: "💃"
      },
      {
        title: "Score & Repeat",
        description: "Earn points for successful performances. Keep playing until someone becomes the ultimate Bollywood champion!",
        emoji: "🏆"
      }
    ]
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
    howToPlay: [
      {
        title: "Open the Case File",
        description: "Unbox the murder mystery and spread out evidence—photos, letters, reports, notes, and mysterious objects.",
        emoji: "📁"
      },
      {
        title: "Examine Every Clue",
        description: "Study each piece of evidence carefully. Look for connections, inconsistencies, and hidden details. Nothing is random!",
        emoji: "🔍"
      },
      {
        title: "Discuss & Deduce as a Team",
        description: "Work together to piece the story together. Share theories, challenge assumptions, and narrow down suspects.",
        emoji: "🕵️"
      },
      {
        title: "Solve the Mystery",
        description: "Identify the murderer, motive, and method! The fastest team to crack the case wins eternal detective glory.",
        emoji: "🏆"
      }
    ]
  },
  {
    id: "dreamers-fair",
    name: "Dreamer's Fair | 36 PCS Silhouette Puzzle",
    category: "Jigsaw Puzzle",
    description: "A magical 36-piece silhouette puzzle featuring a fairy, unicorn, and enchanted forest.",
    longDescription: "Step into a world of wonder with Dreamer's Fair, a beautifully illustrated 36-piece silhouette puzzle by Djeco. This enchanting puzzle features a magical fairy with iridescent wings, a mystical unicorn, and a whimsical forest fair illuminated by fireflies and fairy lights.\n\nPerfect for young dreamers and puzzle enthusiasts, this silhouette puzzle comes in a stunning keepsake box that doubles as artwork. Each piece is crafted with precision, revealing a captivating scene that sparks imagination and creativity.\n\nIdeal for quiet afternoons, family bonding, or as a thoughtful gift for anyone who loves fantasy and art.",
    regularPrice: 899.0,
    price: 699.0,
    stockAvailable: 45,
    numberOfPlayers: "1-2",
    ageGroup: "4+",
    coinsReward: 4,
    isFeatured: true,
    keyFeatures: [
      {
        title: "Magical Silhouette Design",
        description: "Features a stunning fairy and unicorn scene with an enchanted forest fair, perfect for sparking imagination.",
      },
      {
        title: "36 Premium Pieces",
        description: "Just the right size for young puzzlers—challenging enough to engage, easy enough to complete and feel proud.",
      },
      {
        title: "Beautiful Keepsake Box",
        description: "Comes in an artistic box that can be displayed as decor. Perfect for gifting or keeping as a collectible.",
      },
      {
        title: "High-Quality Djeco Craftsmanship",
        description: "Made by renowned brand Djeco with precision-cut pieces, vibrant colors, and durable materials.",
      },
    ],
    howToPlay: [
      {
        title: "Open & Admire the Art",
        description: "Unbox the puzzle and take a moment to appreciate the magical illustration on the box cover.",
        emoji: "🎨"
      },
      {
        title: "Sort Edge Pieces First",
        description: "Separate the border pieces to build the frame. This helps define the puzzle shape early on.",
        emoji: "🧩"
      },
      {
        title: "Assemble the Fairy & Unicorn",
        description: "Focus on the colorful fairy wings and unicorn details. These vibrant areas make great starting points!",
        emoji: "🦄"
      },
      {
        title: "Complete & Display",
        description: "Place the final piece and enjoy your finished masterpiece! Frame it or keep it in the beautiful box.",
        emoji: "✨"
      }
    ]
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
