import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Check if user is admin
export const isAdmin = (email) => {
  if (!email) return false;
  const adminEmails =
    process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") ||
    process.env.ADMIN_EMAILS?.split(",") ||
    [];
  return adminEmails.includes(email.trim().toLowerCase());
};

// Login user
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Check if user is admin
    if (!isAdmin(user.email)) {
      await signOut(auth);
      return { success: false, error: "Unauthorized access. Admin only." };
    }

    return { success: true, user };
  } catch (error) {
    let errorMessage = "Invalid email or password";

    switch (error.code) {
      case "auth/invalid-email":
        errorMessage = "Invalid email address";
        break;
      case "auth/user-disabled":
        errorMessage = "Account disabled";
        break;
      case "auth/user-not-found":
        errorMessage = "No account found with this email";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many failed attempts. Try again later";
        break;
    }

    return { success: false, error: errorMessage };
  }
};

// Logout user
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Check if user is authenticated and admin
export const checkAdminAuth = async () => {
  const user = await getCurrentUser();
  return user && isAdmin(user.email);
};
