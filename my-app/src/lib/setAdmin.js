import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import admin from "firebase-admin";
import { auth } from "./firebaseAdmin.js";

const UID = "LAc8gn1GF7MOPdstELkyuLTztUY2"; // 👈 your UID

async function setAdmin() {
  await auth.setCustomUserClaims(UID, {
    role: "admin",
  });

  console.log("✅ Admin role set for user:", UID);
}

setAdmin();
