"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function BanCheck({ children }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const checkIfBanned = async () => {
      if (user && !loading) {
        try {
          // Check if user is banned
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();

            // If user is banned, redirect to banned page
            if (userData.isBanned === true) {
              console.log(`User ${user.email} is banned, redirecting...`);

              // Sign out the banned user
              await auth.signOut();

              // Redirect to banned page
              router.push("/banned");
              return;
            }
          }
        } catch (error) {
          console.error("Error checking ban status:", error);
        }
      }
    };

    checkIfBanned();
  }, [user, loading, router]);

  return children;
}
