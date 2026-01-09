/* =========================================================
   ENUMS (single source of truth)
========================================================= */

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const COIN_ACTIONS = {
  PURCHASE: "purchase",
  EVENT_ATTENDED: "event_attended",
  WORKSHOP_ATTENDED: "workshop_attended",
  GAME_PLAYED: "game_played",
  REDEEMED: "redeemed",
};

export const EVENT_TYPES = {
  GAME_NIGHT: "game_night",
  COMMUNITY_EVENT: "community_event",
  CORPORATE: "corporate",
  CUSTOM: "custom",
};

export const EVENT_STATUS = {
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const MODE = {
  ONLINE: "online",
  OFFLINE: "offline",
};

export const PRODUCT_CATEGORY = {
  BOARD_GAME: "board_game",
  CARD_GAME: "card_game",
  CUSTOM_DECK: "custom_deck",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
};

export const ORDER_STATUS = {
  PLACED: "placed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const ENQUIRY_STATUS = {
  PENDING: "pending",
  CONTACTED: "contacted",
  CONVERTED: "converted",
  REJECTED: "rejected",
};

export const BLOG_CATEGORY = {
  GAMES: "games",
  EVENTS: "events",
  COMMUNITY: "community",
  STORYTELLING: "storytelling",
};

export const EXPERIENCE_TYPE = {
  WEDDING: "wedding",
  CORPORATE: "corporate",
  PRIVATE_PARTY: "private_party",
  COMMUNITY: "community",
};

export function publishBlog(blog) {
  blog.isPublished = true;
  blog.publishedAt = now();
  blog.updatedAt = now();
  return blog;
}

export function updateCart(cart, items) {
  return {
    items,
    lastUpdated: now(),
  };
}

export function createRegisteredUser({ userId }) {
  assertRequired(userId, "userId");

  return {
    userId,
    registeredAt: now(),
    attended: false,
  };
}

export function createOrderItem({ productId, quantity, price }) {
  assertRequired(productId, "productId");
  if (quantity <= 0) throw new Error("Quantity must be positive");
  if (price < 0) throw new Error("Price cannot be negative");

  return {
    productId,
    quantity,
    price,
  };
}


/* =========================================================
   USER
========================================================= */

export function createUser(data) {
  return {
    role: data.role || USER_ROLES.USER,
    name: data.name || "",
    username: data.username || "",
    email: data.email || "",
    password: data.password || "", // hash before storing

    wallet: {
      coins: 0,
      coinsRedeemed: 0,
      coinHistory: [],
    },

    userEvents: [],
    userWorkshops: [],
    userOrders: [],

    onlineGamesPlayed: 0,
    isCommunityMember: false,

    corporateEnquiries: [],

    cart: {
      items: [],
      lastUpdated: new Date(),
    },

    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/* =========================================================
   WALLET HELPERS
========================================================= */

export function createCoinHistory({ action, coins, referenceId }) {
  return {
    action,
    coins,
    referenceId: referenceId || null,
    date: new Date(),
  };
}

/* =========================================================
   USER PARTICIPATION
========================================================= */

export function createUserEvent({ eventId, eventType, coinsEarned = 0 }) {
  return {
    eventId,
    eventType,
    registeredAt: new Date(),
    attended: false,
    coinsEarned,
  };
}

export function createUserWorkshop({ workshopId, coinsEarned = 0 }) {
  return {
    workshopId,
    registeredAt: new Date(),
    attended: false,
    coinsEarned,
  };
}

/* =========================================================
   CART
========================================================= */

export function createCartItem({ productId, quantity }) {
  return {
    productId,
    quantity,
    addedAt: new Date(),
  };
}

/* =========================================================
   ORDER
========================================================= */

export function createOrder({
  orderId,
  userId,
  products,
  totalAmount,
  coinsEarned = 0,
}) {
  return {
    orderId,
    userId,
    products, // [{ productId, quantity, price }]
    totalAmount,
    paymentStatus: PAYMENT_STATUS.PENDING,
    orderStatus: ORDER_STATUS.PLACED,
    coinsEarned,
    createdAt: new Date(),
  };
}

/* =========================================================
   EVENT
========================================================= */

/**
 * Creates an event object with booking tracking
 * 
 * bookedUsers field structure:
 * {
 *   userId: string,
 *   username: string,
 *   seatsBooked: number,
 *   paymentDate: Timestamp,
 *   amount: number (in rupees),
 *   bookingId: string
 * }
 */
export function createEvent(data) {
  return {
    eventId: data.eventId,
    title: data.title,
    description: data.description,
    eventType: data.eventType,
    mode: data.mode,
    location: data.location || "",
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    capacity: data.capacity,
    registeredUsers: [],
    hostedBy: data.hostedBy || "",
    coinsReward: data.coinsReward || 0,
    status: EVENT_STATUS.UPCOMING,
    bookedSeats: 0,
    bookedUsers: [], // Array of {userId, username, seatsBooked, paymentDate, amount, bookingId}
    createdAt: new Date(),
  };
}

/* =========================================================
   WORKSHOP
========================================================= */

export function createWorkshop(data) {
  return {
    workshopId: data.workshopId,
    title: data.title,
    description: data.description,
    topic: data.topic,
    mode: data.mode,
    location: data.location || "",
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    capacity: data.capacity,
    registeredUsers: [],
    coinsReward: data.coinsReward || 0,
    status: EVENT_STATUS.UPCOMING,
    createdAt: new Date(),
  };
}

/* =========================================================
   PRODUCT
========================================================= */

export function createProduct(data) {
  return {
    productId: data.productId,
    name: data.name,
    category: data.category,
    description: data.description,
    price: data.price,
    stockAvailable: data.stockAvailable,
    images: data.images || [],
    numberOfPlayers: data.numberOfPlayers || "",
    ageGroup: data.ageGroup || "",
    howToPlay: data.howToPlay || "",
    useCases: data.useCases || [],
    coinsReward: data.coinsReward || 0,
    isFeatured: false,
    createdAt: new Date(),
  };
}

/* =========================================================
   BLOG
========================================================= */

export function createBlog(data) {
  return {
    blogId: data.blogId,
    title: data.title,
    slug: generateSlug(data.title),
    content: data.content,
    author: data.author,
    category: data.category,
    coverImage: data.coverImage || "",
    isPublished: false,
    publishedAt: null,
    createdAt: new Date(),
  };
}

/* =========================================================
   EXPERIENCE
========================================================= */

export function createExperience(data) {
  return {
    experienceId: data.experienceId,
    title: data.title,
    experienceType: data.experienceType,
    description: data.description,
    location: data.location,
    images: data.images || [],
    highlights: data.highlights || [],
    clientName: data.clientName || "",
    date: data.date,
    createdAt: new Date(),
  };
}

/* =========================================================
   UTILS
========================================================= */

export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
