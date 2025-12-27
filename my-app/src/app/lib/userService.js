// src/app/lib/userService.js
import { db } from "@/app/lib/firebaseConfig";
import { collection, getDocs, getCountFromServer } from "firebase/firestore";

const userService = {
  // Get total number of users - OPTIMIZED VERSION
  async getTotalUsers() {
    try {
      const usersRef = collection(db, "users");

      // Method 1: Get count directly (more efficient)
      const snapshot = await getCountFromServer(usersRef);
      return snapshot.data().count;

      // OR Method 2: Get all docs and count (if you need user data too)
      // const snapshot = await getDocs(usersRef);
      // return snapshot.size;
    } catch (error) {
      console.error("Error counting users:", error);
      return 0;
    }
  },

  // Get all users with details
  async getAllUsers() {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  // Get active users count (if isActive field exists)
  async getActiveUsers() {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const users = snapshot.docs.map((doc) => doc.data());

      // Count users with isActive = true
      const activeCount = users.filter((user) => user.isActive === true).length;
      return activeCount;
    } catch (error) {
      console.error("Error counting active users:", error);
      return 0;
    }
  },
};

export default userService;
