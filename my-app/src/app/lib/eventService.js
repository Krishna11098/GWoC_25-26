// // src/app/lib/eventService.js
// import { db } from "./firebaseConfig";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   serverTimestamp,
// } from "firebase/firestore";

// class EventService {
//   async createEvent(eventData) {
//     try {
//       console.log("📝 Creating event in Firebase...");
//       const eventsRef = collection(db, "events");
//       const docRef = await addDoc(eventsRef, {
//         title: eventData.title || "Untitled",
//         description: eventData.description || "",
//         date: eventData.date || new Date().toISOString(),
//         location: eventData.location || "Online",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });

//       console.log("✅ Event created with ID:", docRef.id);
//       return { id: docRef.id, ...eventData };
//     } catch (error) {
//       console.error("❌ Firebase Error:", error);
//       // FALLBACK: Error show karo but crash mat karo
//       alert(
//         `Firebase Error: ${error.message}\nCheck console and Firestore rules.`
//       );
//       throw error;
//     }
//   }

//   async getAllEvents() {
//     try {
//       const eventsRef = collection(db, "events");
//       const snapshot = await getDocs(eventsRef);

//       const events = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       console.log(`📊 Loaded ${events.length} events from Firebase`);
//       return events;
//     } catch (error) {
//       console.error("❌ Error loading events:", error);
//       return []; // Empty array return karo
//     }
//   }
// }

// export default new EventService();



// src/app/lib/eventService.js - COMPLETE UPDATE
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

class EventService {
  async createEvent(eventData) {
    try {
      console.log("📝 Creating event in Firebase...");
      const eventsRef = collection(db, "events");
      const docRef = await addDoc(eventsRef, {
        title: eventData.title || "Untitled",
        description: eventData.description || "",
        date: eventData.date || new Date().toISOString(),
        location: eventData.location || "Online",
        category: eventData.category || "general",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("✅ Event created with ID:", docRef.id);
      return { id: docRef.id, ...eventData };
    } catch (error) {
      console.error("❌ Firebase Error:", error);
      alert(
        `Firebase Error: ${error.message}\nCheck console and Firestore rules.`
      );
      throw error;
    }
  }

  async getAllEvents() {
    try {
      const eventsRef = collection(db, "events");
      const snapshot = await getDocs(eventsRef);

      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`📊 Loaded ${events.length} events from Firebase`);
      return events;
    } catch (error) {
      console.error("❌ Error loading events:", error);
      return [];
    }
  }

  // ✅ ADD DELETE FUNCTION
  async deleteEvent(eventId) {
    try {
      if (!eventId) throw new Error("Event ID is required");

      const eventRef = doc(db, "events", eventId);
      await deleteDoc(eventRef);

      console.log("🗑️ Event deleted:", eventId);
      return { success: true, id: eventId };
    } catch (error) {
      console.error("❌ Delete error:", error);
      throw error;
    }
  }

  // ✅ ADD UPDATE FUNCTION
  async updateEvent(eventId, eventData) {
    try {
      if (!eventId) throw new Error("Event ID is required");

      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: serverTimestamp(),
      });

      console.log("✏️ Event updated:", eventId);
      return { success: true, id: eventId, ...eventData };
    } catch (error) {
      console.error("❌ Update error:", error);
      throw error;
    }
  }

  // ✅ ADD GET SINGLE EVENT FUNCTION
  async getEventById(eventId) {
    try {
      // Get all events and filter
      const allEvents = await this.getAllEvents();
      const event = allEvents.find((e) => e.id === eventId);

      if (!event) throw new Error("Event not found");
      return event;
    } catch (error) {
      console.error("❌ Get by ID error:", error);
      throw error;
    }
  }
}

export default new EventService();