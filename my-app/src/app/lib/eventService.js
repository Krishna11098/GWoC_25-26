// /lib/eventService.js - COMPLETE VERSION
import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
  Timestamp,
} from "firebase/firestore";

class EventService {
  // Get all events
  static async getAllEvents() {
    try {
      console.log("Fetching all events from Firestore...");
      const eventsRef = collection(db, "events");

      // Try to query with ordering
      try {
        const q = query(eventsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const events = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore Timestamps to Date objects
          date: doc.data().date?.toDate?.() || doc.data().date,
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
        }));

        console.log(`Found ${events.length} events with ordering`);
        return events;
      } catch (orderError) {
        console.log(
          "Order by failed, fetching without order:",
          orderError.message
        );
        // If ordering fails, get all without order
        const snapshot = await getDocs(eventsRef);
        const events = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.() || doc.data().date,
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
        }));
        return events;
      }
    } catch (error) {
      console.error("Error getting events:", error);
      throw error;
    }
  }

  // Get single event by ID
  static async getEventById(eventId) {
    try {
      console.log(`Fetching event with ID: ${eventId}`);
      if (!eventId) {
        throw new Error("Event ID is required");
      }

      const eventRef = doc(db, "events", eventId);
      const eventDoc = await getDoc(eventRef);

      if (!eventDoc.exists()) {
        throw new Error(`Event with ID ${eventId} not found`);
      }

      const data = eventDoc.data();
      const event = {
        id: eventDoc.id,
        ...data,
        // Convert Firestore Timestamps
        date: data.date?.toDate?.() || data.date,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };

      console.log(`Found event: ${event.title || event.name}`);
      return event;
    } catch (error) {
      console.error(`Error getting event ${eventId}:`, error);
      throw error;
    }
  }

  // Create new event
  static async createEvent(eventData) {
    try {
      console.log("Creating new event with data:", eventData);

      // Prepare data for Firestore
      const firestoreData = {
        ...eventData,
        // Convert date string to Timestamp if needed
        date: eventData.date
          ? this.convertToTimestamp(eventData.date)
          : serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "published",
        // Initialize booked seats
        bookedSeats: 0,
        // Ensure all required fields have defaults
        totalSeats: parseInt(eventData.totalSeats) || 50,
        maxSeatsPerUser: parseInt(eventData.maxSeatsPerUser) || 4,
        price:
          eventData.price !== undefined
            ? parseFloat(eventData.price)
            : parseFloat(eventData.pricePerSeat) || 0,
        pricePerSeat:
          eventData.pricePerSeat !== undefined
            ? parseFloat(eventData.pricePerSeat)
            : parseFloat(eventData.price) || 0,
        coinsPerSeat: parseInt(eventData.coinsPerSeat) || 100,
        active: true,
      };

      // Remove any undefined fields
      Object.keys(firestoreData).forEach((key) => {
        if (firestoreData[key] === undefined) {
          delete firestoreData[key];
        }
      });

      const eventsRef = collection(db, "events");
      const docRef = await addDoc(eventsRef, firestoreData);

      console.log("✅ Event created with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  // Update event
  static async updateEvent(eventId, eventData) {
    try {
      console.log(`Updating event ${eventId} with data:`, eventData);

      if (!eventId) {
        throw new Error("Event ID is required");
      }

      const eventRef = doc(db, "events", eventId);

      // Prepare update data
      const updateData = {
        ...eventData,
        updatedAt: serverTimestamp(),
      };

      // Sync price and pricePerSeat if one is updated but not the other
      if (
        updateData.pricePerSeat !== undefined &&
        updateData.price === undefined
      ) {
        updateData.price = updateData.pricePerSeat;
      } else if (
        updateData.price !== undefined &&
        updateData.pricePerSeat === undefined
      ) {
        updateData.pricePerSeat = updateData.price;
      }

      // Convert date if present
      if (updateData.date) {
        updateData.date = this.convertToTimestamp(updateData.date);
      }

      // Remove undefined fields
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      await updateDoc(eventRef, updateData);

      console.log("✅ Event updated:", eventId);
      return eventId;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  // Delete event
  static async deleteEvent(eventId) {
    try {
      console.log(`Deleting event ${eventId}`);

      if (!eventId) {
        throw new Error("Event ID is required");
      }

      const eventRef = doc(db, "events", eventId);
      await deleteDoc(eventRef);

      console.log("✅ Event deleted:", eventId);
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  // Get upcoming events
  static async getUpcomingEvents(limit = 10) {
    try {
      const events = await this.getAllEvents();
      const now = new Date();

      const upcomingEvents = events
        .filter((event) => {
          const eventDate = event.date ? new Date(event.date) : null;
          return eventDate && eventDate >= now;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, limit);

      console.log(`Found ${upcomingEvents.length} upcoming events`);
      return upcomingEvents;
    } catch (error) {
      console.error("Error getting upcoming events:", error);
      throw error;
    }
  }

  // Get events by category
  static async getEventsByCategory(category) {
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("category", "==", category));
      const snapshot = await getDocs(q);

      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || doc.data().date,
      }));

      console.log(`Found ${events.length} events in category: ${category}`);
      return events;
    } catch (error) {
      console.error("Error getting events by category:", error);
      throw error;
    }
  }

  // Get free events
  static async getFreeEvents() {
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("price", "==", 0));
      const snapshot = await getDocs(q);

      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || doc.data().date,
      }));

      console.log(`Found ${events.length} free events`);
      return events;
    } catch (error) {
      console.error("Error getting free events:", error);
      throw error;
    }
  }

  // Get paid events
  static async getPaidEvents() {
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("price", ">", 0));
      const snapshot = await getDocs(q);

      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || doc.data().date,
      }));

      console.log(`Found ${events.length} paid events`);
      return events;
    } catch (error) {
      console.error("Error getting paid events:", error);
      throw error;
    }
  }

  // Helper method to convert various date formats to Firestore Timestamp
  static convertToTimestamp(dateValue) {
    if (!dateValue) return serverTimestamp();

    if (dateValue instanceof Timestamp) {
      return dateValue;
    }

    if (dateValue instanceof Date) {
      return Timestamp.fromDate(dateValue);
    }

    if (typeof dateValue === "string") {
      try {
        return Timestamp.fromDate(new Date(dateValue));
      } catch (error) {
        console.warn("Failed to parse date string:", dateValue, error);
        return serverTimestamp();
      }
    }

    return serverTimestamp();
  }

  // Update booked seats (for booking system)
  static async updateBookedSeats(eventId, seatsToBook) {
    try {
      const eventRef = doc(db, "events", eventId);
      const eventDoc = await getDoc(eventRef);

      if (!eventDoc.exists()) {
        throw new Error("Event not found");
      }

      const eventData = eventDoc.data();
      const currentBookedSeats = eventData.bookedSeats || 0;
      const totalSeats = eventData.totalSeats || 0;

      // Check if enough seats available
      if (currentBookedSeats + seatsToBook > totalSeats) {
        throw new Error("Not enough seats available");
      }

      // Update booked seats
      await updateDoc(eventRef, {
        bookedSeats: currentBookedSeats + seatsToBook,
        updatedAt: serverTimestamp(),
      });

      console.log(
        `Updated booked seats for event ${eventId}: ${currentBookedSeats} → ${
          currentBookedSeats + seatsToBook
        }`
      );
      return true;
    } catch (error) {
      console.error("Error updating booked seats:", error);
      throw error;
    }
  }

  // Check seat availability
  static async checkSeatAvailability(eventId, requestedSeats) {
    try {
      const event = await this.getEventById(eventId);
      const availableSeats = event.totalSeats - (event.bookedSeats || 0);
      return {
        available: availableSeats >= requestedSeats,
        availableSeats,
        totalSeats: event.totalSeats,
        bookedSeats: event.bookedSeats || 0,
      };
    } catch (error) {
      console.error("Error checking seat availability:", error);
      throw error;
    }
  }
}

export default EventService;
