// src/app/lib/userService.js
import { auth, db } from "@/app/lib/firebaseConfig";
import {
  collection,
  getDocs,
  getCountFromServer,
  query,
  where,
  writeBatch,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

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

  // Get reports statistics
  async getReportsStats() {
    try {
      // Get total reports
      const reportsSnapshot = await getDocs(collection(db, "reports"));
      const totalReports = reportsSnapshot.size;

      // Get pending reports
      const pendingSnapshot = await getDocs(
        query(collection(db, "reports"), where("status", "==", "pending"))
      );
      const pendingReports = pendingSnapshot.size;

      // Get reported users count
      const experiencesSnapshot = await getDocs(collection(db, "experiences"));
      const userReportMap = new Map();

      reportsSnapshot.docs.forEach((report) => {
        const experience = experiencesSnapshot.docs.find(
          (doc) => doc.id === report.data().experienceId
        );
        if (experience) {
          const userId = experience.data().userId;
          if (userId) {
            userReportMap.set(userId, (userReportMap.get(userId) || 0) + 1);
          }
        }
      });

      const reportedUsers = userReportMap.size;

      // Get banned users count
      let bannedUsers = 0;
      try {
        const bannedSnapshot = await getDocs(collection(db, "bannedUsers"));
        bannedUsers = bannedSnapshot.size;
      } catch (error) {
        console.log("No bannedUsers collection yet");
      }

      return {
        total: totalReports,
        pending: pendingReports,
        reportedUsers,
        banned: bannedUsers,
      };
    } catch (error) {
      console.error("Error fetching reports stats:", error);
      return {
        total: 0,
        pending: 0,
        reportedUsers: 0,
        banned: 0,
      };
    }
  },

  // Get reported users list
  async getReportedUsers() {
    try {
      const users = [];

      // Get all experiences
      const experiencesSnapshot = await getDocs(collection(db, "experiences"));
      const reportsSnapshot = await getDocs(collection(db, "reports"));

      const userReportCount = new Map();
      const userExperiences = new Map();

      // Count reports per user
      reportsSnapshot.docs.forEach((report) => {
        const experience = experiencesSnapshot.docs.find(
          (doc) => doc.id === report.data().experienceId
        );
        if (experience) {
          const userId = experience.data().userId;
          if (userId) {
            const count = userReportCount.get(userId) || 0;
            userReportCount.set(userId, count + 1);

            if (!userExperiences.has(userId)) {
              userExperiences.set(userId, experience.data());
            }
          }
        }
      });

      // Create user objects
      userReportCount.forEach((count, userId) => {
        const userData = userExperiences.get(userId);
        users.push({
          id: userId,
          name: userData?.userName || "Anonymous",
          email: userData?.userEmail || "No email",
          reportCount: count,
          experienceCount: 1,
          lastActive: userData?.createdAt,
          isBanned: false,
        });
      });

      return users;
    } catch (error) {
      console.error("Error fetching reported users:", error);
      return [];
    }
  },

  // Ban/Unban user
  async banUser(userId, ban = true) {
    try {
      // Update all experiences by this user
      const experiencesSnapshot = await getDocs(
        query(collection(db, "experiences"), where("userId", "==", userId))
      );

      const batch = writeBatch(db);

      experiencesSnapshot.docs.forEach((doc) => {
        const experienceRef = doc.ref;
        batch.update(experienceRef, {
          isHidden: ban,
          hiddenAt: ban ? new Date() : null,
          hiddenReason: ban ? "User banned by admin" : null,
        });
      });

      await batch.commit();

      // Update bannedUsers collection
      if (ban) {
        await setDoc(doc(db, "bannedUsers", userId), {
          bannedAt: new Date(),
          bannedBy: auth.currentUser?.uid,
          reason: "Multiple reports",
        });
      } else {
        await deleteDoc(doc(db, "bannedUsers", userId));
      }

      return { success: true };
    } catch (error) {
      console.error("Error banning user:", error);
      return { success: false, error: error.message };
    }
  },
};

export default userService;
