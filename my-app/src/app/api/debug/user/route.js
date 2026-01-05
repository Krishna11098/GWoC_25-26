import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

/**
 * Debug endpoint to check user document
 * GET /api/debug/user?userId=XXX
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: "userId or email is required" },
        { status: 400 }
      );
    }

    const result = {
      searchedBy: userId ? "userId" : "email",
      searchValue: userId || email,
      documentFound: false,
      documentData: null,
      allUsers: [],
    };

    // Try to get by document ID
    if (userId) {
      console.log("🔍 Searching by userId:", userId);
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        result.documentFound = true;
        result.documentData = { id: userDoc.id, ...userDoc.data() };
        console.log("✅ Found user by ID:", result.documentData);
      } else {
        console.log("❌ No document found with ID:", userId);
      }
    }

    // Try to search by email
    if (email || (!result.documentFound && userId)) {
      console.log("🔍 Searching by email:", email || "trying userId as email");
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email || userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          if (!result.documentFound) {
            result.documentFound = true;
            result.documentData = { id: doc.id, ...doc.data() };
            console.log("✅ Found user by email:", result.documentData);
          }
        });
      } else {
        console.log("❌ No document found with email:", email || userId);
      }
    }

    // Get all users (limited to 10 for debugging)
    try {
      const usersRef = collection(db, "users");
      const allUsersSnapshot = await getDocs(usersRef);
      
      allUsersSnapshot.forEach((doc) => {
        result.allUsers.push({
          id: doc.id,
          email: doc.data().email,
          displayName: doc.data().displayName,
          coins: doc.data().coins,
        });
      });
      
      console.log(`📊 Total users in database: ${result.allUsers.length}`);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }

    return NextResponse.json({
      success: true,
      ...result,
      message: result.documentFound 
        ? "User found!" 
        : "User not found. Check the userId or email.",
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
