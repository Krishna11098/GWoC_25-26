// /app/api/admin/experiences/route.js
import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust this import based on your firebase setup

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category") || "all";
    const sort = searchParams.get("sort") || "newest";

    console.log("Fetching experiences with params:", {
      status,
      category,
      sort,
    });

    // Build Firestore query
    const experiencesRef = collection(db, "experiences");
    const constraints = [];

    // Add status filter
    if (status && status !== "all") {
      constraints.push(where("status", "==", status));
    }

    // Add category filter
    if (category && category !== "all") {
      constraints.push(where("category", "==", category));
    }

    // Create base query with just filters (no orderBy to avoid composite index requirement)
    let q;
    if (constraints.length > 0) {
      q = query(experiencesRef, ...constraints);
    } else {
      q = experiencesRef;
    }

    // Execute query
    const querySnapshot = await getDocs(q);
    const experiences = [];

    querySnapshot.forEach((doc) => {
      experiences.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Apply sorting on client side to avoid Firestore composite index requirement
    const sortedExperiences = sortExperiences(experiences, sort);

    console.log(`Found ${experiences.length} experiences`);

    return NextResponse.json({
      success: true,
      experiences: sortedExperiences,
    });
  } catch (error) {
    console.error("Error fetching experiences from Firebase:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        experiences: [], // Return empty array to prevent frontend crash
      },
      { status: 500 }
    );
  }
}

// Helper function to sort experiences
function sortExperiences(experiences, sortType) {
  const copy = [...experiences];

  switch (sortType) {
    case "newest":
      return copy.sort((a, b) => {
        const dateA =
          a.submittedAt?.toDate?.() || new Date(a.submittedAt) || new Date(0);
        const dateB =
          b.submittedAt?.toDate?.() || new Date(b.submittedAt) || new Date(0);
        return dateB - dateA;
      });
    case "oldest":
      return copy.sort((a, b) => {
        const dateA =
          a.submittedAt?.toDate?.() || new Date(a.submittedAt) || new Date(0);
        const dateB =
          b.submittedAt?.toDate?.() || new Date(b.submittedAt) || new Date(0);
        return dateA - dateB;
      });
    case "date_asc":
      return copy.sort((a, b) => {
        const dateA = new Date(a.eventDate) || new Date(0);
        const dateB = new Date(b.eventDate) || new Date(0);
        return dateA - dateB;
      });
    case "date_desc":
      return copy.sort((a, b) => {
        const dateA = new Date(a.eventDate) || new Date(0);
        const dateB = new Date(b.eventDate) || new Date(0);
        return dateB - dateA;
      });
    case "name_asc":
      return copy.sort((a, b) =>
        (a.fullName || "").localeCompare(b.fullName || "")
      );
    case "name_desc":
      return copy.sort((a, b) =>
        (b.fullName || "").localeCompare(a.fullName || "")
      );
    default:
      return copy;
  }
}
