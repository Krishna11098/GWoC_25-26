// Format date
export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format time
export const formatTime = (timeString) => {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${ampm}`;
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Generate gradient class
export const getCategoryGradient = (category) => {
  const gradients = {
    workshop: "from-purple-500 to-pink-500",
    community: "from-blue-500 to-cyan-500",
    celebration: "from-orange-500 to-yellow-500",
    default: "from-gray-500 to-gray-700",
  };

  return gradients[category] || gradients.default;
};

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    workshop: "bg-purple-100 text-purple-800",
    community: "bg-blue-100 text-blue-800",
    celebration: "bg-orange-100 text-orange-800",
    default: "bg-gray-100 text-gray-800",
  };

  return colors[category] || colors.default;
};
