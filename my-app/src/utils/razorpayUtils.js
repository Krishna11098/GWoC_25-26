// /src/utils/razorpayUtils.js

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Check if script is already being loaded
    if (
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )
    ) {
      // Wait for script to load
      const checkLoaded = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(checkLoaded);
          resolve(true);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkLoaded);
        resolve(false);
      }, 5000);
      return;
    }

    // Create and load script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      console.log("✅ Razorpay script loaded successfully");
      resolve(true);
    };

    script.onerror = (error) => {
      console.error("❌ Failed to load Razorpay script:", error);
      reject(
        new Error(
          "Failed to load Razorpay. Please check your internet connection."
        )
      );
    };

    document.body.appendChild(script);
  });
};

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== "number") {
    amount = parseFloat(amount) || 0;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Create Razorpay order on backend
 */
export const createRazorpayOrder = async (amount, eventId, seatIds, userId) => {
  try {
    const response = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise
        currency: "INR",
        eventId,
        seatIds,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create order");
    }

    return data;
  } catch (error) {
    console.error("Create order error:", error);
    throw error;
  }
};

/**
 * Verify Razorpay payment
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error(`Payment verification failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Payment verification error:", error);
    throw error;
  }
};

/**
 * Create booking in database
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch("/api/bookings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error(`Booking failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Create booking error:", error);
    throw error;
  }
};

/**
 * Award coins to user
 */
export const awardCoins = async (
  userId,
  eventId,
  seatsCount,
  amountPaid = 0
) => {
  try {
    // Calculate coins
    const baseCoins = seatsCount * 100; // 100 coins per seat
    const bonusCoins = amountPaid > 0 ? Math.floor(amountPaid / 10) : 0; // 10 coins per ₹10
    const totalCoins = baseCoins + bonusCoins;

    const response = await fetch("/api/user/wallet/award-coins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        eventId,
        seatsCount,
        amountPaid,
        coins: totalCoins,
        action: "event_booking",
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Award coins error:", error);
    // Don't throw error, just log it
    return { success: false, error: error.message };
  }
};

/**
 * Check if Razorpay is available
 */
export const isRazorpayAvailable = () => {
  return typeof window !== "undefined" && window.Razorpay;
};

/**
 * Get user's Razorpay customer details
 */
export const getUserRazorpayDetails = () => {
  if (typeof window === "undefined") return null;

  // Try to get from localStorage
  try {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      return {
        name: userData.displayName || userData.name || "Customer",
        email: userData.email || "customer@example.com",
        contact: userData.phone || "9999999999",
      };
    }
  } catch (error) {
    console.error("Error getting user details:", error);
  }

  // Default fallback
  return {
    name: "Customer",
    email: "customer@example.com",
    contact: "9999999999",
  };
};

/**
 * Get Razorpay options
 */
export const getRazorpayOptions = (order, userDetails, eventTitle, seatIds) => {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "Event Booking System",
    description: `Booking for ${seatIds.length} seat(s) - ${eventTitle}`,
    order_id: order.id,
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.contact,
    },
    notes: {
      eventTitle,
      seats: seatIds.join(", "),
      userId: userDetails.email,
    },
    theme: {
      color: "#3B82F6",
    },
    modal: {
      ondismiss: () => {
        console.log("Payment modal dismissed by user");
      },
      escape: true,
      backdropclose: false,
    },
    handler: () => {
      // This will be overridden by the actual handler
    },
  };
};

/**
 * Handle payment success
 */
export const handlePaymentSuccess = async (response, bookingData) => {
  try {
    // Verify payment
    const verification = await verifyPayment({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      ...bookingData,
    });

    if (!verification.success) {
      throw new Error(verification.error || "Payment verification failed");
    }

    // Award coins
    const coinResult = await awardCoins(
      bookingData.userId,
      bookingData.eventId,
      bookingData.seatsCount,
      bookingData.amount
    );

    if (!coinResult.success) {
      console.warn("Failed to award coins:", coinResult.error);
    }

    return {
      success: true,
      bookingId: verification.bookingId,
      coins: coinResult.coins || bookingData.seatsCount * 100,
    };
  } catch (error) {
    console.error("Payment success handling error:", error);
    throw error;
  }
};

/**
 * Handle payment error
 */
export const handlePaymentError = (error) => {
  console.error("Payment error:", error);

  let errorMessage = "Payment failed. Please try again.";

  if (error.error) {
    // Razorpay error
    const razorpayError = error.error;
    switch (razorpayError.code) {
      case "BAD_REQUEST_ERROR":
        errorMessage = "Invalid payment details. Please check and try again.";
        break;
      case "PAYMENT_CANCELLED":
        errorMessage = "Payment was cancelled by you.";
        break;
      case "NETWORK_ERROR":
        errorMessage = "Network error. Please check your internet connection.";
        break;
      default:
        errorMessage = razorpayError.description || errorMessage;
    }
  } else if (error.message) {
    errorMessage = error.message;
  }

  return errorMessage;
};

/**
 * Check if event is free
 */
export const isFreeEvent = (price) => {
  return price === 0 || price === "0" || price === null || price === undefined;
};

/**
 * Generate booking ID
 */
export const generateBookingId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `BOOK-${timestamp}-${random}`;
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

/**
 * Format time for display
 */
export const formatTime = (timeString) => {
  if (!timeString) return "N/A";

  try {
    // Handle time strings like "14:30" or "2:30 PM"
    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);

      if (hour >= 12) {
        return `${hour > 12 ? hour - 12 : hour}:${minutes} PM`;
      } else {
        return `${hour === 0 ? 12 : hour}:${minutes} AM`;
      }
    }

    return timeString;
  } catch (error) {
    return timeString;
  }
};
