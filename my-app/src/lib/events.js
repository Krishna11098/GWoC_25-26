import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";

const eventsCollection = collection(db, "events");

// CREATE: Add new event
export const createEvent = async (eventData) => {
  try {
    const eventWithTimestamps = {
      ...eventData,
      registered: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(eventsCollection, eventWithTimestamps);
    return { id: docRef.id, ...eventWithTimestamps };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// READ: Get all events
export const getAllEvents = async () => {
  try {
    const q = query(eventsCollection, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// READ: Get featured events
export const getFeaturedEvents = async () => {
  try {
    const q = query(
      eventsCollection,
      where("isFeatured", "==", true),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching featured events:", error);
    throw error;
  }
};

// READ: Get single event
export const getEventById = async (eventId) => {
  try {
    const docRef = doc(db, "events", eventId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

// UPDATE: Update event
export const updateEvent = async (eventId, eventData) => {
  try {
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: serverTimestamp(),
    });

    return { id: eventId, ...eventData };
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// DELETE: Remove event
export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, "events", eventId);
    await deleteDoc(eventRef);
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// Get events by category
export const getEventsByCategory = async (category) => {
  try {
    const q = query(
      eventsCollection,
      where("category", "==", category),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching events by category:", error);
    throw error;
  }
};
